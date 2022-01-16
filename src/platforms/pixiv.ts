import axios from "~/utils/axios";
import path from 'path'
import { ArtworkInfo, ImageSize } from "~/types/Artwork"

export default async function getArtworkInfo(post_url: string, picture_index: number = 0): Promise<ArtworkInfo> {
    let pixiv_id = path.basename(post_url)
    let { data: responseData } = await axios.get('https://www.pixiv.net/ajax/illust/' + pixiv_id)
    if (responseData['error']) throw new Error(responseData['message'])
    let pixivData = responseData['body']
    if (picture_index > pixivData['sl'] - 1) throw new Error('Picture index out of range')
    let urls = pixivData['urls']
    let size: ImageSize = {
        width: pixivData['width'],
        height: pixivData['height']
    }
    if (picture_index != 0) {
        let { data } = await axios.get(`https://www.pixiv.net/ajax/illust/${pixiv_id}/pages?lang=zh`)
        let pageData = data['body']
        urls = pageData[picture_index]['urls']
        size = {
            width: pageData[picture_index]['width'],
            height: pageData[picture_index]['height']
        }
    }

    // 处理一下
    let desc = pixivData['description'] as string
    desc = desc.replace(/<br(\s+)?\/>/g, '\n')
    let artworkInfo: ArtworkInfo = {
        source_type: 'pixiv',
        post_url: post_url,
        title: pixivData['title'],
        desc: desc,
        url_thumb: urls['regular'],
        url_origin: urls['original'],
        size: size
    }
    return artworkInfo
}