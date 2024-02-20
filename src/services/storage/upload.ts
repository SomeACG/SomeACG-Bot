import path from 'path';
import fs from 'fs';
import axios from '~/utils/axios';
import getAccessToken from '../graph/auth';
import config from '~/config';
import logger from '~/utils/logger';

const ONEDRIVE_UPLOAD_PATH = process.env.DEV_MODE
    ? '/SomeACG_Test'
    : '/SomeACG';

const SITE_PATH = config.SP_SITE_ID ? `/sites/${config.SP_SITE_ID}` : '/me';

export async function uploadOneDrive(file_name: string): Promise<void> {
    const access_token = await getAccessToken();
    const file_path = path.resolve(config.TEMP_DIR, file_name);
    const uploadSession = await axios.post(
        `https://graph.microsoft.com/v1.0${SITE_PATH}/drive/root:${ONEDRIVE_UPLOAD_PATH}/${file_name}:/createUploadSession`,
        undefined,
        { headers: { Authorization: `Bearer ${access_token}` } }
    );
    const uploadUrl = uploadSession.data.uploadUrl as string;
    if (!uploadUrl) {
        logger.error(
            uploadSession.data,
            'Failed to get onedrive upload session'
        );
        throw new Error('Failed to get onedrive upload session');
    }

    const filestream = fs.createReadStream(file_path);
    const fileLength = fs.readFileSync(file_path).length;

    const uploadRequest = await axios.put(uploadUrl, filestream, {
        headers: {
            'Content-Length': fileLength.toString(),
            'Content-Range': `bytes 0-${fileLength - 1}/${fileLength}`,
            Authorization: `Bearer ${access_token}`
        },
        maxContentLength: 52428890,
        maxBodyLength: 52428890
    });
    if (uploadRequest.status === 200 || uploadRequest.status === 201) {
        logger.info(`Uploaded ${file_name} to OneDrive`);
    } else {
        logger.error(`Failed to upload ${file_name} to OneDrive`);
    }
}
