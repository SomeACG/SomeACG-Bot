import { Telegraf } from "telegraf";

export default Telegraf.command('start', async ctx => {
    if(ctx.chat.type == 'private')
    {
        return await ctx.reply('喵喵喵~ 欢迎使用本bot~')
    }
})