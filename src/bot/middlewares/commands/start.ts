import { Telegraf } from "telegraf";
import { wrapCommand } from "~/bot/wrappers/command-wrapper";
import { getMessageByArtwork } from "~/database/operations/message";

export default wrapCommand('start', async ctx => {
    if(ctx.chat.type == 'private')
    {
        if(!ctx.command.target) return await ctx.reply('喵喵喵~')
        let start_params = ctx.command.target.search('-') == -1 ? [ ctx.command.target ] : ctx.command.target.split('-')
        if(start_params[0] == 'document')
        {
            let artwork_index = parseInt(start_params[1])
            let document_message = await getMessageByArtwork(artwork_index, 'document')
            await ctx.replyWithDocument(document_message.file_id, {
                caption: '这是你要的原图~'
            })
        }
    }
})

// export default Telegraf.command('start', async ctx => {
//     if(ctx.chat.type == 'private')
//     {
//         return await ctx.reply('喵喵喵~')
//     }
// })