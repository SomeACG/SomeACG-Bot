import { Telegraf, NarrowedContext, Context } from "telegraf";
import { Message, Update } from "telegraf/typings/core/types/typegram";
import { CommandEntity } from "~/types/Command";
import { parseParams } from "~/utils/param-parser";
import * as tt from 'telegraf/src/telegram-types'

export function wrapCommand(command: string, fn: (ctx: WarpperContext) => Promise<any>) {
    return Telegraf.command(command, async ctx => {
        let _ctx = new WarpperContext(ctx)
        try {
            await fn(_ctx)
        }
        catch (err) {
            console.log(err)
            if (err instanceof Error) {
                return await _ctx.resolveWait("操作失败: " + err.message)
            }
            return await _ctx.resolveWait("操作失败: 未知原因")
        }
    })
}

export class WarpperContext extends Context<Update.MessageUpdate> {
    constructor(ctx: NarrowedContext<Context, tt.MountMap['text']>) {
        super(ctx.update, ctx.telegram, ctx.botInfo)
        this.raw_ctx = ctx
        this.command = parseParams(ctx.message.text)
        if(ctx.message.reply_to_message) this.is_reply = true
        else this.is_reply = false
        if(this.is_reply) this.reply_to_message = ctx.message.reply_to_message as Message.CommonMessage
    }
    raw_ctx: NarrowedContext<Context, Update.MessageUpdate>
    waiting_message: Message | undefined
    command: CommandEntity
    is_reply: boolean
    reply_to_message?: Message.CommonMessage
    autoDelete(timeout?: number){
        if(!timeout) timeout = 20
        setTimeout(async () => {
            if(this.waiting_message) await this.deleteMessage(this.waiting_message.message_id)
        }, timeout)
    }
    async wait(message: string, auto_delete?: boolean) {
        if (!this.waiting_message) await this.reply(message, {
            reply_to_message_id: this.message.message_id
        })
        if(auto_delete) this.autoDelete()
    }
    async resolveWait(message: string) {
        if (this.waiting_message) await this.telegram.editMessageText(this.waiting_message.chat.id, this.waiting_message.message_id, undefined, message)
        else await this.directlyReply(message)
    }
    async directlyReply(message: string) {
        await this.reply(message, {
            reply_to_message_id: this.message.message_id
        })
    }
}