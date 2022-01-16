import MessageModel from "~/database/models/MessageModel"
import { ChannelMessage, ChannelMessageType } from "~/types/Message";

export async function insertMessages(messages: ChannelMessage[]) {
    if (!messages.length) throw new Error('Empty message array !')

    let result = await MessageModel.insertMany(messages)
}

export async function getMessage(message_id: number): Promise<ChannelMessage> {
    let message = await MessageModel.findOne({
        message_id: message_id
    })

    if (!message) {
        throw new Error('未在数据库中找到关于此消息的数据')
    }

    return message
}

export async function getMessagesByArtwork(artwork_index: number): Promise<Array<ChannelMessage>> {

    let messages = await MessageModel.find({
        artwork_index: artwork_index
    })

    return messages
}

export async function getMessageByArtwork(artwork_index: number, message_type: ChannelMessageType): Promise<ChannelMessage> {

    let message = await MessageModel.findOne({
        artwork_index: artwork_index,
        type: message_type
    })

    if (!message) {
        throw new Error('Channel message not found')
    }

    return message
}

export async function deleteMessagesByArtwork(artwork_index: number) {
    let result = await MessageModel.deleteMany({
        artwork_index: artwork_index
    })
    return result.deletedCount
}