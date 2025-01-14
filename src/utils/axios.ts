import axios, { AxiosResponse } from 'axios';
import config from '~/config';
import { PixivAjaxResp } from '~/types/Pixiv';
import logger from './logger';

export const commonHeaders = {
    'accept-language':
        'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7,ja-JP;q=0.6,ja;q=0.5',
    'user-agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64;) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.6478.61 Chrome/126.0.6478.61 Not/A)Brand/8  Safari/537.36'
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

defaultInstance.interceptors.request.use(req => {
    logger.debug(`requesting ${req.url}`);
    logger.debug(`request headers: ${JSON.stringify(req.headers)}`);
    logger.debug(`request params: ${JSON.stringify(req.params)}`);
    logger.debug(`request data: ${JSON.stringify(req.data)}`);

    return req;
});

defaultInstance.interceptors.response.use((response: AxiosResponse) => {
    logger.debug(`response status: ${response.status}`);
    logger.debug(`response body: ${JSON.stringify(response.data)}`);

    return response;
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
