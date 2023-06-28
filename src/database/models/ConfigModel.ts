import Mongoose from '~/database';

const ConfigModel = Mongoose.model(
    'Config',
    new Mongoose.Schema({
        name: String,
        value: String
    })
);

export default ConfigModel;
