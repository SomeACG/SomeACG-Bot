// import { adminPredicate, NonAdminHandler } from "~/bot/middlewares/guard"
import { Message } from 'telegraf/typings/core/types/typegram';
import getArtworkInfoByUrl from '~/platforms';
import { publishArtwork } from '~/services/artwork-service';
import { Contribution } from '~/types/Contribution';
import { getContributionById } from '~/database/operations/contribution';
import { wrapCommand } from '~/bot/wrappers/command-wrapper';
import logger from '~/utils/logger';
import { semiIntArray } from '~/utils/param-parser';

export default wrapCommand('push', async ctx => {
    if (!ctx.command.urls || ctx.command.urls.length == 0)
        return await ctx.directlyReply(
            '命令语法不正确\n命令语法: /push [args(key=value)] <url>'
        );
    if (
        !ctx.command.params['tags'] &&
        (!ctx.command.hashtags || ctx.command.hashtags.length == 0)
    )
        return await ctx.directlyReply('请至少设置一个标签!');
    if (
        ctx.reply_to_message &&
        (ctx.reply_to_message as Message.DocumentMessage).document == undefined
    )
        return await ctx.directlyReply('回复的消息必须是一个文件!');
    await ctx.wait('正在发布作品...');
    const tags_set = new Set<string>();
    const artwork_info = await getArtworkInfoByUrl(
        ctx.command.urls[0],
        ctx.command.params['index']
            ? semiIntArray(ctx.command.params['index'])
            : undefined
    );
    let contribution: Contribution | undefined;
    if (ctx.command.params['contribute_from'])
        contribution = await getContributionById(
            parseInt(ctx.command.params['contribute_from'])
        );

    const origin_file_msg = ctx.reply_to_message as Message.DocumentMessage;

    if (origin_file_msg?.document?.file_id) {
        const file_url = await ctx.telegram.getFileLink(
            origin_file_msg.document.file_id
        );
        artwork_info.photos[0].url_origin = file_url.href;
    }

    if (ctx.command.params['tags']) {
        const tags_string = ctx.command.params['tags'] as string;
        if (tags_string.search(',') == -1) tags_set.add(tags_string);
        else tags_string.split(/,|，/).forEach(tag => tags_set.add(tag));
    }

    if (ctx.command.hashtags) {
        ctx.command.hashtags.forEach(tag => tags_set.add(tag));
    }

    const result = await publishArtwork(artwork_info, {
        is_quality: ctx.command.params['quality'] ? true : false,
        picture_index: ctx.command.params['index']
            ? semiIntArray(ctx.command.params['index'])
            : [0],
        artwork_tags: Array.from(tags_set),
        origin_file_name: origin_file_msg?.document?.file_name,
        origin_file_modified: origin_file_msg?.document?.file_name
            ? true
            : false,
        contribution
    });
    if (result.succeed) {
        await ctx.resolveWait('作品发布成功~');
        if (contribution) {
            await ctx.telegram.sendMessage(
                contribution.chat_id,
                '您的投稿已经审核通过并发布到频道~',
                {
                    reply_parameters: {
                        message_id: contribution.message_id,
                        allow_sending_without_reply: true
                    }
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
