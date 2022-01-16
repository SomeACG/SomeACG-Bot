import axios from '~/utils/axios'
import { ArtworkInfo } from '~/types/Artwork'

export default async function getArtworkInfo(post_url: string, picture_index: number = 0): Promise<ArtworkInfo> { 
    let { data } = await axios.get(post_url)
    let htmlData = data as string

    let matchLarge = htmlData.match(/<a class="image-view-large-link" href="(.+)">/)
    let matchOriginal = htmlData.match(/<a class="image-view-original-link" href="(.+)">/)
    let matchWidth = htmlData.match(/data-width="(.+)"/)
    let matchHeight = htmlData.match(/data-height="(.+)"/)

    if(!matchLarge || !matchOriginal || !matchWidth || !matchHeight) 
    throw new Error('Now photo found in the post.')

    return {
        source_type: 'danbooru',
        post_url: post_url,
        url_thumb: matchLarge[1],
        url_origin: matchOriginal[1],
        size: {
            width: parseInt(matchWidth[1]),
            height: parseInt(matchHeight[1])
        }
    }
}