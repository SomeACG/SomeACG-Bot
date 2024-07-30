import {
    BiliResponse,
    BiliDaynamicData,
    BiliFingerData
} from '~/types/Bilibili';
import axios, { commonHeaders } from '~/utils/axios';
import { random_audio, random_png_end, random_canvas } from './tools';
import { gen_buvid_fp } from './fp';

import * as crypto from 'crypto';

const API_PATH = 'https://api.bilibili.com/x/polymer/web-dynamic/v1/detail';

const uuid = crypto.randomUUID();

const headers = {
    referer: 'https://t.bilibili.com/',
    Cookie: `_uuid=${uuid}`
};

let buvid_fp: string;

async function submitGateway(uuid: string, post_url: string): Promise<void> {
    const ua = commonHeaders['user-agent'];
    const data: any = {
        '3064': 1,
        '5062': `${Date.now()}`,
        '03bf': `${encodeURIComponent(post_url)}`,
        '39c8': '333.999.fp.risk',
        '34f1': '',
        d402: '',
        '654a': '',
        '6e7c': `1920x1080`,
        '3c43': {
            '2673': 1,
            '5766': 24,
            '6527': 0,
            '7003': 1,
            '807e': 1,
            b8ce: ua,
            '641c': 0,
            '07a4': 'zh-CN',
            '1c57': 8,
            '0bd0': 8,
            '748e': [1920, 1080],
            d61f: [1920, 980],
            fc9d: -480,
            '6aa9': 'Asia/Shanghai',
            '75b8': 1,
            '3b21': 1,
            '8a1c': 0,
            d52f: 'not available',
            adca: ua.includes('Windows')
                ? 'Win32'
                : ua.includes('Macintosh')
                ? 'MacIntel'
                : 'Linux',
            '80c9': [
                [
                    'PDF Viewer',
                    'Portable Document Format',
                    [
                        ['application/pdf', 'pdf'],
                        ['text/pdf', 'pdf']
                    ]
                ],
                [
                    'Chrome PDF Viewer',
                    'Portable Document Format',
                    [
                        ['application/pdf', 'pdf'],
                        ['text/pdf', 'pdf']
                    ]
                ],
                [
                    'Chromium PDF Viewer',
                    'Portable Document Format',
                    [
                        ['application/pdf', 'pdf'],
                        ['text/pdf', 'pdf']
                    ]
                ],
                [
                    'Microsoft Edge PDF Viewer',
                    'Portable Document Format',
                    [
                        ['application/pdf', 'pdf'],
                        ['text/pdf', 'pdf']
                    ]
                ],
                [
                    'WebKit built-in PDF',
                    'Portable Document Format',
                    [
                        ['application/pdf', 'pdf'],
                        ['text/pdf', 'pdf']
                    ]
                ]
            ],
            '13ab': random_canvas(),
            bfe9: random_png_end(),
            a3c1: [
                'extensions:ANGLE_instanced_arrays;EXT_blend_minmax;EXT_color_buffer_half_float;EXT_depth_clamp;EXT_disjoint_timer_query;EXT_float_blend;EXT_frag_depth;EXT_shader_texture_lod;EXT_texture_compression_rgtc;EXT_texture_filter_anisotropic;EXT_sRGB;OES_element_index_uint;OES_fbo_render_mipmap;OES_standard_derivatives;OES_texture_float;OES_texture_float_linear;OES_texture_half_float;OES_texture_half_float_linear;OES_vertex_array_object;WEBGL_blend_func_extended;WEBGL_color_buffer_float;WEBGL_compressed_texture_s3tc;WEBGL_compressed_texture_s3tc_srgb;WEBGL_debug_renderer_info;WEBGL_debug_shaders;WEBGL_depth_texture;WEBGL_draw_buffers;WEBGL_lose_context;WEBGL_multi_draw;WEBGL_polygon_mode',
                'webgl aliased line width range:[1, 1]',
                'webgl aliased point size range:[1, 255.875]',
                'webgl alpha bits:8',
                'webgl antialiasing:yes',
                'webgl blue bits:8',
                'webgl depth bits:24',
                'webgl green bits:8',
                'webgl max anisotropy:16',
                'webgl max combined texture image units:32',
                'webgl max cube map texture size:16384',
                'webgl max fragment uniform vectors:1024',
                'webgl max render buffer size:16384',
                'webgl max texture image units:16',
                'webgl max texture size:16384',
                'webgl max varying vectors:15',
                'webgl max vertex attribs:16',
                'webgl max vertex texture image units:16',
                'webgl max vertex uniform vectors:1024',
                'webgl max viewport dims:[16384, 16384]',
                'webgl red bits:8',
                'webgl renderer:WebKit WebGL',
                'webgl shading language version:WebGL GLSL ES 1.0 (OpenGL ES GLSL ES 1.0 Chromium)',
                'webgl stencil bits:0',
                'webgl vendor:WebKit',
                'webgl version:WebGL 1.0 (OpenGL ES 2.0 Chromium)',
                'webgl unmasked vendor:Google Inc. (Intel Inc.)',
                'webgl unmasked renderer:ANGLE (Intel Inc., Intel(R) UHD Graphics 630, OpenGL 4.1)',
                'webgl vertex shader high float precision:23',
                'webgl vertex shader high float precision rangeMin:127',
                'webgl vertex shader high float precision rangeMax:127',
                'webgl vertex shader medium float precision:23',
                'webgl vertex shader medium float precision rangeMin:127',
                'webgl vertex shader medium float precision rangeMax:127',
                'webgl vertex shader low float precision:23',
                'webgl vertex shader low float precision rangeMin:127',
                'webgl vertex shader low float precision rangeMax:127',
                'webgl fragment shader high float precision:23',
                'webgl fragment shader high float precision rangeMin:127',
                'webgl fragment shader high float precision rangeMax:127',
                'webgl fragment shader medium float precision:23',
                'webgl fragment shader medium float precision rangeMin:127',
                'webgl fragment shader medium float precision rangeMax:127',
                'webgl fragment shader low float precision:23',
                'webgl fragment shader low float precision rangeMin:127',
                'webgl fragment shader low float precision rangeMax:127',
                'webgl vertex shader high int precision:0',
                'webgl vertex shader high int precision rangeMin:31',
                'webgl vertex shader high int precision rangeMax:30',
                'webgl vertex shader medium int precision:0',
                'webgl vertex shader medium int precision rangeMin:31',
                'webgl vertex shader medium int precision rangeMax:30',
                'webgl vertex shader low int precision:0',
                'webgl vertex shader low int precision rangeMin:31',
                'webgl vertex shader low int precision rangeMax:30',
                'webgl fragment shader high int precision:0',
                'webgl fragment shader high int precision rangeMin:31',
                'webgl fragment shader high int precision rangeMax:30',
                'webgl fragment shader medium int precision:0',
                'webgl fragment shader medium int precision rangeMin:31',
                'webgl fragment shader medium int precision rangeMax:30',
                'webgl fragment shader low int precision:0',
                'webgl fragment shader low int precision rangeMin:31',
                'webgl fragment shader low int precision rangeMax:30'
            ],
            '6bc5': 'Google Inc. (Intel Inc.)~ANGLE (Intel Inc., Intel(R) UHD Graphics 630, OpenGL 4.1)',
            ed31: 0,
            '72bd': 0,
            '097b': 0,
            '52cd': [0, 0, 0],
            a658: [
                'Andale Mono',
                'Arial',
                'Arial Black',
                'Arial Hebrew',
                'Arial Narrow',
                'Arial Rounded MT Bold',
                'Arial Unicode MS',
                'Comic Sans MS',
                'Courier',
                'Courier New',
                'Geneva',
                'Georgia',
                'Helvetica',
                'Helvetica Neue',
                'Impact',
                'LUCIDA GRANDE',
                'Microsoft Sans Serif',
                'Monaco',
                'Palatino',
                'Tahoma',
                'Times',
                'Times New Roman',
                'Trebuchet MS',
                'Verdana',
                'Wingdings',
                'Wingdings 2',
                'Wingdings 3'
            ],
            d02f: random_audio()
        },
        '54ef': '',
        '8b94': '',
        df35: uuid,
        '07a4': 'zh-CN',
        '5f45': null,
        db46: 0
    };
    const payload = JSON.stringify(data);
    // 如果已经生成的有就一直用，初次会 -352 ，后续就可正常使用，且该 cookie 值服务端会自动续期
    buvid_fp = buvid_fp || gen_buvid_fp(payload, 31);
    headers.Cookie += `;buvid_fp=${buvid_fp}`;
    await axios.post(
        'https://api.bilibili.com/x/internal/gaia-gateway/ExClimbWuzhi',
        {
            payload
        },
        {
            headers
        }
    );
}

export async function getDynamicInfo(dynamic_id: string) {
    const { data: fingerprint } = await axios.get<BiliResponse<BiliFingerData>>(
        'https://api.bilibili.com/x/frontend/finger/spi'
    );

    headers.Cookie += `;buvid3=${fingerprint.data['b_3']};buvid4=${fingerprint.data['b_4']}`;

    await submitGateway(uuid, `https://t.bilibili.com/${dynamic_id}`);

    const baseParams = new URLSearchParams([
        ['timezone_offset', '-480'],
        ['platform', 'web'],
        ['features', 'itemOpusStyle'],
        ['dm_img_list', '[]'],
        ['dm_img_str', 'V2ViR0wgMS4wIChPcGVuR0wgRVMgMi4wIENocm9taXVtKQ'],
        [
            'dm_cover_img_str',
            'QU5HTEUgKEludGVsLCBJbnRlbChSKSBVSEQgR3JhcGhpY3MgNjMwICgweDAwMDAzRTlCKSBEaXJlY3QzRDExIHZzXzVfMCBwc181XzAsIEQzRDExKUdvb2dsZSBJbmMuIChJbnRlbC'
        ],
        [
            'dm_img_inter',
            '{"ds":[{"t":2,"c":"Y2xlYXJmaXggZy1zZWFyY2ggc2VhcmNoLWNvbnRhaW5lcg","p":[1738,94,696],"s":[100,562,616]},{"t":2,"c":"d3JhcHBlcg","p":[675,7,1300],"s":[441,4420,3934]}],"wh":[3867,3944,107],"of":[21,42,21]}'
        ]
    ]);

    baseParams.append('id', dynamic_id);

    const { data } = await axios.get<BiliResponse<BiliDaynamicData>>(API_PATH, {
        params: baseParams,
        headers
    });

    if (data.code !== 0) {
        throw new Error(data.message);
    }

    return data.data.item.modules;
}
