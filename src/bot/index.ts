import config from '~/config';
import { Telegraf } from 'telegraf';
import { genAdminPredicate } from './middlewares/guard';
import { HttpsProxyAgent } from 'https-proxy-agent';

// Development Mode

const { HTTPS_PROXY_HOST, HTTPS_PROXY_PORT } = process.env;

const agent = new HttpsProxyAgent({
    host: HTTPS_PROXY_HOST,
    port: HTTPS_PROXY_PORT
});

const bot = new Telegraf(
    config.BOT_TOKEN,
    config.USE_PROXY
        ? {
              telegram: { agent },
              handlerTimeout: 600000
          }
        : {
              handlerTimeout: 600000
          }
);

bot.use(async (ctx, next) => {
    logger.debug(ctx.update, 'new update');
    if (config.DEV_MODE && ctx.from?.id) {
        if (!config.ADMIN_LIST.includes(ctx.from.id.toString())) return;
    }
    await next();
});

// Version command middleware
bot.use(
    Telegraf.command('version', async ctx => {
        const environment = process.env.DEV_MODE ? 'debug' : 'production';
        return await ctx.reply(
            `<b>当前版本：</b>${config.VERSION}\n<b>工作环境：</b>${environment}`,
            {
                reply_parameters:
                    ctx.chat.type == 'private'
                        ? undefined
                        : {
                              message_id: ctx.message.message_id,
                              allow_sending_without_reply: true
                          },
                parse_mode: 'HTML'
            }
        );
    })
);

// Commands
import startCommand from './middlewares/commands/start';
bot.use(startCommand);
import infoCommand from './middlewares/commands/info';
bot.use(infoCommand);
import randomCommand from './middlewares/commands/random';
bot.use(randomCommand);
import helpCommand from './middlewares/commands/help';
bot.use(helpCommand);
import debugCommand from './middlewares/commands/debug';
bot.use(Telegraf.optional(genAdminPredicate(), debugCommand));
import pushCommand from './middlewares/commands/push';
bot.use(
    Telegraf.optional(genAdminPredicate(AdminPermission.PUBLISH), pushCommand)
);
import tagCommand from './middlewares/commands/tag';
bot.use(Telegraf.optional(genAdminPredicate(AdminPermission.TAG), tagCommand));
import updateCommand from './middlewares/commands/update';
bot.use(
    Telegraf.optional(genAdminPredicate(AdminPermission.UPDATE), updateCommand)
);
import deleteCommand from './middlewares/commands/delete';
bot.use(
    Telegraf.optional(genAdminPredicate(AdminPermission.DELETE), deleteCommand)
);
import grantCommand from './middlewares/commands/grant';
bot.use(
    Telegraf.optional(genAdminPredicate(AdminPermission.GRANT), grantCommand)
);
import ungrantCommand from './middlewares/commands/ungrant';
bot.use(
    Telegraf.optional(genAdminPredicate(AdminPermission.GRANT), ungrantCommand)
);
import fileCommand from './middlewares/commands/file';
bot.use(
    Telegraf.optional(genAdminPredicate(AdminPermission.PUBLISH), fileCommand)
);

// Actions
import contributionPublishAction from './middlewares/actions/contribution-publish';
bot.use(
    Telegraf.optional(
        genAdminPredicate(AdminPermission.PUBLISH),
        contributionPublishAction
    )
);
import deleteAction from './middlewares/actions/delete';
bot.use(
    Telegraf.optional(genAdminPredicate(AdminPermission.PUBLISH), deleteAction)
);

// Hears
import contributeHear from './middlewares/hears/contribute';
import { AdminPermission } from '~/types/Admin';
bot.use(contributeHear);

// Inline Search

import inlineSearch from './middlewares/inline';
import logger from '~/utils/logger';
bot.use(inlineSearch);

// Setup my commands

bot.telegram.setMyCommands([
    {
        command: 'random',
        description: '随机获取一张图片'
    },
    {
        command: 'info',
        description: '获取作品原图以及作品信息'
    },
    {
        command: 'push',
        description: '[管理员]发布作品到频道与网站'
    },
    {
        command: 'tag',
        description: '[管理员]修改指定作品的标签'
    },
    {
        command: 'update',
        description: '[管理员]更新作品信息'
    },
    {
        command: 'delete',
        description: '[管理员]删除作品'
    },
    {
        command: 'grant',
        description: '[管理员]授予某用户权限'
    },
    {
        command: 'ungrant',
        description: '[管理员]撤销某用户的权限'
    },
    {
        command: 'help',
        description: '获取命令使用帮助'
    },
    {
        command: 'version',
        description: '获取Bot版本号'
    }
]);

export default bot;
