import { ArtworkInfo } from '~/types/Artwork';
import { getTweetDetails } from './twitter-web-api/fxtwitter';

export default async function getArtworkInfo(
    post_url: string,
    picture_index = 0
): Promise<ArtworkInfo> {
    const tweet_url = new URL(post_url);
    const url_paths = tweet_url.pathname.split('/');
    const tweet = await getTweetDetails(url_paths[3]);

    if (!tweet.media) throw new Error('此推文中没有任何图片');

    // Remove t.co Links
    const desc = tweet.text.replace(/https:\/\/t.co\/(\w+)/, '');
    const photo = tweet.media.photos[picture_index];

    return {
        source_type: 'twitter',
        post_url: post_url,
        desc,
        url_thumb: photo.url + '?name=medium',
        url_origin: photo.url + '?name=orig',
        size: {
            width: photo.width,
            height: photo.height
        },
        artist: {
            type: 'twitter',
            name: tweet.author.name,
            uid: parseInt(tweet.author.id),
            username: tweet.author.screen_name
        }
    };
}
