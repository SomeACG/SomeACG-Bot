import { wrapCommand } from "~/bot/wrappers/command-wrapper";
import { getArtwork } from "~/database/operations/artwork";
import { getMessage } from "~/database/operations/message";
import { modifyArtwork } from "~/services/artwork-service";

export default wrapCommand('update', async ctx => {
    if (!ctx.command.params['index'] && !ctx.is_reply)
        return await ctx.directlyReply('请回复一条消息或指定要更改的作品序号!')
    if (!ctx.command.params['index'] && !ctx.reply_to_message?.forward_from_message_id)
        return await ctx.directlyReply('回复的消息不是有效的频道消息！')
    await ctx.wait('正在更新作品信息...', true)
    let artwork_index = -1
    if (ctx.command.params['index']) artwork_index = parseInt(ctx.command.params['index'])
    if (ctx.reply_to_message) {
        let message = await getMessage(ctx.reply_to_message.forward_from_message_id!)
        artwork_index = message.artwork_index
    }
    let artwork = await getArtwork(artwork_index)
    let param_keys = Object.keys(ctx.command.params)
    for (let key of param_keys) {
        if (key in artwork) {
            switch (typeof artwork[key]) {
                case 'string':
                    artwork[key] = ctx.command.params[key]
                    break
                case 'boolean':
                    artwork[key] = Boolean(ctx.command.params[key])
                    break
            }
        }
    }
    let result = await modifyArtwork(artwork)
    if(result.succeed) return await ctx.resolveWait('作品信息更新成功~')
    return await ctx.resolveWait('作品信息更新失败: ' + result.message)
})

// export default Telegraf.command('update', async ctx => {
//     let command = parseParams(ctx.message.text)
//     let waiting_message: Message
//     setTimeout(async () => {
//         if (waiting_message) {
//             await ctx.deleteMessage(waiting_message.message_id)
//         }
//     }, 10000)
//     if (!command.params['index'] && !ctx.message.reply_to_message) return await ctx.reply('请回复一条消息或指定要更改的作品序号!', {
//         reply_to_message_id: ctx.message.message_id
//     })
//     waiting_message = await ctx.reply('正在更新作品信息...', {
//         reply_to_message_id: ctx.message.message_id
//     })
//     try {

//         let artwork_index = -1
//         if (command.params['index']) artwork_index = parseInt(command.params['index'])
//         if (ctx.message.reply_to_message) {
//             let reply_to_message = ctx.message.reply_to_message as Message.CommonMessage
//             if (!reply_to_message.forward_from_message_id) return await ctx.reply('回复的消息不是有效的频道消息！', {
//                 reply_to_message_id: ctx.message.message_id
//             })

//             let message = await getMessage(reply_to_message.forward_from_message_id)
//             artwork_index = message.artwork_index
//         }
//         let artwork = await getArtwork(artwork_index)
//         let param_keys = Object.keys(command.params)
//         for (let key of param_keys) {
//             console.log(`${key} in artwork: ${key in artwork}`);
//             console.log(`Artwork[key]: ${artwork[key]}`);

//             if (key in artwork && typeof artwork[key] == 'string') artwork[key] = command.params[key]
//             if (key in artwork && typeof artwork[key] == 'boolean') artwork[key] = Boolean(command.params[key])
//         }
//         let result = await modifyArtwork(artwork)
//         if (result.succeed) return await ctx.telegram.editMessageText(waiting_message.chat.id, waiting_message.message_id, undefined, '作品信息更新成功~')
//         return await ctx.telegram.editMessageText(waiting_message.chat.id, waiting_message.message_id, undefined, '作品信息更新失败: ' + result.message)
//     }
//     catch (err) {
//         console.log(err)
//         if (err instanceof Error) {
//             return await ctx.telegram.editMessageText(waiting_message.chat.id, waiting_message.message_id, undefined, '操作失败: ' + err.message)
//         }
//         return await ctx.telegram.editMessageText(waiting_message.chat.id, waiting_message.message_id, undefined, '操作失败: 未知错误')
//     }
// })