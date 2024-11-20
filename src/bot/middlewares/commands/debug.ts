import { Telegraf } from 'telegraf';
import {
    Message,
    MessageOriginChannel
} from 'telegraf/typings/core/types/typegram';
import { getArtwork } from '~/database/operations/artwork';
import { getMessage } from '~/database/operations/message';
import { Artwork } from '~/types/Artwork';
import logger from '~/utils/logger';
import { parseParams } from '~/utils/param-parser';

export default Telegraf.command('debug', async ctx => {
    const command = parseParams(ctx.message.text);
    if (!command.target) {
        return await ctx.reply('No debug type specfiied!', {
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
        case 'file_id':
            const msg = ctx.message.reply_to_message as Partial<
                Message.PhotoMessage & Message.DocumentMessage
            >;

            let file_id = '';

            if (msg?.photo) file_id = msg.photo[msg.photo.length - 1].file_id;
            if (msg?.document) file_id = msg.document.file_id;

            return await ctx.reply(
                file_id
                    ? `file_id: <code>${file_id}</code>`
                    : 'No file found in the message',
                {
                    reply_parameters: {
                        message_id: ctx.message.message_id,
                        allow_sending_without_reply: true
                    },
                    parse_mode: 'HTML'
                }
            );
        case 'dump':
            return await ctx.reply(
                '<pre>' +
                    JSON.stringify(
                        ctx.message.reply_to_message
                            ? ctx.message.reply_to_message
                            : ctx.message,
                        undefined,
                        '    '
                    ) +
                    '</pre>',
                {
                    reply_parameters: {
                        message_id: ctx.message.message_id,
                        allow_sending_without_reply: true
                    },
                    parse_mode: 'HTML'
                }
            );
        case 'parser':
            if (!ctx.message.reply_to_message)
                return await ctx.reply('Reply a message to parse', {
                    reply_parameters: {
                        message_id: ctx.message.message_id,
                        allow_sending_without_reply: true
                    }
                });

            const target_msg = ctx.message
                .reply_to_message as Message.TextMessage;

            return await ctx.reply(
                '<pre>' +
                    JSON.stringify(
                        parseParams(target_msg.text, target_msg.entities),
                        undefined,
                        '    '
                    ) +
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

                // In case that the title or desc field has special characters
                // Just remove them

                artwork.title = '...';
                artwork.desc = '...';

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
                logger.error(err);
                return await ctx.reply('Cannot get artwork info', {
                    reply_parameters: {
                        message_id: ctx.message.message_id,
                        allow_sending_without_reply: true
                    }
                });
            }
        default:
            return await ctx.reply(`Debug type '${command.target}' not found`, {
                reply_parameters: {
                    message_id: ctx.message.message_id,
                    allow_sending_without_reply: true
                }
            });
    }
});
