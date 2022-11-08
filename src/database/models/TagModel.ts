import Mongoose from '~/database';
import { ArtworkTag } from '~/types/Artwork';

const tagSchema = new Mongoose.Schema<ArtworkTag>({
    _id: Mongoose.Types.ObjectId,
    name: String
});

const TagModel = Mongoose.model('Tag', tagSchema);

export default TagModel;
