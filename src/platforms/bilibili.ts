import { ArtworkInfo } from '~/types/Artwork';
import config from '~/config';
import axios from '~/utils/axios';
import type { AltBiliDynamicData, BiliResponse } from '~/types/Bilibili';
import logger from '~/utils/logger';
import DynamicFetcher from './bilibili-api/dynamic';

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
        throw new Error('无效的B站动态链接');
    }

    let dynamic_info: AltBiliDynamicData;

    const BILI_ALT_API = config.BILI_ALT_API;

    if (!BILI_ALT_API) {
        logger.warn('BILI_ALT_API未设置，可能无法获取B站动态内容');

        const fetcher = new DynamicFetcher(dynamic_id);
        const info = await fetcher.detail();

        dynamic_info = info.item;
    } else {
        const resp = await axios.get<BiliResponse<AltBiliDynamicData>>(
            `${BILI_ALT_API}/api/dynamic/${dynamic_id}`
        );
        dynamic_info = resp.data.data;
    }

    let dynamic = dynamic_info.modules;

    // For forwarded dynamic, use the original dynamic as artwork source
    if (dynamic_info.orig && dynamic_info.type === 'DYNAMIC_TYPE_FORWARD') {
        dynamic = dynamic_info.orig.modules;

        // Replace the post_url dynamic id with the original dynamic id
        post_url = post_url.replace(dynamic_id, dynamic_info.orig.id_str);
    }

    if (
        !dynamic.module_dynamic.major ||
        dynamic.module_dynamic.major.type !== 'MAJOR_TYPE_OPUS'
    ) {
        throw new Error('B站动态类型似乎不正确');
    }

    if (dynamic.module_dynamic.major.opus.pics.length === 0) {
        throw new Error('该动态中似乎没有图片');
    }

    if (indexes.length === 1 && indexes[0] === -1)
        indexes = Array.from(
            {
                length: dynamic.module_dynamic.major.opus.pics.length
            },
            (_, i) => i
        );

    const photos = dynamic.module_dynamic.major.opus.pics
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
        title: dynamic.module_dynamic.major.opus.title || undefined,
        desc: dynamic.module_dynamic.major.opus.summary?.text || undefined,
        artist: {
            type: 'bilibili',
            uid: dynamic.module_author.mid,
            name: dynamic.module_author.name
        },
        photos
    };
}
