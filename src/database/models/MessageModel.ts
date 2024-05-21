// @deprecated
import Mongoose from '~/database';
import { ChannelMessage } from '~/types/Message';

const messageSchema = new Mongoose.Schema<ChannelMessage>({
    type: String,
    message_id: Number,
    artwork_index: Number,
    file_id: String,
    send_time: {
        type: Date,
        default: new Date()
    }
});

const MessageModel = Mongoose.model('Message', messageSchema);

export default MessageModel;
