import { Telegraf } from "telegraf";
import { Message } from "telegraf/typings/core/types/typegram";
import { getArtwork } from "~/database/operations/artwork";
import { modifyArtwork } from "~/services/artwork-service";
import { parseParams } from "~/utils/param-parser";

export default Telegraf.command('update', async ctx => {
    let command = parseParams(ctx.message.text)
    let waiting_message: Message
    setTimeout(async () => {
        if (waiting_message) { 
            await ctx.deleteMessage(waiting_message.message_id) 
        }
    }, 10000)
    if (!command.params['index']) return await ctx.reply('请回复一条消息或指定要更改的作品序号!', {
        reply_to_message_id: ctx.message.message_id
    })
    waiting_message = await ctx.reply('正在更新作品信息...', {
        reply_to_message_id: ctx.message.message_id
    })
    try {

        let artwork_index = parseInt(command.params['index'])
        let artwork = await getArtwork(artwork_index)
        let param_keys = Object.keys(command.params)
        for (let key of param_keys) {
            if (key in artwork && typeof artwork[key] == 'string') artwork[key] = command.params[key]
        }
        let result = await modifyArtwork(artwork)
        if (result.succeed) return await ctx.telegram.editMessageText(waiting_message.chat.id, waiting_message.message_id, undefined, '作品信息更新成功~')
        return await ctx.telegram.editMessageText(waiting_message.chat.id, waiting_message.message_id, undefined, '作品信息更新失败: ' + result.message)
    }
    catch (err) {
        console.log(err)
        if (err instanceof Error) {
            return await ctx.telegram.editMessageText(waiting_message.chat.id, waiting_message.message_id, undefined, '操作失败: ' + err.message)
        }
        return await ctx.telegram.editMessageText(waiting_message.chat.id, waiting_message.message_id, undefined, '操作失败: 未知错误')
    }
})