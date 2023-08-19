import { describe, expect, test } from '@jest/globals';
import {
    getTweetDetails,
    getUserByUsername
} from '../platforms/twitter-web-api/tweet';

describe('Twitter Web API Test', () => {
    test('Get Tweet Details', async () => {
        const tweet = await getTweetDetails('1614089157323952132');
        expect(tweet.user_id_str).toBe('829606036948475904');
    });

    test('Get User By Username', async () => {
        const user = await getUserByUsername('Revincx');
        expect(user.name).toBe('Revincx');
    });

    test('Get Tweet Media', async () => {
        const tweet = await getTweetDetails('1653719799011360769');
        console.log(JSON.stringify(tweet, null, 4));
        expect(tweet.extended_entities?.media[0].type).toBe('photo');
    });
});
