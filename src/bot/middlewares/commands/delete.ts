import { Telegraf } from "telegraf";
import { parseParams } from "~/utils/param-parser"
import { delArtwork } from '~/services/artwork-service'
import { getMessage } from "~/database/operations/message";
import { Message } from "telegraf/typings/core/types/typegram";

export default Telegraf.command('delete', async ctx => {
    let command = parseParams(ctx.message.text)
    let waiting_message: Message
    setTimeout(async () => {
        if(waiting_message) await ctx.deleteMessage(waiting_message.message_id)
    },10000)
    if (!command.params['index'] && !ctx.message.reply_to_message) {
        return await ctx.reply('命令语法不正确，请回复一条消息或指定要删除的作品序号!', {
            reply_to_message_id: ctx.message.message_id
        })
    }
    let artwork_index = -1

    waiting_message = await ctx.reply('正在删除作品...', {
        reply_to_message_id: ctx.message.message_id
    })
    try {
        if (ctx.message.reply_to_message) {
            let reply_to_message = ctx.message.reply_to_message as Message.CommonMessage
            if (!reply_to_message.forward_from_message_id) return await ctx.reply('回复的消息不是有效的频道消息！', {
                reply_to_message_id: ctx.message.message_id
            })
            let message = await getMessage(reply_to_message.forward_from_message_id)
            artwork_index = message.artwork_index
        }
        if (command.params['index']) artwork_index = parseInt(command.params['index'])
        let result = await delArtwork(artwork_index)
        if (result.succeed) {
            return
        }
        return await ctx.telegram.sendMessage(waiting_message.chat.id, '作品删除失败: ' + result.message)
    }
    catch (err) {
        console.log(err)
        if (err instanceof Error) {
            return await ctx.telegram.editMessageText(waiting_message.chat.id, waiting_message.message_id, undefined, '操作失败: ' + err.message)
        }
        return await ctx.telegram.editMessageText(waiting_message.chat.id, waiting_message.message_id, undefined, '操作失败: 未知错误')
    }

})