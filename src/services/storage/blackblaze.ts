import AWS from 'aws-sdk';
import fs from 'fs';
import path from 'path';
import config from '~/config';
import logger from '~/utils/logger';

const credentials = new AWS.Credentials({
    accessKeyId: config.B2_KEY_ID,
    secretAccessKey: config.B2_KEY
});

AWS.config.credentials = credentials;

const endpoint = new AWS.Endpoint(config.B2_ENDPOINT);

const s3 = new AWS.S3({
    endpoint: endpoint,
    credentials: credentials
});

export async function uploadFileB2(file_name: string, sub_dir = '') {
    let extname = path.extname(file_name).substring(1);

    if (extname == 'jpg') extname = 'jpeg';

    const key = config.STORAGE_BASE
        ? `${config.STORAGE_BASE}/${file_name}`
        : file_name;

    s3.putObject(
        {
            Bucket: config.B2_BUCKET,
            Key: key,
            Body: fs.createReadStream(
                path.resolve(config.TEMP_DIR, sub_dir, file_name)
            ),
            ContentType: 'image/' + path.extname(file_name).substring(1)
        },
        err => {
            if (err) {
                logger.error(
                    err,
                    `Failed to upload ${file_name} to S3 storage`
                );
            } else {
                logger.info(`Uploaded ${file_name} to S3 storage`);
            }
        }
    );
}

export async function isB2FileExist(file_path: string): Promise<boolean> {
    return new Promise(resolve => {
        s3.getObject(
            {
                Bucket: config.B2_BUCKET,
                Key: file_path
            },
            err => {
                if (err) return resolve(false);
                return resolve(true);
            }
        );
    });
}
