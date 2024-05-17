import { Markup, Telegraf } from 'telegraf';
import {
    getArtworksByTags,
    getRandomArtworks
} from '~/database/operations/artwork';
import { pushChannelUrl } from '~/utils/caption';

export default Telegraf.on('inline_query', async ctx => {
    const query = ctx.inlineQuery.query;
    let artwork_results = [];
    if (!query) {
        artwork_results = await getRandomArtworks(20);
    } else {
        const tags = query.indexOf(' ') == -1 ? [query] : query.split(' ');
        artwork_results = await getArtworksByTags(tags);
    }

    if (artwork_results?.length == 0) {
        return await ctx.answerInlineQuery([
            {
                type: 'article',
                id: ctx.inlineQuery.id,
                title: '没有找到结果呢，试着换个关键词吧~',
                input_message_content: {
                    message_text: '没有找到结果呢，试着换个关键词吧~'
                }
            }
        ]);
    } else {
        return await ctx.answerInlineQuery(
            artwork_results.map((artwork, index) => ({
                type: 'photo',
                id: ctx.inlineQuery.id + '-' + index,
                photo_file_id: artwork.photo_file_id,
                caption: '这是你要的壁纸~',
                reply_markup: Markup.inlineKeyboard([
                    Markup.button.url(
                        '查看详情',
                        pushChannelUrl(artwork.photo_message_id)
                    ),
                    Markup.button.url(
                        '获取原图',
                        `https://t.me/${ctx.me}?start=document-${artwork.index}`
                    )
                ]).reply_markup
            }))
        );
    }
});
