import path from 'path';
import fs from 'fs';
import axios from 'axios';
import config from '~/config';
import logger from './logger';

export default async function downloadFile(
    url: string,
    file_name?: string,
    sub_dir = ''
): Promise<string> {
    file_name = file_name ? file_name : path.basename(url);
    logger.info('Start download file ' + file_name);
    const file_path = path.resolve(config.TEMP_DIR, sub_dir, file_name);

    if (sub_dir && !fs.existsSync(path.resolve(config.TEMP_DIR, sub_dir))) {
        fs.mkdirSync(path.resolve(config.TEMP_DIR, sub_dir), {
            recursive: true
        });
    }

    const headers = {};

    if (url.includes('pximg.net')) {
        Object.assign(headers, {
            referer: 'https://www.pixiv.net/'
        });
    }

    if (url.includes('hdslb.com')) {
        Object.assign(headers, {
            referer: 'https://www.bilibili.com/'
        });
    }

    try {
        const response = await axios.get(url, {
            responseType: 'arraybuffer',
            headers
        });

        fs.writeFileSync(file_path, response.data);

        logger.info('File ' + file_name + ' downloaded');
    } catch (e) {
        logger.error('Download file ' + file_name + ' failed: ' + e);
        throw new Error('无法下载 ' + file_name);
    }

    // 用 Stream 经常会出现这边写完那边读不到的问题，很奇怪
    // let stream = fs.createWriteStream(file_path)
    // stream.write(response.data)

    return file_name;
}
