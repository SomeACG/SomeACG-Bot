import getArtworkInfoByUrl from '~/platforms';
import config from '~/config';
import path from 'path';
import downloadFile from '~/utils/download';
import { wrapCommand } from '~/bot/wrappers/command-wrapper';
import { infoCmdCaption } from '~/utils/caption';
import { semiIntArray } from '~/utils/param-parser';

export default wrapCommand('info', async ctx => {
    if (!ctx.command.urls || ctx.command.urls.length == 0)
        return await ctx.directlyReply(
            '使用方法:\n/info <参数> [作品链接]\n可选参数: index 图片序号，默认为0'
        );
    const artwork_info = await getArtworkInfoByUrl(
        ctx.command.urls[0],
        ctx.command.params['index']
            ? semiIntArray(ctx.command.params['index'])
            : [-1] // -1 means all pictures, it should be handled in the platforms module
    );
    await ctx.wait('正在获取图片信息并下载图片，请稍后~~');

    const files = await Promise.all(
        artwork_info.photos.map(async photo => {
            const file_name = await downloadFile(
                photo.url_origin,
                path.basename(new URL(photo.url_origin).pathname)
            );
            return file_name;
        })
    );

    const caption = infoCmdCaption(artwork_info);

    await ctx.replyWithMediaGroup(
        files.map(file_name => ({
            type: 'document',
            media: {
                source: path.resolve(config.TEMP_DIR, file_name)
            },
            caption:
                file_name === files[files.length - 1] ? caption : undefined,
            parse_mode: 'HTML'
        })),
        {
            reply_parameters: {
                message_id: ctx.message.message_id,
                allow_sending_without_reply: true
            }
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
