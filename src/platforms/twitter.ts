import { ArtworkInfo } from '~/types/Artwork';
import { getTweetDetails, getUserByUsername } from './twitter-web-api/tweet';

export default async function getArtworkInfo(
    post_url: string,
    picture_index = 0
): Promise<ArtworkInfo> {
    const tweet_url = new URL(post_url);
    const url_paths = tweet_url.pathname.split('/');
    const tweet = await getTweetDetails(url_paths[1], url_paths[3]);
    const user = await getUserByUsername(url_paths[1]);

    if (
        !tweet.extended_entities.media ||
        tweet.extended_entities.media[0].type !== 'photo'
    )
        throw new Error('此推文中没有任何图片');

    const media = tweet.extended_entities?.media
        ? tweet.extended_entities.media[picture_index]
        : tweet.entities.media[0];

    // Remove t.co Links
    const desc = tweet.full_text.replace(/https:\/\/t.co\/(\w+)/, '');

    return {
        source_type: 'twitter',
        post_url: post_url,
        desc,
        url_thumb: media.media_url_https + '?name=medium',
        url_origin: media.media_url_https + '?name=4096x4096',
        size: {
            width: media.sizes.large.w,
            height: media.sizes.large.h
        },
        artist: {
            type: 'twitter',
            name: user.name,
            uid: parseInt(tweet.user_id_str),
            username: user.screen_name
        }
    };
}
