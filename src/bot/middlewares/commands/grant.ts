import { wrapCommand } from '~/bot/wrappers/command-wrapper';
import { grantPermissons } from '~/database/operations/admin';
import { AdminPermission } from '~/types/Admin';

export default wrapCommand('grant', async ctx => {
    if (!ctx.reply_to_message?.from)
        return await ctx.directlyReply(
            '命令语法不正确，请回复一条其他用户的消息!'
        );
    if (!ctx.command.target)
        return await ctx.directlyReply('命令语法不正确，请指定要授予的权限!');
    const user_id = ctx.reply_to_message.from.id;
    const str_array =
        ctx.command.target.search(',') == -1
            ? [ctx.command.target]
            : ctx.command.target.split(',');
    const permissons: Array<AdminPermission> = [];
    for (const str of str_array) {
        const permisson = str.toUpperCase() as AdminPermission;
        permissons.push(permisson);
    }
    const succeed = await grantPermissons({
        user_id: user_id,
        grant_by: ctx.message.from.id,
        permissions: permissons
    });
    if (succeed)
        return await ctx.directlyReply(
            `成功将 ${permissons.toString()} 权限授予用户 <a href="tg://user?id=${user_id}">${
                ctx.reply_to_message.from.id
            }</a>`,
            'HTML'
        );
    return await ctx.resolveWait('权限修改失败');
});

// export default Telegraf.command('grant', async ctx => {
//     let command = parseParams(ctx.message.text)
//     if (!command.params['user'] && !ctx.message.reply_to_message) {
//         return await ctx.reply('命令语法不正确，请回复一条消息或授予权限的用户ID!', {
//             reply_to_message_id: ctx.message.message_id
//         })
//     }
//     if (!ctx.message.reply_to_message?.from) return await ctx.reply('命令语法不正确，请回复一条用户发送的消息!', {
//         reply_to_message_id: ctx.message.message_id
//     })
//     if (!command.target) return await ctx.reply('命令语法不正确，请指定要授予的权限!', {
//         reply_to_message_id: ctx.message.message_id
//     })
//     let user_id = -1
//     if (command.params['user']) user_id = parseInt(command.params['user'])
//     if (ctx.message.reply_to_message) user_id = ctx.message.reply_to_message.from.id
//     let array = command.target.search(',') == -1 ? [command.target] : command.target.split(',')
//     let permissons: Array<AdminPermission> = []

//     for (let str of array) {
//         let permisson = str.toUpperCase() as AdminPermission
//         permissons.push(permisson)
//     }

//     try {
//         let succeed = await grantPermissons({
//             user_id: user_id,
//             grant_by: ctx.message.from.id,
//             permissions: permissons
//         })
//         if (succeed) return ctx.reply('成功将 ' + permissons.toString() + ' 权限授予用户 ' + user_id, {
//             reply_to_message_id: ctx.message.message_id
//         })
//         return ctx.reply('权限修改失败', {
//             reply_to_message_id: ctx.message.message_id
//         })
//     }
//     catch (err) {
//         console.log(err)
//         if (err instanceof Error) {
//             return await ctx.reply('操作失败: ' + err.message, {
//                 reply_to_message_id: ctx.message.message_id
//             })
//         }
//         return await ctx.reply('操作失败: 未知错误', {
//             reply_to_message_id: ctx.message.message_id
//         })
//     }
// })
