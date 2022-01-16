import { Telegraf } from "telegraf";
import { removePermissions } from "~/database/operations/admin";
import { parseParams } from "~/utils/param-parser";

export default Telegraf.command('ungrant', async ctx => {
    let command = parseParams(ctx.message.text)
    if (!command.params['user'] && !ctx.message.reply_to_message) {
        return await ctx.reply('命令语法不正确，请回复一条消息或撤销权限的用户ID!', {
            reply_to_message_id: ctx.message.message_id
        })
    }
    if (!ctx.message.reply_to_message?.from) return await ctx.reply('命令语法不正确，请回复一条用户发送的消息!', {
        reply_to_message_id: ctx.message.message_id
    })
    let user_id = -1
    if (command.params['user']) user_id = parseInt(command.params['user'])
    if (ctx.message.reply_to_message) user_id = ctx.message.reply_to_message.from.id
    try{
        let succeed = await removePermissions(user_id)
        if(succeed) await ctx.reply('成功移除用户 ' + user_id + ' 的所有权限', {
            reply_to_message_id: ctx.message.message_id
        })
        await ctx.reply('移除用户权限失败，请检查该用户是否具有权限', {
            reply_to_message_id: ctx.message.message_id
        })
    }
    catch(err)
    {
        console.log(err)
        if (err instanceof Error) {
            return await ctx.reply('操作失败: ' + err.message, {
                reply_to_message_id: ctx.message.message_id
            })
        }
        return await ctx.reply('操作失败: 未知错误',{
            reply_to_message_id: ctx.message.message_id
        })
    }
})