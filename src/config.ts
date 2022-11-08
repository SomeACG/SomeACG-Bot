import dotenv from 'dotenv';
dotenv.config();
import path from 'path';
import * as env from 'env-var';

export default {
    DB_URL: env.get('DB_URL').required().asString(),
    BOT_TOKEN: env.get('BOT_TOKEN').required().asString(),
    PORT: process.env.PORT || 3000,
    PUSH_CHANNEL: env.get('PUSH_CHANNEL').required().asString(),
    BASE_DIR: path.resolve(__dirname, '..'),
    TEMP_DIR: env.get('DEV_MODE').asBool()
        ? path.resolve(__dirname, '../temp')
        : '/tmp',
    TWITTER_API_KEY: env.get('TWITTER_API_KEY').required().asString(),
    TWITTER_API_SECRET: env.get('TWITTER_API_SECRET').required().asString(),
    CLIENT_ID: env.get('CLIENT_ID').required().asString(),
    CLIENT_SECRET: env.get('CLIENT_SECRET').required().asString(),
    REFRESH_TOKEN: env.get('REFRESH_TOKEN').required().asString(),
    OSS_PUT_BASE_PATH: env.get('PUT_URL').required().asString(),
    ADMIN_LIST: env.get('ADMIN_LIST').required().asArray(),
    THUMB_BASE: env.get('THUMB_BASE').required().asString(),
    FTP_HOST: env.get('FTP_HOST').required().asString(),
    FTP_USERNAME: env.get('FTP_USERNAME').required().asString(),
    FTP_PASSWORD: env.get('FTP_PASSWORD').required().asString(),
    VERSION: env.get('VERSION').required().asString(),
    DEV_MODE: env.get('DEV_MODE').asBool(),
    USE_PROXY: env.get('USE_PROXY').asBool(),
    B2_ENDPOINT: env.get('B2_ENDPOINT').required().asString(),
    B2_KEY_ID: env.get('B2_KEY_ID').required().asString(),
    B2_KEY: env.get('B2_KEY').required().asString()
};
