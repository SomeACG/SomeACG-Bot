import axios from '~/utils/axios';
import { ArtworkInfo } from '~/types/Artwork';

export default async function getArtworkInfo(
    post_url: string
): Promise<ArtworkInfo> {
    const { data } = await axios.get(post_url);
    const htmlData = data as string;

    const matchLarge = htmlData.match(
        /<a class="image-view-large-link" href="(.+)">/
    );
    const matchOriginal = htmlData.match(
        /<a class="image-view-original-link" href="(.+)">/
    );
    const matchArtist = htmlData.match(
        /<li class="tag-type-1" data-tag-name="(.+)"/
    );
    const matchWidth = htmlData.match(/data-width="(.+)"/);
    const matchHeight = htmlData.match(/data-height="(.+)"/);

    if (!matchLarge || !matchOriginal || !matchWidth || !matchHeight)
        throw new Error('Now photo found in the post.');

    return {
        source_type: 'danbooru',
        post_url: post_url,
        url_thumb: matchLarge[1],
        url_origin: matchOriginal[1],
        size: {
            width: parseInt(matchWidth[1]),
            height: parseInt(matchHeight[1])
        },
        artist: {
            type: 'danbooru',
            username: matchArtist ? matchArtist[1] : 'Unknown',
            name: matchArtist ? matchArtist[1] : 'Unknown'
        }
    };
}
