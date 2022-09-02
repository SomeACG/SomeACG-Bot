import AWS from 'aws-sdk'
import fs from 'fs'
import path from 'path'
import config from '~/config'

let credentials = new AWS.Credentials({ accessKeyId: config.B2_KEY_ID, secretAccessKey: config.B2_KEY })
AWS.config.credentials = credentials

let endpoint = new AWS.Endpoint(config.B2_ENDPOINT)

const s3 = new AWS.S3({ endpoint })

export async function uploadFileB2(file_name: string) {

    s3.putObject({ 
        Bucket: 'someacg',
        Key: 'thumbs/' + file_name,
        Body: fs.createReadStream(path.resolve(config.TEMP_DIR, file_name))
     }, err => {
        if(err) {
            console.log('文件', file_name, 'B2上传失败:')
            console.log(err)
        }
        else{
            console.log('文件', file_name, 'B2上传成功')
        }
     })
}