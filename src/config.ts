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
    PORT: process.env.PORT || 3000,
    PUSH_CHANNEL: env.get('PUSH_CHANNEL').required().asString(),
    BASE_DIR: path.resolve(__dirname, '..'),
    TEMP_DIR: env.get('DEV_MODE').asBool()
        ? path.resolve(__dirname, '../temp')
        : '/tmp',
    CLIENT_ID: env.get('CLIENT_ID').required().asString(),
    CLIENT_SECRET: env.get('CLIENT_SECRET').required().asString(),
    ADMIN_LIST: env.get('ADMIN_LIST').required().asArray(),
    VERSION: env.get('VERSION').asString() || package_info.version,
    DEV_MODE: env.get('DEV_MODE').asBool(),
    USE_PROXY: env.get('USE_PROXY').asBool(),
    B2_ENDPOINT: env.get('B2_ENDPOINT').required().asString(),
    B2_KEY_ID: env.get('B2_KEY_ID').required().asString(),
    B2_KEY: env.get('B2_KEY').required().asString(),
    PIXIV_COOKIE: env.get('PIXIV_COOKIE').asString()
};
