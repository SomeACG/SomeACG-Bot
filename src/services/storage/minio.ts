import path from 'path'
import { Client } from 'minio'
import config from '~/config'

let client = new Client({
    endPoint: config.MINIO_ENDPOINT,
    port: 9199,
    useSSL: false,
    accessKey: config.MINIO_ACCESS_KEY,
    secretKey: config.MINIO_SECRET_KEY
})

// let client = new Client({
//     endPoint: 'play.min.io',
//     port: 9000,
//     useSSL: true,
//     accessKey: 'Q3AM3UQ867SPQQA43P2F',
//     secretKey: 'zuf+tfteSlswRu7BJ86wekitnifILbZam1KYY3TG'
// });

export async function uploadMinIO(file_name:string) {
    // let bucketExists = await client.bucketExists('someacg')
    // if(!bucketExists) await client.makeBucket('someacg','us-east-1')
    let object_info = await client.fPutObject('someacg', file_name, path.resolve(config.TEMP_DIR,file_name),{
        'Content-Type': 'image/jpeg'
    })
}