import { Context, Middleware, MiddlewareFn, Telegraf } from "telegraf";
import { MatchedMiddleware } from "telegraf/typings/composer";
import { Message, Update } from "telegraf/typings/core/types/typegram";

interface WrappedContext extends Context {
    wait: (message: string) => Promise<any>
    editWait: (message: string) => Promise<any>
}

export function warpFn(fn: (ctx: CommandWarpper) => Promise<any>){
    
}

export function warppedCommand(command: string, fn: MiddlewareFn<CommandWarpper>){
    Telegraf.command(command,fn as MiddlewareFn<Context>)
}

export class CommandWarpper extends Context implements WrappedContext {
    waiting_message: Message | undefined;
    async wait(message: string) {
        if(!this.waiting_message) await this.reply(message, {
            reply_to_message_id: this.message!.message_id
        })
    }
    async editWait(message: string){
        if(this.waiting_message) await this.telegram.editMessageText(this.waiting_message.chat.id, this.waiting_message.message_id, undefined, message)
    }
    async message_reply(message: string) {
        await this.reply(message, {
            reply_to_message_id: this.message!.message_id
        })
    }
}