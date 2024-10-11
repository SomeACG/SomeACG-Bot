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
    item: {
        modules: BiliDynamicModule;
        id_str: string;
        orig?: {
            id_str: string;
            modules: BiliDynamicModule;
        };
        type: string;
    };
};

export type BiliDynamicPic = {
    height: number;
    width: number;
    sizes: number; // float
    url: string;
};
