import { Message } from 'telegraf/typings/core/types/typegram';
import { wrapCommand } from '~/bot/wrappers/command-wrapper';
import { insertFile } from '~/database/operations/file';
import { File } from '~/types/File';

export default wrapCommand('file', async ctx => {
    const documet_message = ctx.reply_to_message as Message.DocumentMessage;
    if (!documet_message?.document)
        return ctx.directlyReply('请回复一个文件消息！');
    if (!ctx.command.target) return ctx.directlyReply('请指定一个文件名称！');
    const file_name = ctx.command.target;
    const regex = /^[a-zA-Z0-9_]+$/;
    if (!regex.test(file_name))
        return ctx.directlyReply('文件名称只能包含字母、数字和下划线！');
    const file: File = {
        name: file_name,
        file_id: documet_message.document.file_id,
        description: ctx.command.params['desc'],
        create_time: new Date()
    };

    await insertFile(file);
    return ctx.resolveWait(
        `文件成功添加到数据库~\n链接：https://t.me/${ctx.me}?start=file-${file.name}`
    );
});
