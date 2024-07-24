import axios from '~/utils/axios';
import { ArtworkInfo } from '~/types/Artwork';
import { BiliResponse } from '~/types/Bilibili';
const API_PATH = 'https://api.bilibili.com/x/polymer/web-dynamic/v1/detail';

const baseParams = new URLSearchParams([
    ['timezone_offset', '-480'],
    ['platform', 'web'],
    ['features', 'itemOpusStyle']
]);

export default async function getArtworkInfo(
    post_url: string,
    indexes = [0]
): Promise<ArtworkInfo> {
    const url = new URL(post_url);

    const dynamic_id =
        url.pathname.indexOf('/') == -1
            ? url.pathname
            : url.pathname.split('/').pop();

    if (!dynamic_id) {
        throw new Error('Bilibili URL is invalid');
    }

    baseParams.append('id', dynamic_id);

    const { data } = await axios.get<BiliResponse>(API_PATH, {
        params: baseParams,
        headers: {
            referer: 'https://t.bilibili.com/'
        }
    });

    if (data.code !== 0) {
        throw new Error(data.message);
    }

    if (
        data.data.item.modules.module_dynamic.major.type !== 'MAJOR_TYPE_OPUS'
    ) {
        throw new Error('Dynamic is not a bilibili opus post');
    }

    if (data.data.item.modules.module_dynamic.major.opus.pics.length === 0) {
        throw new Error('Dynamic does not contain any images');
    }

    if (indexes.length === 1 && indexes[0] === -1)
        indexes = Array.from(
            {
                length: data.data.item.modules.module_dynamic.major.opus.pics
                    .length
            },
            (_, i) => i
        );

    const photos = data.data.item.modules.module_dynamic.major.opus.pics
        .filter((_, index) => indexes.includes(index))
        .map(item => ({
            url_thumb: item.url + '@1024w_1024h.jpg',
            url_origin: item.url,
            size: {
                width: item.width,
                height: item.height
            }
        }));

    return {
        source_type: 'bilibili',
        post_url: post_url,
        title:
            data.data.item.modules.module_dynamic.major.opus.title || undefined,
        desc:
            data.data.item.modules.module_dynamic.major.opus.summary?.text ||
            undefined,
        artist: {
            type: 'bilibili',
            uid: data.data.item.modules.module_author.mid,
            name: data.data.item.modules.module_author.name
        },
        photos
    };
}
