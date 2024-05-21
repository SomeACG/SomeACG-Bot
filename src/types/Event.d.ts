import { Contribution } from './Contribution';

export type PushEvent = {
    thumb_files: string[];
    origin_files: string[];
    contribution?: Contribution;
    origin_file_modified: boolean;
    origin_file_id?: string;
};

export type PublishEvent = {
    is_quality: boolean;
    picture_index: number[];
    artwork_tags: Array<string>;
    origin_file_name?: string;
    origin_file_modified: boolean;
    contribution?: Contribution;
};

export type ExecResult = {
    succeed: boolean;
    message: string;
};
