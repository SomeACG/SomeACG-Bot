import { Client } from 'basic-ftp'
import config from '~/config'
import path from 'path'

const client = new Client()

export async function uploadFTP(file_name:string) {
    await client.access({
        host: config.FTP_HOST,
        user: config.FTP_USERNAME,
        password: config.FTP_PASSWORD
    })
    await client.cd('/home/someacg/pictures/')
    let response = await client.uploadFrom(path.resolve(config.TEMP_DIR, file_name), file_name)
    console.log(file_name + ` FTP上传结果: ${response.message}`);
}