import Mongoose from "~/database";

const ConfigModel = Mongoose.model('Config', new Mongoose.Schema({
    artwork_count: Number
}))

export default ConfigModel