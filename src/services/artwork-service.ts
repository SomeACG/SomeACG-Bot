import { Artwork, ArtworkInfo } from "~/types/Artwork"
import downloadFile from "~/utils/download"
import bot from "~/bot"
import config from "~/config"
import path from 'path'
import { ExecResult, PublishEvent, PushEvent } from "~/types/Event"
import { getTagsByNamesAndInsert } from "~/database/operations/tag"
import { genCaption, pushArtwork } from "~/bot/modules/push"
import { deleteMessagesByArtwork, getMessageByArtwork , getMessagesByArtwork, insertMessages } from "~/database/operations/message"
import { insertArtwork, updateArtwork, deleteArtwork } from '~/database/operations/artwork'
import { uploadOneDrive, uploadOSS } from "./storage/upload"

// @ErrCatch 不会用，暂时不用了
export async function publishArtwork(artworkInfo: ArtworkInfo, publish_event: PublishEvent): Promise<ExecResult> {

    try {
        // 下载文件
        let file_name_thumb = await downloadFile(artworkInfo.url_thumb, path.basename(new URL(artworkInfo.url_thumb).pathname))
        let file_name_origin
        // 判断是否有文件ID传入
        if (!publish_event.origin_file_id) { file_name_origin = await downloadFile(artworkInfo.url_origin, path.basename(new URL(artworkInfo.url_origin).pathname)) }
        else {
            let origin_file_link = await bot.telegram.getFileLink(publish_event.origin_file_id)
            file_name_origin = await downloadFile(origin_file_link.href, path.basename(new URL(origin_file_link.href).pathname))
        }
        // 上传到OSS和OneDrive
        await uploadOSS(file_name_thumb)
        await uploadOneDrive(file_name_origin)

        // 获取标签ID
        let tags = await getTagsByNamesAndInsert(publish_event.artwork_tags)
        let artwork: Artwork = {
            index: -1,
            file_name: file_name_origin,
            quality: publish_event.is_quality,
            img_thumb: path.resolve(config.THUMB_BASE, file_name_thumb),
            size: artworkInfo.size,
            title: artworkInfo.title,
            desc: artworkInfo.desc,
            tags: tags,
            source: {
                type: artworkInfo.source_type,
                post_url: artworkInfo.post_url,
                picture_index: publish_event.picture_index
            }
        }
        artwork = await insertArtwork(artwork)
        let push_event: PushEvent = {
            file_thumb_name: file_name_thumb,
            contribution: publish_event.contribution,
            origin_file_modified: publish_event.origin_file_id ? true : false
        }
        // 推送作品到频道
        let pushMessages = await pushArtwork(artwork, push_event)
        // 将频道的消息存入数据库

        await insertMessages(pushMessages)
        
        return {
            succeed: true,
            message: "作品成功发布啦~"
        }
    }
    catch (err) {
        if (err instanceof Error) {
            console.log(err.message)
            return {
                succeed: false,
                message: err.message
            }
        }
        return {
            succeed: false,
            message: "未知原因"
        }
    }

}

export async function modifyArtwork(artwork: Artwork): Promise<ExecResult> {
    try {
        let count = await updateArtwork(artwork)
        if (count < 1) {
            return {
                succeed: false,
                message: 'Artwork 数据库更新失败'
            }
        }
        let photo_message = await getMessageByArtwork(artwork.index, 'photo')
        await bot.telegram.editMessageCaption(config.PUSH_CHANNEL, photo_message.message_id, undefined, genCaption(artwork), {
            parse_mode: 'HTML'
        })
        return {
            succeed: true,
            message: '作品信息修改成功'
        }
    }
    catch (err) {
        if (err instanceof Error) {
            console.log(err.message)
            return {
                succeed: false,
                message: err.message
            }
        }
        return {
            succeed: false,
            message: "未知原因"
        }
    }
}

export async function delArtwork(artwork_index: number): Promise<ExecResult> {
    try {
        let artwork_delete_count = await deleteArtwork(artwork_index)
        if (artwork_delete_count < 1) {
            return {
                succeed: false,
                message: 'Artwork 数据库删除失败'
            }
        }
        let messages = await getMessagesByArtwork(artwork_index)
        for(let message of messages)
        {
            await bot.telegram.deleteMessage(config.PUSH_CHANNEL, message.message_id)
        }
        let message_delete_count = await deleteMessagesByArtwork(artwork_index)
        if (message_delete_count < 1) {
            return {
                succeed: false,
                message: 'Artwork 数据库删除失败'
            }
        }
        return {
            succeed: true,
            message: "作品删除成功"
        }
    }
    catch (err) {
        if (err instanceof Error) {
            console.log(err.message)
            return {
                succeed: false,
                message: err.message
            }
        }
        return {
            succeed: false,
            message: "未知原因"
        }
    }
}