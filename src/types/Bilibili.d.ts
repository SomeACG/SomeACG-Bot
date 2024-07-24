export type BiliResponse = {
    code: number;
    message: string;
    ttl: number;
    data: BiliDaynamicData;
};

export type BiliDaynamicData = {
    item: {
        modules: {
            module_author: {
                name: string;
                jump_url: string;
                mid: number;
            };
            module_dynamic: {
                major: {
                    type: string; // Should be 'MAJOR_TYPE_OPUS',
                    opus?: {
                        pics: BiliDyanamicPic[];
                        summary?: {
                            text: string;
                        };
                        title: string | null;
                    };
                };
            };
        };
    };
};

export type BiliDyanamicPic = {
    height: number;
    width: number;
    sizes: number; // float
    url: string;
};
