import { wrapCommand } from '~/bot/wrappers/command-wrapper';
import { getFileByName } from '~/database/operations/file';
import { getMessageByArtwork } from '~/database/operations/message';

export default wrapCommand('start', async ctx => {
    if (ctx.chat.type == 'private') {
        if (!ctx.command.target) return await ctx.reply('喵喵喵~');
        const start_params =
            ctx.command.target.search('-') == -1
                ? [ctx.command.target]
                : ctx.command.target.split('-');

        switch (start_params[0]) {
            case 'document':
                const artwork_index = parseInt(start_params[1]);
                const document_message = await getMessageByArtwork(
                    artwork_index,
                    'document'
                );
                await ctx.replyWithDocument(document_message.file_id, {
                    caption: '这是你要的原图~'
                });
                break;
            case 'file':
                const file_name = start_params[1];
                const file = await getFileByName(file_name);
                await ctx.replyWithDocument(file.file_id, {
                    caption: file.description
                        ? file.description
                        : '这是你要的文件，请自取~'
                });
                break;
            default:
                break;
        }
    }
});
