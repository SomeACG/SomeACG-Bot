import { ArtworkInfo } from '~/types/Artwork';
import { getTweetDetails } from './twitter-web-api/tweet';

export default async function getArtworkInfo(
    post_url: string,
    picture_index = 0
): Promise<ArtworkInfo> {
    const tweet_url = new URL(post_url);
    const url_paths = tweet_url.pathname.split('/');
    const tweet = await getTweetDetails(url_paths[3]);

    if (
        !tweet.legacy.extended_entities.media ||
        tweet.legacy.extended_entities.media[0].type !== 'photo'
    )
        throw new Error('此推文中没有任何图片');

    const media = tweet.extended_entities?.media
        ? tweet.legacy.extended_entities.media[picture_index]
        : tweet.legacy.entities.media[picture_index];

    // Remove t.co Links
    const desc = tweet.legacy.full_text.replace(/https:\/\/t.co\/(\w+)/, '');

    return {
        source_type: 'twitter',
        post_url: post_url,
        desc,
        url_thumb: media.media_url_https + '?name=medium',
        url_origin: media.media_url_https + '?name=orig',
        size: {
            width: media.original_info.width,
            height: media.original_info.height
        },
        artist: {
            type: 'twitter',
            name: tweet.core.user_results.result.legacy.name,
            uid: parseInt(tweet.user_id_str),
            username: tweet.core.user_results.result.legacy.screen_name
        }
    };
}
