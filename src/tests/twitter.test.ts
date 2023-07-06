import { describe, expect, test } from '@jest/globals';
import {
    getTweetDetails,
    getUserByUsername
} from '../platforms/twitter-web-api/tweet';

describe('Twitter Web API Test', () => {
    test('Get Tweet Details', async () => {
        const tweet = await getTweetDetails('Revincx', '1614089157323952132');
        console.log(JSON.stringify(tweet, null, 4));
        expect(tweet.user_id_str).toBe('829606036948475904');
    });

    test('Get User By Username', async () => {
        const user = await getUserByUsername('Revincx');
        console.log(JSON.stringify(user, null, 4));
        expect(user.name).toBe('Revincx');
    });
});
