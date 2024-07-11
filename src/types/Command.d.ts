// export type CommandParam = {
//     key: string,
//     value: string
// }

export type ParamNames =
    | 'user'
    | 'index'
    | 'picture_index'
    | 'tags'
    | 'contribute_from'
    | 'desc'
    | 'quality'
    | string;

export type CommandParams = {
    [P in ParamNames]?: string;
};

export type CommandEntity = {
    name: string;
    target?: string;
    params?: CommandParams;
};
