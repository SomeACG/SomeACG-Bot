import Mongoose from '~/database';

type ArtworkSourceType = 'pixiv' | 'twitter' | 'danbooru';

export type ArtworkSource = {
    type: ArtworkSourceType;
    post_url: string;
    picture_index: number;
};

export type ArtworkTag = {
    _id: string;
    name: string;
};

export type ImageSize = {
    width: number;
    height: number;
};

export type Artwork = {
    index: number;
    quality: boolean;
    title?: string;
    desc?: string;
    file_name: string;
    img_thumb: string;
    size: ImageSize;
    tags: Array<ArtworkTag>;
    source: ArtworkSource;
    create_time?: Date;
    artist_id?: Mongoose.Types.ObjectId;
};

export type ArtworkInfo = {
    source_type: ArtworkSourceType;
    post_url: string;
    title?: string;
    desc?: string;
    url_thumb: string;
    url_origin: string;
    size: ImageSize;
    raw_tags?: string[];
    artist: Artist;
};

export type ArtworkWithFileId = Pick<Artwork, 'index' | 'source'> & {
    photo_file_id: string;
    document_file_id: string;
    photo_message_id: number;
};

export type Artist = {
    id?: Mongoose.Types.ObjectId;
    type: ArtworkSourceType;
    uid?: number;
    name: string;
    username?: string;
    create_time?: Date;
};
