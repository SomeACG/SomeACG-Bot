import { FxTwitterResp } from '~/types/FxTwitter';
import axios from '~/utils/axios';

const FXTWITTER_API = 'https://api.fxtwitter.com/placeholder/status/';

export async function getTweetDetails(tweet_id: string) {
    const { data } = await axios.get<FxTwitterResp>(FXTWITTER_API + tweet_id);
    if (data.code !== 200) throw new Error(data.message);
    return data.tweet;
}
