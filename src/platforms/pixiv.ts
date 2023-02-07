import { pixivInstance as axios } from '~/utils/axios';
import path from 'path';
import { ArtworkInfo } from '~/types/Artwork';
import { PixivAjaxResp, PixivIllust, PixivIllustPages } from '~/types/Pixiv';

export default async function getArtworkInfo(
    post_url: string,
    picture_index = 0
): Promise<ArtworkInfo> {
    const pixiv_id = path.basename(post_url);
    const {
        data: { body: illust }
    } = await axios.get<PixivAjaxResp<PixivIllust>>(
        'https://www.pixiv.net/ajax/illust/' + pixiv_id
    );

    if (picture_index > illust.pageCount - 1)
        throw new Error('Picture index out of range');

    const {
        data: { body: illust_pages }
    } = await axios.get<PixivAjaxResp<PixivIllustPages>>(
        `https://www.pixiv.net/ajax/illust/${pixiv_id}/pages?lang=zh`
    );

    const urls = illust_pages[picture_index]['urls'];
    const size = {
        width: illust_pages[picture_index]['width'],
        height: illust_pages[picture_index]['height']
    };

    const tags = illust.tags.tags.map(item => {
        if (item.tag === 'R-18') item.tag = 'R18';

        item.tag = item.tag.replace(/\s/g, '_');

        return item.translation?.en ? item.translation.en : item.tag;
    });

    // 处理一下
    const desc = illust.description.replace(/<br(\s+)?\/>/g, '\n');

    const artworkInfo: ArtworkInfo = {
        source_type: 'pixiv',
        post_url: post_url,
        title: illust.title,
        desc: desc,
        url_thumb: urls.regular,
        url_origin: urls.original,
        size: size,
        raw_tags: tags,
        artist: {
            type: 'pixiv',
            uid: parseInt(illust.userId),
            name: illust.userName
        }
    };

    return artworkInfo;
}
