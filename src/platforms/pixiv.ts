import axios from '~/utils/axios';
import path from 'path';
import { ArtworkInfo, ImageSize } from '~/types/Artwork';
import logger from '~/utils/logger';

export default async function getArtworkInfo(
    post_url: string,
    picture_index = 0
): Promise<ArtworkInfo> {
    const pixiv_id = path.basename(post_url);
    const { data: responseData } = await axios.get(
        'https://www.pixiv.net/ajax/illust/' + pixiv_id
    );
    if (responseData['error']) throw new Error(responseData['message']);
    const pixivData = responseData['body'];
    if (picture_index > pixivData['pageCount'] - 1)
        throw new Error('Picture index out of range');
    // let urls = pixivData['urls'];
    // let size: ImageSize = {
    //     width: pixivData['width'],
    //     height: pixivData['height']
    // };

    const { data } = await axios.get(
        `https://www.pixiv.net/ajax/illust/${pixiv_id}/pages?lang=zh`
    );
    const pageData = data['body'];
    const urls = pageData[picture_index]['urls'];
    const size = {
        width: pageData[picture_index]['width'],
        height: pageData[picture_index]['height']
    };

    // 处理一下
    let desc = pixivData['description'] as string;
    desc = desc.replace(/<br(\s+)?\/>/g, '\n');
    const artworkInfo: ArtworkInfo = {
        source_type: 'pixiv',
        post_url: post_url,
        title: pixivData['title'],
        desc: desc,
        url_thumb: urls['regular'],
        url_origin: urls['original'],
        size: size
    };
    return artworkInfo;
}
