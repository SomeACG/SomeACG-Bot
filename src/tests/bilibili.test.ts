import { describe, expect, test } from '@jest/globals';
import DynamicFetcher from '../platforms/bilibili-api/dynamic';
import downloadFile from '../utils/download';

describe('Bilibili API Test', () => {
    test('Dynamic API Test', async () => {
        const fetcher = new DynamicFetcher('956651175804928018');
        const dynamic = await fetcher.detail();
        expect(dynamic.item.modules.module_author.mid).toBe('12727107');
    });

    test('Image Download Test', async () => {
        const file = await downloadFile(
            'https://i0.hdslb.com/bfs/new_dyn/bfd08349371cb139ad72ef50cb66a72924894709.jpg'
        );
        expect(file).toBeTruthy();
    });
});
