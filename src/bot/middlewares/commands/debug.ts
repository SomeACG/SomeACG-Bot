import { Telegraf } from 'telegraf';
import { Message } from 'telegraf/typings/core/types/typegram';
import { getArtwork } from '~/database/operations/artwork';
import { getMessage } from '~/database/operations/message';
import { parseParams } from '~/utils/param-parser';

export default Telegraf.command('debug', async ctx => {
    const command = parseParams(ctx.message.text);
    if (!command.target) {
        return await ctx.reply('No debug type specfiied !', {
            reply_to_message_id: ctx.message.message_id
        });
    }
    switch (command.target) {
        case 'chat_id':
            return await ctx.reply(ctx.chat.id.toString(), {
                reply_to_message_id: ctx.message.message_id
            });
        case 'dump':
            return await ctx.reply(
                '<pre>' +
                    JSON.stringify(ctx.message, undefined, '    ') +
                    '</pre>',
                {
                    reply_to_message_id: ctx.message.message_id,
                    parse_mode: 'HTML'
                }
            );
        case 'artwork':
            try {
                const reply_to_message = ctx.message
                    .reply_to_message as Message.CommonMessage;
                if (!reply_to_message.forward_from_message_id) return;
                const message = await getMessage(
                    reply_to_message.forward_from_message_id
                );
                const artwork = await getArtwork(message.artwork_index);
                return await ctx.reply(
                    '<pre>' +
                        JSON.stringify(artwork, undefined, '    ') +
                        '</pre>',
                    {
                        reply_to_message_id: ctx.message.message_id,
                        parse_mode: 'HTML'
                    }
                );
            } catch (err) {
                return await ctx.reply('Cannot get artwork info', {
                    reply_to_message_id: ctx.message.message_id
                });
            }
        default:
            return await ctx.reply('Debug target not found', {
                reply_to_message_id: ctx.message.message_id
            });
    }
});
