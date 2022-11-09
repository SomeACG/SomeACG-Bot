import { delArtwork } from '~/services/artwork-service';
import { getMessage } from '~/database/operations/message';
import { wrapCommand } from '~/bot/wrappers/command-wrapper';
import { Artwork } from '~/types/Artwork';
import { getArtwork } from '~/database/operations/artwork';

export default wrapCommand('delete', async ctx => {
    if (!ctx.command.params['index'] && !ctx.is_reply)
        return await ctx.directlyReply(
            '命令语法不正确，请回复一条消息或指定要删除的作品序号!'
        );
    await ctx.wait('正在删除作品...', true);
    let artwork_index = -1;
    if (ctx.is_reply) {
        if (!ctx.reply_to_message?.forward_from_message_id)
            return await ctx.resolveWait('回复的消息不是有效的频道消息！');
        const message = await getMessage(
            ctx.reply_to_message.forward_from_message_id
        );
        artwork_index = message.artwork_index;
    }
    let artwork: Artwork;
    if (ctx.reply_to_message) {
        const message_id: number = ctx.reply_to_message.forward_from_message_id;
        const message = await getMessage(message_id);
        artwork = await getArtwork(message.artwork_index);
        artwork_index = artwork.index;
    } else if (ctx.command.params['index'])
        artwork_index = parseInt(ctx.command.params['index']);
    const result = await delArtwork(artwork_index);
    if (result.succeed) return;
    else await ctx.resolveWait('作品删除失败: ' + result.message);
});
