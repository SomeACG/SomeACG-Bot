import Mongoose from '~/database';
import { Artist } from '~/types/Artwork';

const artistSchema = new Mongoose.Schema<Artist>({
    type: String,
    uid: Number,
    name: String,
    username: String,
    create_time: {
        type: Date,
        default: new Date()
    }
});

const artistModel = Mongoose.model('Artist', artistSchema);

export default artistModel;
