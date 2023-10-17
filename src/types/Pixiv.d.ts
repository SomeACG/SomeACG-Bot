export type PixivAjaxResp<T> = {
    error: boolean;
    message: string;
    body: T;
};

export type PixivIllust = {
    illustId: string;
    illustTitle: string;
    illustComment: string;
    id: string;
    title: string;
    description: string;
    illustType: number;
    sl: number;
    urls: {
        mini: string;
        thumb: string;
        small: string;
        regular: string;
        original: string;
    };
    tags: {
        authorId: string;
        tags: [
            {
                tag: string;
                locked: boolean;
                translation?: {
                    en: string;
                };
            }
        ];
    };
    alt: string;
    userId: string;
    userName: string;
    userAccount: string;
    pageCount: number;
    width: number;
    height: number;
    extraData: {
        meta: {
            description?: string;
        };
    };
};

export type PixivIllustPages = [
    {
        urls: {
            mini: string;
            thumb: string;
            small: string;
            regular: string;
            original: string;
        };
        width: number;
        height: number;
    }
];
