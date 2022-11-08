import { File } from '~/types/File';
import FileModel from '../models/FileModel';

export async function getFileByName(name: string): Promise<File> {
    const file = await FileModel.findOne({
        name: name
    });

    if (!file) throw new Error('指定的文件不存在！');

    return file;
}

export async function insertFile(file: File): Promise<void> {
    const existFile = await FileModel.findOne({
        name: file.name
    });

    if (existFile) throw new Error('该文件名已被占用。');

    const doc = new FileModel(file);
    await doc.save();
}
