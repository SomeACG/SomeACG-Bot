import path from 'path';
import fs from 'fs';
import axios from './axios';
import config from '~/config';
import logger from './logger';

export default async function downloadFile(
    url: string,
    file_name?: string
): Promise<string> {
    file_name = file_name ? file_name : path.basename(url);
    logger.info('Start download file ' + file_name);
    const file_path = path.resolve(config.TEMP_DIR, file_name);
    const response = await axios.get(url, {
        responseType: 'arraybuffer',
        headers: {
            referer:
                url.search('pximg.net') == -1 ? '' : 'https://www.pixiv.net/'
        }
    });

    // 用 Stream 经常会出现这边写完那边读不到的问题，很奇怪
    // let stream = fs.createWriteStream(file_path)
    // stream.write(response.data)

    fs.writeFileSync(file_path, response.data);

    logger.info('File ' + file_name + ' downloaded');

    return file_name;
}
