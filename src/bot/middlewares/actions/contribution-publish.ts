import { Telegraf } from 'telegraf';
import { getContributionById } from '~/database/operations/contribution';
import { CallbackQuery } from 'telegraf/typings/core/types/typegram';
import logger from '~/utils/logger';

export default Telegraf.action(/publish-/, async ctx => {
    const query = ctx.callbackQuery as CallbackQuery & { data: string };

    const query_params = query.data.split('-');

    try {
        const contribution = await getContributionById(
            parseInt(query_params[1])
        );

        if (!ctx.from) return;

        let pushCommand = '/push';
        if (query_params[2] == 'q') pushCommand += ' quality=true';
        pushCommand += ' picture_index=0';
        pushCommand += ' contribute_from=' + contribution.message_id;
        pushCommand += ' ' + contribution.post_url;

        await ctx.telegram.sendMessage(
            ctx.from.id,
            '请修改此命令并添加tags参数后发送给我:\n<pre>' +
                pushCommand +
                '</pre>',
            {
                parse_mode: 'HTML'
            }
        );
        await ctx.answerCbQuery();
    } catch (err) {
        logger.error(err, "error occured when processing 'publish' action");
        if (err instanceof Error) return await ctx.answerCbQuery(err.message);
    }
});
