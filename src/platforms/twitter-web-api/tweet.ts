import api from './twitter-api.js';

export async function getTweetDetails(status_id: string) {
    const tweet = await api.TweetResultByRestId(status_id);

    return tweet.data.tweetResult.result.legacy;
}

export async function getUserByUsername(username: string) {
    const user = await api.userByScreenName(username);
    return user.data.user.result.legacy;
}
