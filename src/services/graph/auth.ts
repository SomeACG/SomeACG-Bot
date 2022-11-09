import axios from '~/utils/axios';
import config from '~/config';
import logger from '~/utils/logger';

const AUTH_URL = 'https://login.microsoftonline.com/common/oauth2/v2.0/token';

export default async function getAccessToken(): Promise<string> {
    const body = new URLSearchParams();
    body.append('client_id', config.CLIENT_ID);
    body.append('client_secret', config.CLIENT_SECRET);
    body.append('refresh_token', config.REFRESH_TOKEN);
    body.append('redirect_uri', 'http://localhost');
    body.append('grant_type', 'refresh_token');

    const response = await axios.post(AUTH_URL, body, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });

    if (response.data.access_token) {
        return response.data.access_token;
    }

    logger.error('Failed to get onedrive access token');
    throw new Error('Failed to get onedrive access token');
}
