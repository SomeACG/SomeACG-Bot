import Mongoose from '~/database';
import { Photo } from '~/types/Photo';

const photoSchema = new Mongoose.Schema<Photo>({
    artwork_id: Mongoose.Types.ObjectId,
    artwork_index: Number,
    size: {
        width: Number,
        height: Number
    },
    file_size: Number,
    file_name: String,
    thumb_file_id: String,
    document_file_id: String,
    thumb_message_id: Number,
    document_message_id: Number,
    create_time: {
        type: Date,
        default: new Date()
    }
});

const PhotoModel = Mongoose.model('Photo', photoSchema);

export default PhotoModel;
