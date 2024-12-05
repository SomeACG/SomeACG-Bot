import { pixivInstance as axios } from '~/utils/axios';
import path from 'path';
import { ArtworkInfo } from '~/types/Artwork';
import { PixivAjaxResp, PixivIllust, PixivIllustPages } from '~/types/Pixiv';

export default async function getArtworkInfo(
    post_url: string,
    indexes = [0]
): Promise<ArtworkInfo> {
    const pixiv_id = post_url.includes('illust_id=')
        ? /illust_id=(\d{7,9})/.exec(post_url)[1]
        : path.basename(post_url);
    const {
        data: { body: illust }
    } = await axios.get<PixivAjaxResp<PixivIllust>>(
        'https://www.pixiv.net/ajax/illust/' + pixiv_id
    );

    if (indexes.length === 1 && indexes[0] === -1)
        indexes = Array.from({ length: illust.pageCount }, (_, i) => i);

    if (indexes[indexes.length - 1] > illust.pageCount - 1)
        throw new Error('Picture index out of range');

    const {
        data: { body: illust_pages }
    } = await axios.get<PixivAjaxResp<PixivIllustPages>>(
        `https://www.pixiv.net/ajax/illust/${pixiv_id}/pages?lang=zh`
    );

    const photos = illust_pages
        .filter((_, index) => indexes.includes(index))
        .map(item => {
            return {
                url_thumb: item.urls.regular,
                url_origin: item.urls.original,
                size: {
                    width: item.width,
                    height: item.height
                }
            };
        });

    const tags = illust.tags.tags.map(item => {
        if (item.tag === 'R-18') item.tag = 'R18';

        item.tag = item.translation?.en ? item.translation.en : item.tag;

        item.tag = item.tag.replace(/\s/g, '_');

        return item.tag;
    });

    const illust_desc = illust.description;

    // Remoie all the html tags in the description
    // .replace(/<[^>]+>/g, '');

    const artworkInfo: ArtworkInfo = {
        source_type: 'pixiv',
        post_url: post_url,
        title: illust.title,
        desc: illust_desc,
        raw_tags: tags,
        artist: {
            type: 'pixiv',
            uid: parseInt(illust.userId),
            name: illust.userName
        },
        photos
    };

    return artworkInfo;
}
