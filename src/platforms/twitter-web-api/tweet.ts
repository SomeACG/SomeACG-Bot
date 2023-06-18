import api from './twitter-api.js';

export async function getTweetDetails(user_id: string, status_id: string) {
    const tweets = await api.getUserTweetByStatus(user_id, {
        focalTweetId: status_id
    });
    return tweets[0];
}
