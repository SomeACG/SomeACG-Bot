import { Telegraf, Markup } from 'telegraf';
import config from '~/config';
import ContributionModel from '~/database/models/CountributionModel';
import getArtworkInfoByUrl from '~/platforms';
import { contributeCaption } from '~/utils/caption';

export default Telegraf.hears(/#投稿/, async ctx => {
    if (
        ctx.chat.type == 'private' &&
        !config.ADMIN_LIST.includes(ctx.from?.id.toString())
    ) {
        return await ctx.reply('不能在私聊中使用投稿，请在群里进行投稿');
    }

    if (
        ctx.message.sender_chat?.type === 'group' ||
        ctx.message.sender_chat?.type === 'supergroup'
    ) {
        return await ctx.reply('抱歉，不可以使用匿名群组身份投稿哦~', {
            reply_parameters: {
                message_id: ctx.message.message_id,
                allow_sending_without_reply: true
            }
        });
    }

    try {
        const artworkInfo = await getArtworkInfoByUrl(ctx.message.text);
        const replyMessage = await ctx.reply(contributeCaption(artworkInfo), {
            reply_parameters: {
                message_id: ctx.message.message_id,
                allow_sending_without_reply: true
            },
            link_preview_options: {
                is_disabled: false,
                url: 'https://pre.someacg.top/' + artworkInfo.post_url,
                prefer_large_media: true,
                show_above_text: true
            },
            parse_mode: 'HTML',
            ...Markup.inlineKeyboard([
                [
                    Markup.button.callback(
                        '发到频道',
                        `publish-${ctx.message.message_id}`
                    ),
                    Markup.button.callback(
                        '删除投稿',
                        `delete-${ctx.message.message_id}`
                    )
                ],
                [
                    Markup.button.callback(
                        '发到频道并设为精选',
                        `publish-${ctx.message.message_id}-q`
                    )
                ]
            ])
        });

        const isFromChannel = ctx.message.sender_chat?.type === 'channel';

        const contribution = new ContributionModel({
            post_url: artworkInfo.post_url,
            chat_id: ctx.message.chat.id,
            user_id: isFromChannel
                ? ctx.message.sender_chat.id
                : ctx.message.from.id,
            user_tg_username: isFromChannel
                ? ctx.message.sender_chat.username
                : ctx.message.from.username,
            user_name:
                isFromChannel && 'title' in ctx.message.sender_chat
                    ? ctx.message.sender_chat.title
                    : ctx.message.from.first_name,
            message_id: ctx.message.message_id,
            reply_message_id: replyMessage.message_id
        });

        await contribution.save();
    } catch (err) {
        if (err instanceof Error) {
            ctx.reply(err.message, {
                reply_parameters: {
                    message_id: ctx.message.message_id,
                    allow_sending_without_reply: true
                }
            });
            return;
        }
    }
});
