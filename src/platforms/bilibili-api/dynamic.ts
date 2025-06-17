import {
    BiliResponse,
    BiliDynamicData,
    BiliFingerData
} from '~/types/Bilibili';
import axios, { commonHeaders } from '~/utils/axios';
import { gen_buvid_fp } from './fp';

import * as crypto from 'crypto';
import { fakeDmCoverImgStr, genExClimbWuzhi } from './utils';

import { WbiSign } from './sign';
import logger from '~/utils/logger';

const API_PATH = 'https://api.bilibili.com/x/polymer/web-dynamic/v1/detail';

export default class DynamicFetcher {
    private dynamic_id: string;

    private cookies: string;

    private spm_prefix = '333.1387';

    private uuid: string;

    private retry_count = 0;

    constructor(dynamic_id: string) {
        this.dynamic_id = dynamic_id;
        this.uuid = crypto.randomUUID();
        this.cookies = `_uuid=${this.uuid}`;
    }

    headers() {
        return {
            referer: 'https://t.bilibili.com/',
            Cookie: this.cookies
        };
    }

    async initSpmPrefix() {
        const { data } = await axios.get(
            'https://space.bilibili.com/1/dynamic'
        );

        const spm_prefix_match_1 = data.match(
            /<meta name="spm_prefix" content="([\d.]+)">/
        );

        if (spm_prefix_match_1) {
            return (this.spm_prefix = spm_prefix_match_1[1]);
        }

        const spm_prefix_match_2 = data.match(/spmId: "([\d.]+)"/);

        if (spm_prefix_match_2) {
            return (this.spm_prefix = spm_prefix_match_2[1]);
        }
        // 如果没有匹配到，则使用默认值

        logger.warn('未能从页面中获取 spm_prefix，使用默认值 333.1387');
        // 这里使用默认值
        return (this.spm_prefix = '333.1387');
    }

    async submitGateway(): Promise<void> {
        const data = genExClimbWuzhi(
            this.uuid,
            `https://t.bilibili.com/${this.dynamic_id}`,
            this.spm_prefix
        );

        const payload = JSON.stringify(data);

        // 如果已经生成的有就一直用，初次会 -352 ，后续就可正常使用，且该 cookie 值服务端会自动续期
        const buvid_fp = gen_buvid_fp(payload, 31);

        this.cookies += `;buvid_fp=${buvid_fp}`;

        await axios.post(
            'https://api.bilibili.com/x/internal/gaia-gateway/ExClimbWuzhi',
            {
                payload
            },
            {
                headers: this.headers()
            }
        );
    }

    async detail(): Promise<BiliDynamicData> {
        await this.initSpmPrefix();

        if (this.cookies.indexOf('buvid_fp') === -1) {
            const { data: fingerprint } = await axios.get<
                BiliResponse<BiliFingerData>
            >('https://api.bilibili.com/x/frontend/finger/spi');

            this.cookies += `;buvid3=${fingerprint.data['b_3']};buvid4=${fingerprint.data['b_4']}`;
        }

        await this.submitGateway();

        const baseParams = {
            id: this.dynamic_id,
            timezone_offset: '-60',
            platform: 'web',
            gaia_source: 'main_web',
            'x-bili-device-req-json': '{"platform":"web","device":"pc"}',
            'x-bili-web-req-json': `{"spm_id":"${this.spm_prefix}"}`,
            features: 'itemOpusStyle',
            dm_img_list: '[]',
            dm_img_str: '',
            dm_cover_img_str: fakeDmCoverImgStr(
                'ANGLE (Google, Vulkan 1.3.0 (SwiftShader Device (Subzero) (0x0000C0XX)), SwiftShader driver)Google Inc. (Google)'
            ),
            dm_img_inter: '{"ds":[],"wh":[0,0,0],"of":[0,0,0]}'
        };

        const signedParams = await WbiSign(baseParams);

        const { data } = await axios.get<BiliResponse<BiliDynamicData>>(
            `${API_PATH}?${signedParams}`,
            {
                headers: this.headers()
            }
        );

        if (data.message.includes('352') && this.retry_count < 3) {
            this.retry_count++;
            return await this.detail();
        }

        if (data.code !== 0) {
            throw new Error(data.message);
        }

        return data.data;
    }
}
