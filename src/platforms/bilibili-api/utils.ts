import crypto from 'node:crypto';
import { random_audio, random_png_end, random_canvas } from './tools';

export function md5(data: any) {
    const md5Hash = crypto.createHash('md5');
    md5Hash.update(data);
    return md5Hash.digest('hex');
}

const btoa = function (str: string) {
    return Buffer.from(str).toString('base64');
};

export function fakeDmCoverImgStr(str: string) {
    const e = new TextEncoder().encode(str).buffer;
    const n = new Uint8Array(e);
    const r = btoa(String.fromCharCode.apply(null, [...n]));
    return r.substring(0, r.length - 2);
}

export function genExClimbWuzhi(
    uuid: string,
    post_url: string,
    spm_prefix: string
) {
    return {
        '3064': 1,
        '5062': `${Date.now()}`,
        '03bf': `${encodeURIComponent(post_url)}`,
        '39c8': `${spm_prefix}.fp.risk`,
        '3c43': {
            adca: 'Win32',
            '13ab': random_canvas(),
            bfe9: random_png_end(),
            d02f: random_audio()
        },
        df35: uuid
    };
}
