import { Artist } from './Artwork';
import { Contribution } from './Contribution';

export type PushEvent = {
    file_thumb_name: string;
    contribution?: Contribution;
    origin_file_modified: boolean;
    origin_file_id?: string;
    artist?: Artist;
};

export type PublishEvent = {
    is_quality: boolean;
    picture_index: number;
    artwork_tags: Array<string>;
    origin_file_id?: string;
    contribution?: Contribution;
};

export type ExecResult = {
    succeed: boolean;
    message: string;
};
