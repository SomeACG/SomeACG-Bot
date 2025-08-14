import Mongoose from '~/database';

export type Photo = {
    artwork_id: Mongoose.Types.ObjectId;
    artwork_index: number;
    size: {
        width: number;
        height: number;
    };
    file_size: number;
    file_name: string;
    thumb_name?: string;
    thumb_file_id: string;
    document_file_id: string;
    thumb_message_id: number;
    document_message_id: number;
    create_time: Date;
};
