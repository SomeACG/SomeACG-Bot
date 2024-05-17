import config from '~/config';
import { AsyncPredicate } from 'telegraf/typings/composer';
import { Context, Telegraf } from 'telegraf';
import { AdminPermission } from '~/types/Admin';
import { hasPermisson } from '~/database/operations/admin';

export function genAdminPredicate(
    permisson?: AdminPermission
): AsyncPredicate<Context> {
    return async function (ctx: Context): Promise<boolean> {
        if (!ctx.from) return false;
        if (config.ADMIN_LIST.includes(ctx.from?.id.toString())) return true;
        if (!permisson) return false;
        const has_permisson = await hasPermisson(ctx.from.id, permisson);
        if (!has_permisson && ctx.callbackQuery) {
            ctx.answerCbQuery('你没有权限执行此操作');
        }
        return has_permisson;
    };
}

const adminPredicate: AsyncPredicate<Context> = async function (
    ctx: Context
): Promise<boolean> {
    if (ctx.from && config.ADMIN_LIST.includes(ctx.from?.id.toString()))
        return true;
    // else { if(!flag) await showNonAdminHint(ctx) }
    if (ctx.callbackQuery) {
        ctx.answerCbQuery('此操作仅限管理员使用');
    }
    return false;
};

const NonAdminHandler = Telegraf.fork(async ctx => {
    if (ctx.callbackQuery) {
        ctx.answerCbQuery('此操作仅限管理员使用');
    }
    if (ctx.message) {
        ctx.reply('此命令仅限管理员使用', {
            reply_parameters: {
                message_id: ctx.message.message_id,
                allow_sending_without_reply: true
            }
        });
    }
});

export { adminPredicate, NonAdminHandler };
