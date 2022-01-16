import path from 'path'
import fs from 'fs'
import axios from "./axios";
import config from "~/config";

export default async function downloadFile(url: string, file_name?: string): Promise<string> {
    file_name = file_name ? file_name : path.basename(url)
    let file_path = path.resolve(config.TEMP_DIR, file_name)
    let response = await axios.get(url, {
        responseType: 'arraybuffer',
        headers: {
            'referer': url.search('pximg.net') == -1 ? '' : 'https://www.pixiv.net/'
        }
    })

    let stream = fs.createWriteStream(file_path)
    stream.write(response.data)

    return file_name
}