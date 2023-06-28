import axios from '~/utils/axios';
import config from '~/config';
import logger from '~/utils/logger';
import { getConfig, setConfig } from '~/database/operations/config';
import { Config } from '~/types/Config';

const AUTH_URL = 'https://login.microsoftonline.com/common/oauth2/v2.0/token';

export default async function getAccessToken(): Promise<string> {
    const stored_refresh_token = await getConfig(Config.REFRESH_TOKEN);

    const body = new URLSearchParams();
    body.append('client_id', config.CLIENT_ID);
    body.append('client_secret', config.CLIENT_SECRET);
    body.append('refresh_token', stored_refresh_token);
    body.append('redirect_uri', 'http://localhost');
    body.append('grant_type', 'refresh_token');

    const response = await axios.post(AUTH_URL, body, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });

    const { access_token, refresh_token } = response.data;

    if (!access_token) {
        logger.error('Failed to get onedrive access token');
        throw new Error('Failed to get onedrive access token');
    }

    await setConfig(Config.REFRESH_TOKEN, refresh_token);
    return response.data.access_token;
}
