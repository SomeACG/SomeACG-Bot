import { File } from "~/types/File";
import FileModel from "../models/FileModel";

export async function getFileByName(name: string): Promise<File> {
    let file = await FileModel.findOne({
        name: name
    })

    if(!file) throw new Error('指定的文件不存在！')

    return file
}