import getArtworkInfoByUrl from '~/platforms';
import config from '~/config';
import path from 'path';
import downloadFile from '~/utils/download';
import { wrapCommand } from '~/bot/wrappers/command-wrapper';
import { infoCmdCaption } from '~/utils/caption';

export default wrapCommand('info', async ctx => {
    if (!ctx.command.target)
        return await ctx.directlyReply(
            '使用方法:\n/info <参数> [作品链接]\n可选参数: picture_index 图片序号，默认为0'
        );
    const artwork_info = await getArtworkInfoByUrl(
        ctx.command.target,
        ctx.command.params['picture_index']
    );
    await ctx.wait('正在获取图片信息并下载图片，请稍后~~');
    const file_name = await downloadFile(
        artwork_info.url_origin,
        path.basename(new URL(artwork_info.url_origin).pathname)
    );
    const caption = infoCmdCaption(artwork_info);
    await ctx.replyWithDocument(
        {
            source: path.resolve(config.TEMP_DIR, file_name)
        },
        {
            caption,
            parse_mode: 'HTML',
            reply_to_message_id: ctx.message.message_id
        }
    );
    return await ctx.deleteWaiting();
});

// export default Telegraf.command('info', async ctx => {
//     let command = parseParams(ctx.message.text)
//     if (!command.target) {
//         return await ctx.reply(`使用方法:\n/info <参数> [作品链接]\n可选参数: picture_index 图片序号，默认为0`, {
//             reply_to_message_id: ctx.message.message_id
//         })
//     }
//     try {
//         let artwork_info = await getArtworkInfoByUrl(command.target, command.params['picture_index'])
//         let waiting_reply = await ctx.reply('正在获取图片信息并下载图片，请稍后~~', {
//             reply_to_message_id: ctx.message.message_id
//         })
//         let file_name = await downloadFile(artwork_info.url_origin, path.basename(new URL(artwork_info.url_origin).pathname))
//         let caption = "图片下载成功!\n"
//         if (artwork_info.title) caption += `<b>作品标题:</b> ${artwork_info.title}\n`
//         if (artwork_info.desc) caption += `<b>作品描述:</b> <pre>${artwork_info.desc}</pre>\n`
//         caption += `<b>尺寸:</b> ${artwork_info.size.width}x${artwork_info.size.height}`
//         await ctx.replyWithDocument({
//             source: path.resolve(config.TEMP_DIR, file_name),
//             filename: file_name
//         }, {
//             caption: caption,
//             parse_mode: 'HTML'
//         })
//         return await ctx.deleteMessage(waiting_reply.message_id)
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
// })
