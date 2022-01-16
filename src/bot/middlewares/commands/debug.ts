import { Telegraf } from "telegraf";
import { parseParams } from "~/utils/param-parser";

export default Telegraf.command('debug', async ctx => {
    let command = parseParams(ctx.message.text)
    if (!command.target) {
        return await ctx.reply('No debug type specfiied !', {
            reply_to_message_id: ctx.message.message_id
        })
    }
    switch (command.target) {
        case 'chat_id':
            return await ctx.reply(ctx.chat.id.toString(), {
                reply_to_message_id: ctx.message.message_id
            })
        case 'dump':
            return await ctx.reply('<pre>' + JSON.stringify(ctx.message, undefined, '    ') + '</pre>', {
                reply_to_message_id: ctx.message.message_id,
                parse_mode: 'HTML'
            })
        default:
            return await ctx.reply('Debug target not found', {
                reply_to_message_id: ctx.message.message_id
            })
    }
})