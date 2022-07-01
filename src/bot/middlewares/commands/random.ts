import { Markup } from "telegraf"
import { wrapCommand } from "~/bot/wrappers/command-wrapper"
import MessageModel from "~/database/models/MessageModel"
import { getArtwork } from "~/database/operations/artwork"
import { ChannelMessage } from "~/types/Message"

export default wrapCommand ('random', async ctx => {
    let messages = await MessageModel.aggregate<ChannelMessage>([
        {
            $match: { type: 'photo' }
        },
        {
            $sample: { size: 1 }
        }
    ])
    if (messages.length == 0) return await ctx.directlyReply('诶呀，获取图片失败了~')
    let artwork = await getArtwork(messages[0].artwork_index)
    return await ctx.replyWithPhoto(messages[0].file_id, {
        reply_to_message_id: ctx.chat.type == 'private' ? undefined : ctx.message.message_id,
        caption: '这是你要的壁纸~',
        ...Markup.inlineKeyboard([
            Markup.button.url('作品来源', artwork.source.post_url),
            Markup.button.url('获取原图', 'https://t.me/SomeACGbot?start=document-' + messages[0].artwork_index)
        ])
    })
})

// export default Telegraf.command('random', async ctx => {
//     // let waiting_message = await ctx.reply('正在随机获取一张壁纸...', {
//     //     reply_to_message_id: ctx.message.message_id
//     // })
//     try {
//         let messages = await MessageModel.aggregate([
//             {
//                 $match: { type: 'photo' }
//             },
//             {
//                 $sample: { size: 1 }
//             }
//         ])
//         if (messages.length == 0) {
//             return await ctx.reply("诶呀，获取图片失败了~", {
//                 reply_to_message_id: ctx.message.message_id
//             })
//         }
//         let message = messages[0] as ChannelMessage
//         let artwork = await getArtwork(message.artwork_index)
//         return await ctx.replyWithPhoto(message.file_id, {
//             reply_to_message_id: ctx.message.message_id,
//             caption: '这是你要的壁纸~',
//             ...Markup.inlineKeyboard([
//                 Markup.button.url('作品来源', artwork.source.post_url)
//             ])
//         })
//     }
//     catch (err) {
//         console.log(err)
//         if (err instanceof Error) {
//             return await ctx.reply('操作失败: ' + err.message, {
//                 reply_to_message_id: ctx.message.message_id
//             })
//         }
//         return await ctx.reply('操作失败: 未知错误', {
//             reply_to_message_id: ctx.message.message_id
//         })
//     }

//     // return await ctx.deleteMessage(waiting_message.message_id)
// })