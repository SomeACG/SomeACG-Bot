import { Telegraf } from "telegraf";
import config from "~/config"
import path from 'path'
import fs from 'fs'
import getArtworkInfo from "~/platforms/pixiv";
import downloadFile from "~/utils/download";
import { parseParams } from "~/utils/param-parser";

export default Telegraf.command('pixiv', async ctx => {
    let command = parseParams(ctx.message.text)
    if (!command.target) {
        return await ctx.reply(`使用方法:\n/pixiv <参数> [P站链接]\n可选参数: picture_index 图片序号，默认为0`, {
            reply_to_message_id: ctx.message.message_id
        })
    }
    let matchRes = command.target.match(/^https:\/\/www\.pixiv\.net\/(en\/)?artworks\/(\d{8})(\/)?$/)
    if (!matchRes) {
        return await ctx.reply('链接格式不正确，请使用一个Pixiv链接', {
            reply_to_message_id: ctx.message.message_id
        })
    }
    let waiting_reply = await ctx.reply('正在下载图片，请稍后~~', {
        reply_to_message_id: ctx.message.message_id
    })
    try {
        let artwork_info = await getArtworkInfo(matchRes[0], command.params['picture_index'] ? parseInt(command.params['picture_index']) : 0)
        let file_name = await downloadFile(artwork_info.url_origin)
        await ctx.replyWithDocument({
            source: path.resolve(config.TEMP_DIR, file_name),
            filename: file_name
        }, {
            caption: `图片下载成功!\n<b>标题:</b> ${artwork_info.title}\n<b>描述:</b> ${artwork_info.desc}\n<b>尺寸:</b> ${artwork_info.size.width}x${artwork_info.size.height}`,
            parse_mode: 'HTML'
        })
        return await ctx.deleteMessage(waiting_reply.message_id)
    }
    catch (err) {
        console.log(err)
        if (err instanceof Error) {
            return await ctx.telegram.editMessageText(waiting_reply.chat.id, waiting_reply.message_id, undefined, '操作失败: ' + err.message)
        }
        return await ctx.telegram.editMessageText(waiting_reply.chat.id, waiting_reply.message_id, undefined, '操作失败: 未知错误')
    }
})