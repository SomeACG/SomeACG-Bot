import path from 'path';
import config from '~/config';
import { ArtworkInfo } from '~/types/Artwork';
import { TwitterApi } from 'twitter-api-v2';

const twitterClient = new TwitterApi({
    appKey: config.TWITTER_API_KEY,
    appSecret: config.TWITTER_API_SECRET
}).v1;

export default async function getArtworkInfo(
    post_url: string,
    picture_index = 0
): Promise<ArtworkInfo> {
    const tweet = await twitterClient.singleTweet(path.basename(post_url));

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
        url_thumb: media.media_url_https + '?name=small',
        url_origin: media.media_url_https + '?name=4096x4096',
        size: {
            width: media.sizes.large.w,
            height: media.sizes.large.h
        }
    };
}
