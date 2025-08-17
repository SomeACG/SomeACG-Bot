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

export async function resizeFitChannelPhoto(
    origin_file_path: string,
    thumb_file_path: string
) {
    const file_name = path.basename(origin_file_path);
    // First, if the file is png, convert it to jpeg with max size 10MB, then resize at max 2560x2560
    const output_name = `channel_${file_name}`;
    const output_path = path.resolve(config.TEMP_DIR, output_name);
    const output = await sharp(origin_file_path)
        .jpeg({ quality: 98 })
        .resize({ width: 2560, height: 2560, fit: 'inside' })
        .toFile(output_path);

    if (output.size < 10 * 1024 * 1024) return output_path;

    // Process again with quality 80
    const output_quality_80 = await sharp(output_path)
        .jpeg({ quality: 80 })
        .toFile(output_path);

    if (output_quality_80.size < 10 * 1024 * 1024) return output_path;

    // Give up and use thumbnail file
    return thumb_file_path;
}
