import dotenv from 'dotenv'; dotenv.config()
import path from 'path'
import * as env from 'env-var'

export default {
    DB_URL: env.get('DB_URL').required().asString(),
    BOT_TOKEN: env.get('BOT_TOKEN').required().asString(),
    PORT: process.env.PORT || 3000,
    PUSH_CHANNEL: env.get('PUSH_CHANNEL').required().asString(),
    BASE_DIR: path.resolve(__dirname, '..'),
    TEMP_DIR: path.resolve(__dirname, '../temp'),
    TWITTER_API_KEY: env.get('TWITTER_API_KEY').required().asString(),
    TWITTER_API_SECRET: env.get('TWITTER_API_SECRET').required().asString(),
    CLIENT_ID: env.get('CLIENT_ID').required().asString(),
    CLIENT_SECRET: env.get('CLIENT_SECRET').required().asString(),
    REFRESH_TOKEN: env.get('REFRESH_TOKEN').required().asString(),
    OSS_PUT_BASE_PATH: env.get('PUT_URL').required().asString(),
    ADMIN_LIST: env.get('ADMIN_LIST').required().asArray(),
    THUMB_BASE: env.get('THUMB_BASE').required().asString(),
    MINIO_ENDPOINT: env.get('MINIO_ENDPOINT').required().asString(),
    MINIO_ACCESS_KEY: env.get('MINIO_ACCESS_KEY').required().asString(),
    MINIO_SECRET_KEY: env.get('MINIO_SECRET_KEY').required().asString(),
    VERSION: env.get('VERSION').required().asString()
}