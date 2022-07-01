import { Markup, Telegraf } from "telegraf";
import { getArtworksByTags, getRandomArtworks } from "~/database/operations/artwork";

export default Telegraf.on('inline_query', async ctx => {
    let query = ctx.inlineQuery.query
    let artwork_results = []
    if (!query) {
        artwork_results = await getRandomArtworks(20);
    }
    else {
        let tags = query.indexOf(' ') == -1 ? [query] : query.split(' ')
        artwork_results = await getArtworksByTags(tags)
    }

    let results = artwork_results.map((artwork, index) => ({
        type: "photo",
        id: ctx.inlineQuery.id + '-' + index,
        photo_file_id: artwork.photo_file_id,
        caption: "这是你要的壁纸~",
        reply_markup: Markup.inlineKeyboard([
            Markup.button.url('作品来源', artwork.source.post_url),
            Markup.button.url('获取原图', `https://t.me/${ctx.me}?start=document-${artwork.index}`)
        ]).reply_markup
    }))

    // @ts-ignore
    return await ctx.answerInlineQuery(results);

})