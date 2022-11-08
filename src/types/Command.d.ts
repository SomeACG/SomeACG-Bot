// export type CommandParam = {
//     key: string,
//     value: string
// }

export type CommandEntity = {
    name: string;
    target?: string;
    params?: {
        [param_name]: string;
    };
};
