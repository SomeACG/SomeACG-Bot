/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const { CookieJar, Cookie } = require('tough-cookie');
const { promisify } = require('util');
const axios = require('axios');
const constants = require('./constants.js');
// https://github.com/mikf/gallery-dl/blob/a53cfc845e12d9e98fefd07e43ebffaec488c18f/gallery_dl/extractor/twitter.py#L716-L726
const headers = {
    authorization: '',
    // reference: https://github.com/dangeredwolf/FixTweet/blob/f3082bbb0d69798687481a605f6760b2eb7558e0/src/constants.ts#L23-L25
    'x-guest-token': '',
    'x-twitter-auth-type': '',
    'x-twitter-client-language': 'en',
    'x-twitter-active-user': 'yes',
    'x-csrf-token': '',
    'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
    Referer: 'https://twitter.com/',
};

let cookieJar, setCookie, getCookies, tries = 0;

const cookiedomain = 'twitter.com';
const cookieurl = 'https://twitter.com';

async function twitterGot(options) {
    const response = await axios({
        ...options,
        headers: { 
            ...headers, 
            ...(options.headers || {}),
            'cookie': cookieJar.getCookieStringSync(options.url)
        },
    });
    // 更新csrfToken
    for (const c of await getCookies(cookieurl)) {
        if (c.key === 'ct0') {
            headers['x-csrf-token'] = c.value;
        }
    }
    return response;
}

async function resetSession() {
    cookieJar = new CookieJar();
    getCookies = promisify(cookieJar.getCookies.bind(cookieJar));
    setCookie = promisify(cookieJar.setCookie.bind(cookieJar));
    let response;
    
    headers.authorization = `Basic ${Buffer.from(constants.tokens[tries++ % constants.tokens.length]).toString('base64')}`;
    response = await twitterGot({
        url: 'https://api.twitter.com/oauth2/token',
        method: 'POST',
        params: { grant_type: 'client_credentials' },
    });
    headers.authorization = `Bearer ${response.data.access_token}`;
    // 生成csrf-token
    const csrfToken = [...Array(16 * 2)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
    await setCookie(new Cookie({ key: 'ct0', value: csrfToken, domain: cookiedomain, secure: false }), cookieurl);
    headers['x-csrf-token'] = csrfToken;
    headers['x-guest-token'] = '';
    // 发起初始化请求
    response = await twitterGot({
        url: 'https://api.twitter.com/1.1/guest/activate.json',
        method: 'POST',
    });
    // 获取guest-token
    // TODO: OAuth2Session, 参见 https://github.com/DIYgod/RSSHub/pull/7739#discussionR655932602
    const guestToken = response.data.guest_token;
    headers['x-guest-token'] = guestToken;
    await setCookie(new Cookie({ key: 'gt', value: guestToken, domain: cookiedomain, secure: false }), cookieurl);
    // 发起第二个初始化请求, 获取_twitter_sess
    await twitterGot({
        url: 'https://twitter.com/i/js_inst',
        method: 'GET',
        params: { c_name: 'ui_metrics' },
    });
    return cookieJar;
}

const initSession = () => cookieJar || resetSession();

async function twitterRequest(url, params, method) {
    await initSession();
    // 发起请求
    const request = () =>
        twitterGot({
            url,
            method,
            params,
        });
    let response;
    try {
        response = await request();
    } catch (e) {
        if (e.response.status === 403) {
            await resetSession();
            response = await request();
        } else {
            throw e;
        }
    }
    return response.data;
}

module.exports = twitterRequest;