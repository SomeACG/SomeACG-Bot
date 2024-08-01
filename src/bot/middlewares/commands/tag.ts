import { MessageOriginChannel } from 'telegraf/typings/core/types/typegram';
import { wrapCommand } from '~/bot/wrappers/command-wrapper';
import { getArtwork } from '~/database/operations/artwork';
import { getMessage } from '~/database/operations/message';
import { getTagsByNamesAndInsert } from '~/database/operations/tag';
import { modifyArtwork } from '~/services/artwork-service';
import { Artwork } from '~/types/Artwork';

export default wrapCommand('tag', async ctx => {
    if (!ctx.is_reply && !ctx.command.params['index'])
        return await ctx.directlyReply(
            '参数不正确，请回复一条消息或在在参数中指定作品序号！'
        );
    if (
        !ctx.command.target &&
        (!ctx.command.hashtags || ctx.command.hashtags.length == 0)
    )
        return await ctx.directlyReply('参数不正确，请在命令中添加标签！');
    if (ctx.is_reply && !ctx.reply_to_message.is_automatic_forward)
        return await ctx.resolveWait('回复的消息不是有效的频道消息！');
    await ctx.wait('正在修改作品标签...', true);

    const tags_set = new Set<string>();

    if (ctx.command.target) {
        const tags_string = ctx.command.target as string;
        if (tags_string.search(',') == -1) tags_set.add(tags_string);
        else tags_string.split(/,|，/).forEach(tag => tags_set.add(tag));
    }

    if (ctx.command.hashtags?.length > 0) {
        // 使用 hashtags 时屏蔽 target 的内容
        tags_set.clear();
        ctx.command.hashtags.forEach(tag => tags_set.add(tag));
    }

    let artwork: Artwork;
    if (ctx.reply_to_message) {
        const message_id: number = (
            ctx.reply_to_message.forward_origin as MessageOriginChannel
        ).message_id;
        const message = await getMessage(message_id);
        artwork = await getArtwork(message.artwork_index);
    } else artwork = await getArtwork(parseInt(ctx.command.params['index']));
    artwork.tags = await getTagsByNamesAndInsert(Array.from(tags_set));
    const exec_result = await modifyArtwork(artwork);
    if (exec_result.succeed) return await ctx.resolveWait('作品标签修改成功~');
    else return await ctx.resolveWait('修改失败: ' + exec_result.message);
});

// export default Telegraf.command('tag', async ctx => {
//     let waiting_message: Message
//     setTimeout(async () => {
//         if (waiting_message) await ctx.deleteMessage(waiting_message.message_id)
//     }, 10000)
//     let command = parseParams(ctx.message.text)
//     if (!ctx.message.reply_to_message && !command.params['index']) {
//         return await ctx.reply('参数不正确，请回复一条消息或在在参数中指定作品序号！', {
//             reply_to_message_id: ctx.message.message_id
//         })
//     }
//     if (!command.target) {
//         return await ctx.reply('参数不正确，请在命令中设置标签并用英文逗号隔开！', {
//             reply_to_message_id: ctx.message.message_id
//         })
//     }
//     waiting_message = await ctx.reply('正在设置作品标签...', {
//         reply_to_message_id: ctx.message.message_id
//     })
//     let tag_array = command.target.split(/,|，/)
//     try {
//         let artwork: Artwork
//         if (ctx.message.reply_to_message) {
//             let reply_to_message = ctx.message.reply_to_message as Message.CommonMessage
//             if (!reply_to_message.forward_from_message_id) return await ctx.reply('回复的消息不是有效的频道消息！', {
//                 reply_to_message_id: ctx.message.message_id
//             })
//             let message_id: number = reply_to_message.forward_from_message_id
//             let message = await getMessage(message_id)
//             artwork = await getArtwork(message.artwork_index)
//         }
//         else {
//             artwork = await getArtwork(parseInt(command.params['index']))
//         }
//         let tags = await getTagsByNamesAndInsert(tag_array)
//         artwork.tags = tags
//         let exec_result = await modifyArtwork(artwork)
//         if (exec_result.succeed) return await ctx.telegram.editMessageText(waiting_message.chat.id, waiting_message.message_id, undefined, '作品标签修改成功~')
//         return await ctx.telegram.editMessageText(waiting_message.chat.id, waiting_message.message_id, undefined, '操作失败: ' + exec_result.message)
//     }
//     catch (err) {
//         console.log(err)
//         if (err instanceof Error) {
//             return await ctx.telegram.editMessageText(waiting_message.chat.id, waiting_message.message_id, undefined, '操作失败: ' + err.message)
//         }
//         return await ctx.telegram.editMessageText(waiting_message.chat.id, waiting_message.message_id, undefined, '操作失败: 未知错误')
//     }

// })
