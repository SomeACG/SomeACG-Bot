// https://github.com/BennettChina/hot-news/blob/v3/util/tools.ts

import { randomBytes } from 'crypto';

export function random_canvas() {
    const rand_png = Uint8Array.from([
        ...randomBytes(2),
        0x00,
        0x00,
        0x00,
        0x00,
        73,
        69,
        78,
        68,
        0x00,
        0xe0a0,
        0x00,
        0x2000
    ]);
    return Buffer.from(rand_png).toString('base64');
}

export function random_audio() {
    const min = 124.04347;
    const max = 124.04348;
    return Math.random() * (max - min) + min;
}

export function random_png_end() {
    const rand_png = Uint8Array.from([
        ...randomBytes(32),
        0x00,
        0x00,
        0x00,
        0x00,
        73,
        69,
        78,
        68,
        ...randomBytes(4)
    ]);
    return Buffer.from(rand_png).toString('base64').slice(-50);
}
