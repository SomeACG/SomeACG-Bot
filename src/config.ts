import dotenv from 'dotenv';

const DOTENV_PATH = process.env.DOTENV_NAME
    ? `.env.${process.env.DOTENV_NAME}`
    : '.env';

dotenv.config({
    path: DOTENV_PATH
});

import path from 'path';
import * as env from 'env-var';
import package_info from 'package.json';

export default {
    DB_URL: env.get('DB_URL').required().asString(),
    BOT_TOKEN: env.get('BOT_TOKEN').required().asString(),
    PORT: process.env.PORT || 3001,
    PUSH_CHANNEL: env.get('PUSH_CHANNEL').required().asString(),
    BASE_DIR: path.resolve(__dirname, '..'),
    TEMP_DIR: env.get('DEV_MODE').asBool()
        ? path.resolve(__dirname, '../temp')
        : '/tmp',
    CLIENT_ID: env.get('CLIENT_ID').asString(),
    CLIENT_SECRET: env.get('CLIENT_SECRET').asString(),
    ADMIN_LIST: env.get('ADMIN_LIST').required().asArray(),
    VERSION: env.get('VERSION').asString() || package_info.version,
    DEV_MODE: env.get('DEV_MODE').asBool(),
    USE_PROXY: env.get('USE_PROXY').asBool(),
    STORAGE_TYPE: env.get('STORAGE_TYPE').required().asString(),
    STORAGE_BASE: env.get('STORAGE_BASE').asString(),
    B2_ENDPOINT: env.get('B2_ENDPOINT').asString(),
    B2_BUCKET: env.get('B2_BUCKET').asString(),
    B2_KEY_ID: env.get('B2_KEY_ID').asString(),
    B2_KEY: env.get('B2_KEY').asString(),
    PIXIV_COOKIE: env.get('PIXIV_COOKIE').asString(),
    SP_SITE_ID: env.get('SP_SITE_ID').asString(),
    BILI_ALT_API: env.get('BILI_ALT_API').asString()
};
