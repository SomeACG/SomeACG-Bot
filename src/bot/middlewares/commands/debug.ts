import { Telegraf } from 'telegraf';
import {
    Message,
    MessageOriginChannel
} from 'telegraf/typings/core/types/typegram';
import { getArtwork } from '~/database/operations/artwork';
import { getMessage } from '~/database/operations/message';
import { parseParams } from '~/utils/param-parser';

export default Telegraf.command('debug', async ctx => {
    const command = parseParams(ctx.message.text);
    if (!command.target) {
        return await ctx.reply('No debug type specfiied !', {
            reply_parameters: {
                message_id: ctx.message.message_id,
                allow_sending_without_reply: true
            }
        });
    }
    switch (command.target) {
        case 'chat_id':
            return await ctx.reply(ctx.chat.id.toString(), {
                reply_parameters: {
                    message_id: ctx.message.message_id,
                    allow_sending_without_reply: true
                }
            });
        case 'dump':
            return await ctx.reply(
                '<pre>' +
                    JSON.stringify(ctx.message, undefined, '    ') +
                    '</pre>',
                {
                    reply_parameters: {
                        message_id: ctx.message.message_id,
                        allow_sending_without_reply: true
                    },
                    parse_mode: 'HTML'
                }
            );
        case 'artwork':
            try {
                const reply_to_message = ctx.message
                    .reply_to_message as Message.CommonMessage;
                if (!reply_to_message.is_automatic_forward) return;
                const message = await getMessage(
                    (reply_to_message.forward_origin as MessageOriginChannel)
                        .message_id
                );
                const artwork = await getArtwork(message.artwork_index);
                return await ctx.reply(
                    '<pre>' +
                        JSON.stringify(artwork, undefined, '    ') +
                        '</pre>',
                    {
                        reply_parameters: {
                            message_id: ctx.message.message_id,
                            allow_sending_without_reply: true
                        },
                        parse_mode: 'HTML'
                    }
                );
            } catch (err) {
                return await ctx.reply('Cannot get artwork info', {
                    reply_parameters: {
                        message_id: ctx.message.message_id,
                        allow_sending_without_reply: true
                    }
                });
            }
        default:
            return await ctx.reply('Debug target not found', {
                reply_parameters: {
                    message_id: ctx.message.message_id,
                    allow_sending_without_reply: true
                }
            });
    }
});
