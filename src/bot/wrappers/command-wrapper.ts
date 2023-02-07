/* eslint-disable prefer-const */
import { Telegraf, NarrowedContext, Context } from 'telegraf';
import {
    Message,
    ParseMode,
    Update
} from 'telegraf/typings/core/types/typegram';
import { CommandEntity } from '~/types/Command';
import { parseParams } from '~/utils/param-parser';
import * as tt from 'telegraf/src/telegram-types';
import logger from '~/utils/logger';

export function wrapCommand(
    command: string,
    fn: (ctx: WarpperContext) => Promise<unknown>
) {
    return Telegraf.command(command, async ctx => {
        let _ctx = new WarpperContext(ctx);
        try {
            await fn(_ctx);
            global.currentMongoSession?.commitTransaction().then(() => {
                logger.debug('mongoose transaction commited');
                global.currentMongoSession?.endSession();
                global.currentMongoSession = undefined;
            });
        } catch (err) {
            logger.error(
                err,
                `error occured when processing ${command} command`
            );

            global.currentMongoSession?.abortTransaction().then(() => {
                logger.warn('mongoose transaction aborted');
                global.currentMongoSession?.endSession();
                global.currentMongoSession = undefined;
            });

            if (err instanceof Error) {
                return await _ctx.resolveWait(
                    `操作失败: <pre>${err.message}</pre>`,
                    'HTML'
                );
            }
            return await _ctx.resolveWait('操作失败: 未知原因');
        }
    });
}

export class WarpperContext extends Context<Update.MessageUpdate> {
    constructor(ctx: NarrowedContext<Context, tt.MountMap['text']>) {
        super(ctx.update, ctx.telegram, ctx.botInfo);
        this.raw_ctx = ctx;
        this.command = parseParams(ctx.message.text);
        if (ctx.message.reply_to_message) this.is_reply = true;
        else this.is_reply = false;
        if (this.is_reply)
            this.reply_to_message = ctx.message
                .reply_to_message as Message.CommonMessage;
    }
    raw_ctx: NarrowedContext<Context, Update.MessageUpdate>;
    waiting_message?: Message;
    command: CommandEntity;
    is_reply: boolean;
    reply_to_message?: Message.CommonMessage;
    autoDelete(timeout?: number) {
        if (!timeout) timeout = 20000;
        setTimeout(async () => {
            if (this.waiting_message) {
                try {
                    await this.deleteMessage(this.waiting_message.message_id);
                } catch (e) {
                    /* empty */
                }
            }
        }, timeout);
    }
    async directlyReply(message: string, parse_mode?: ParseMode) {
        return await this.reply(message, {
            reply_to_message_id:
                this.chat.type == 'private'
                    ? undefined
                    : this.message.message_id,
            parse_mode: parse_mode
        });
    }
    async wait(message: string, auto_delete?: boolean, parse_mode?: ParseMode) {
        if (!this.waiting_message)
            this.waiting_message = await this.directlyReply(
                message,
                parse_mode
            );
        if (auto_delete) this.autoDelete();
    }
    async resolveWait(message: string, parse_mode?: ParseMode) {
        if (this.waiting_message)
            await this.telegram.editMessageText(
                this.waiting_message.chat.id,
                this.waiting_message.message_id,
                undefined,
                message,
                {
                    parse_mode: parse_mode
                }
            );
        else await this.directlyReply(message, parse_mode);
    }
    async deleteWaiting() {
        if (this.waiting_message)
            this.deleteMessage(this.waiting_message.message_id);
    }
}
