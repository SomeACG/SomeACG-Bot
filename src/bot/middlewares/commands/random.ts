import { Markup, Telegraf } from "telegraf"
import MessageModel from "~/database/models/MessageModel"
import { getArtwork } from "~/database/operations/artwork"
import { ChannelMessage } from "~/types/Message"

export default Telegraf.command('random', async ctx => {
    let waiting_message = await ctx.reply('正在随机获取一张壁纸...', {
        reply_to_message_id: ctx.message.message_id
    })
    let messages = await MessageModel.aggregate([
        {
            $match: { type: 'photo' }
        },
        {
            $sample: { size: 1 }
        }
    ])
    if (messages.length == 0) {
        return await ctx.telegram.editMessageText(waiting_message.chat.id, waiting_message.message_id, undefined, "诶呀，获取图片失败了~")
    }
    let message = messages[0] as ChannelMessage
    let artwork = await getArtwork(message.artwork_index)
    await ctx.replyWithPhoto(message.file_id, {
        reply_to_message_id: ctx.message.message_id,
        caption: '这是你要的壁纸~',
        ...Markup.inlineKeyboard([
            Markup.button.url('作品来源', artwork.source.post_url)
        ])
    })
    return await ctx.deleteMessage(waiting_message.message_id)
})