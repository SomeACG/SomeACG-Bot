import sharp from 'sharp';
import path from 'path';
import config from '~/config';
import fs from 'fs/promises';
import type { ImageSize } from '~/types/Artwork';

export async function getImageSize(file_name: string) {
    const file_path = path.resolve(config.TEMP_DIR, file_name);

    const { width, height } = await sharp(file_path).metadata();

    return { width, height } as ImageSize;
}

export async function getFileSize(file_name: string) {
    const file_path = path.resolve(config.TEMP_DIR, file_name);
    const stats = await fs.stat(file_path);

    return stats.size;
}
