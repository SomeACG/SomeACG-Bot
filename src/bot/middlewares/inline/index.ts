import { Markup, Telegraf } from 'telegraf';
import {
    getArtworksByTags,
    getRandomArtworks
} from '~/database/operations/artwork';
import { pushChannelUrl, randomCaption } from '~/utils/caption';

export default Telegraf.on('inline_query', async ctx => {
    const query = ctx.inlineQuery.query;
    const tags: string[] = [];
    let artwork_results = [];
    if (!query) {
        artwork_results = await getRandomArtworks(20);
    } else {
        if (query.indexOf(' ') == -1) tags.push(query);
        else tags.push(...query.split(' '));

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
                photo_file_id: artwork.photo_message.file_id,
                caption: randomCaption(artwork, tags),
                parse_mode: 'HTML',
                reply_markup: Markup.inlineKeyboard([
                    Markup.button.url(
                        '查看详情',
                        pushChannelUrl(artwork.photo_message.message_id)
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
