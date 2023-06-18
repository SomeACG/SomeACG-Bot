import { describe, expect, test } from '@jest/globals';
import { getTweetDetails } from '../platforms/twitter-web-api/tweet';

describe('Twitter Web API Test', () => {
    test('Get Tweet Details', async () => {
        const tweet = await getTweetDetails('Revincx', '1614089157323952132');
        expect(tweet.user_id_str).toBe('829606036948475904');
    });
});
