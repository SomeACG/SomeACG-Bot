import { Telegraf } from "telegraf"
import { CallbackQuery } from "telegraf/typings/core/types/typegram"
import { deleteContribution } from "~/database/operations/contribution"

export default Telegraf.action(/delete-/, async ctx => {
    let query = ctx.callbackQuery
    let message_id = parseInt(query.data?.split('-')[1])

    try {
        let delete_count = await deleteContribution(message_id)
        if (delete_count > 0) {
            await ctx.answerCbQuery('投稿已删除~')
            await ctx.deleteMessage(message_id)
            await ctx.deleteMessage()
        }
        await ctx.answerCbQuery('投稿删除失败')
    }
    catch (err) {
        if (err instanceof Error) {
            ctx.answerCbQuery('操作失败:' + err.message)
        }
        ctx.answerCbQuery('操作失败: 未知原因')
    }
})