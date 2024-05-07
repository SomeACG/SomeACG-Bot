import axios, { AxiosResponse } from 'axios';
import config from '~/config';
import { PixivAjaxResp } from '~/types/Pixiv';

const commonHeaders = {
    'accept-language':
        'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7,ja-JP;q=0.6,ja;q=0.5',
    'user-agent':
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
};

const defaultInstance = axios.create({
    headers: commonHeaders
});

const pixivInstance = axios.create({
    headers: {
        cookie: config.PIXIV_COOKIE,
        ...commonHeaders
    }
});

pixivInstance.interceptors.response.use(
    (response: AxiosResponse<PixivAjaxResp<unknown>>) => {
        if (response.status != 200) {
            if (response.data.error && response.data.message) {
                throw new Error(response.data.message);
            } else {
                throw new Error(
                    `pixiv ajax request failed with status code ${response.status}`
                );
            }
        }
        return response;
    }
);

export default defaultInstance;

export { pixivInstance };
