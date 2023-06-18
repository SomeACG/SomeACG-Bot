import path from 'path';
import { ArtworkInfo } from '~/types/Artwork';
import { getTweetDetails } from './twitter-web-api/tweet';
import { get } from 'mongoose';

export default async function getArtworkInfo(
    post_url: string,
    picture_index = 0
): Promise<ArtworkInfo> {
    const tweet_url = new URL(post_url);
    const url_paths = tweet_url.pathname.split('/');
    const tweet = await getTweetDetails(url_paths[1], url_paths[3]);

    if (!tweet.entities.media)
        throw new Error('This tweet does not have any photos.');

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
            name: tweet.user.name,
            uid: tweet.user.id,
            username: tweet.user.screen_name
        }
    };
}
