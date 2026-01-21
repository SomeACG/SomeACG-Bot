export type BiliResponse<T> = {
    code: number;
    message: string;
    ttl?: number;
    data: T;
};

export type BiliFingerData = {
    b_3: string;
    b_4: string;
};

export type BiliDynamicModule = {
    module_author: {
        name: string;
        jump_url: string;
        mid: number;
    };
    module_dynamic: {
        major?: {
            type: string; // Should be 'MAJOR_TYPE_OPUS',
            opus?: {
                pics: BiliDynamicPic[];
                summary?: {
                    text: string;
                };
                title: string | null;
            };
        };
    };
};

export type BiliDynamicData = {
    item: AltBiliDynamicData;
};

export type BiliDynamicPic = {
    height: number;
    width: number;
    sizes: number; // float
    url: string;
};

export type AltBiliDynamicData = {
    basic: {
        comment_id_str: string;
        comment_type: number;
        jump_url: string;
        rid_str: string;
    };
    orig?: {
        id_str: string;
        modules: BiliDynamicModule;
    };
    id_str: string;
    modules: BiliDynamicModule;
    type: string;
    visible: boolean;
};
