import Mongoose from '~/database';

import { File } from '~/types/File';

const fileSchema = new Mongoose.Schema<File>({
    name: String,
    file_id: String,
    description: String,
    create_time: {
        type: Date,
        default: new Date()
    }
});

const FileModel = Mongoose.model('File', fileSchema);

export default FileModel;
