import api from './twitter-api.js';

export async function getTweetDetails(user_id: string, status_id: string) {
    const tweets = await api.tweetDetail(user_id, {
        focalTweetId: status_id
    });
    return tweets[0].content.itemContent.tweet_results.result.legacy;
}

export async function getUserByUsername(username: string) {
    const user = await api.userByScreenName(username);
    return user.data.user.result.legacy;
}
