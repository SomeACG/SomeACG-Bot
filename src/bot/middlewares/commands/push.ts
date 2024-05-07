// import { adminPredicate, NonAdminHandler } from "~/bot/middlewares/guard"
import { Message } from 'telegraf/typings/core/types/typegram';
import getArtworkInfoByUrl from '~/platforms';
import { publishArtwork } from '~/services/artwork-service';
import { Contribution } from '~/types/Contribution';
import { getContributionById } from '~/database/operations/contribution';
import { wrapCommand } from '~/bot/wrappers/command-wrapper';
import logger from '~/utils/logger';

export default wrapCommand('push', async ctx => {
    if (!ctx.command.target || !ctx.command.params)
        return await ctx.directlyReply(
            '命令语法不正确\n命令语法: /push [args(key=value)] <target>'
        );
    if (!ctx.command.params['tags'])
        return await ctx.directlyReply('请至少设置一个标签!');
    if (
        ctx.reply_to_message &&
        (ctx.reply_to_message as Message.DocumentMessage).document == undefined
    )
        return await ctx.directlyReply('回复的消息必须是一个文件!');
    await ctx.wait('正在发布作品...');
    const tags_string = ctx.command.params['tags'] as string;
    const artwork_info = await getArtworkInfoByUrl(
        ctx.command.target,
        ctx.command.params['picture_index']
    );
    let contribution: Contribution | undefined;
    if (ctx.command.params['contribute_from'])
        contribution = await getContributionById(
            parseInt(ctx.command.params['contribute_from'])
        );
    const result = await publishArtwork(artwork_info, {
        is_quality: ctx.command.params['quality'] ? true : false,
        picture_index: ctx.command.params['picture_index']
            ? parseInt(ctx.command.params['picture_index'])
            : 0,
        artwork_tags:
            tags_string.search(',') == -1
                ? [tags_string]
                : tags_string.split(/,|，/),
        origin_file_id: ctx.reply_to_message
            ? (ctx.reply_to_message as Message.DocumentMessage).document.file_id
            : undefined,
        contribution: contribution
    });
    if (result.succeed) {
        await ctx.resolveWait('作品发布成功~');
        if (contribution) {
            await ctx.telegram.sendMessage(
                contribution.chat_id,
                '您的投稿已经审核通过并发布到频道~',
                {
                    reply_to_message_id: contribution.message_id
                }
            );
            try {
                await ctx.telegram.deleteMessage(
                    contribution.chat_id,
                    contribution.reply_message_id
                );
            } catch (e) {
                logger.warn(e);
            }
        }
        return;
    }
    await ctx.resolveWait('作品发布失败: ' + result.message);
});
