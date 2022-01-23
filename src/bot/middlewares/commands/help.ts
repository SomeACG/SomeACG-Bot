import { Telegraf } from "telegraf";
import { parseParams } from "~/utils/param-parser";
import config from "~/config";
import path from 'path'
import fs from 'fs'
import { Message } from "telegraf/typings/core/types/typegram";

export default Telegraf.command('help', async ctx => {
    let waiting_reply: Message
    setTimeout(async () => {
        if (waiting_reply) await ctx.deleteMessage(waiting_reply.message_id)
    }, 10000)
    let command = parseParams(ctx.message.text)
    if (!command.target) return waiting_reply = await ctx.reply("使用 /help [命令名称] 来查看一条命令的使用方法", {
        reply_to_message_id: ctx.message.message_id
    })
    try {
        let help_path = path.resolve(config.BASE_DIR, 'docs', command.target + '.md')
        let file_exist = fs.existsSync(help_path)

        if (!file_exist) return waiting_reply = await ctx.reply("该命令不存在", {
            reply_to_message_id: ctx.message.message_id
        })
        let str = fs.readFileSync(help_path).toString().trim()

        waiting_reply = await ctx.reply(str, {
            reply_to_message_id: ctx.message.message_id,
            parse_mode: 'Markdown'
        })
    }
    catch (err) {
        console.log(err)
        if (err instanceof Error) {
            return await ctx.reply('操作失败: ' + err.message, {
                reply_to_message_id: ctx.message.message_id
            })
        }
        return await ctx.reply('操作失败: 未知错误', {
            reply_to_message_id: ctx.message.message_id
        })
    }

})