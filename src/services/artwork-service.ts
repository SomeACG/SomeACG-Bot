import { Artist, Artwork, ArtworkInfo } from '~/types/Artwork';
import downloadFile from '~/utils/download';
import bot from '~/bot';
import config from '~/config';
import path from 'path';
import { ExecResult, PublishEvent, PushEvent } from '~/types/Event';
import { getTagsByNamesAndInsert } from '~/database/operations/tag';
import { pushArtwork } from '~/bot/modules/push';
import {
    deleteMessagesByArtwork,
    getMessageByArtwork,
    getMessagesByArtwork,
    insertMessages
} from '~/database/operations/message';
import {
    insertArtwork,
    updateArtwork,
    deleteArtwork
} from '~/database/operations/artwork';
import { uploadOneDrive } from './storage/upload';
import { uploadFileB2 } from './storage/blackblaze';
import { artworkCaption } from '~/utils/caption';
import Mongoose from '~/database';
import { findOrInsertArtist } from '~/database/operations/artist';

// @ErrCatch 不会用，暂时不用了
export async function publishArtwork(
    artworkInfo: ArtworkInfo,
    publish_event: PublishEvent
): Promise<ExecResult> {
    global.currentMongoSession = await Mongoose.startSession();
    global.currentMongoSession.startTransaction();

    // 下载文件
    const file_name_thumb = await downloadFile(
        artworkInfo.url_thumb,
        'thumb-' + path.basename(new URL(artworkInfo.url_thumb).pathname)
    );
    let file_name_origin;
    // 判断是否有文件ID传入
    if (!publish_event.origin_file_id) {
        file_name_origin = await downloadFile(
            artworkInfo.url_origin,
            path.basename(new URL(artworkInfo.url_origin).pathname)
        );
    } else {
        const origin_file_link = await bot.telegram.getFileLink(
            publish_event.origin_file_id
        );
        file_name_origin = await downloadFile(
            origin_file_link.href,
            path.basename(new URL(artworkInfo.url_origin).pathname)
        );
    }
    // 上传到OSS和OneDrive
    // await uploadOSS(file_name_thumb)
    await uploadFileB2(file_name_thumb);
    await uploadOneDrive(file_name_origin);

    // 获取标签ID
    const tags = await getTagsByNamesAndInsert(publish_event.artwork_tags);

    let artist: Artist;

    if (artworkInfo.artist) {
        artist = await findOrInsertArtist({
            type: artworkInfo.source_type,
            uid: artworkInfo.artist.uid,
            name: artworkInfo.artist.name,
            username: artworkInfo.artist.username
        });
    }

    const artwork = await insertArtwork({
        index: -1,
        file_name: file_name_origin,
        quality: publish_event.is_quality,
        img_thumb: file_name_thumb,
        size: artworkInfo.size,
        title: artworkInfo.title,
        desc: artworkInfo.desc,
        tags: tags,
        source: {
            type: artworkInfo.source_type,
            post_url: artworkInfo.post_url,
            picture_index: publish_event.picture_index
        },
        artist_id: artist.id
    });

    const push_event: PushEvent = {
        file_thumb_name: file_name_thumb,
        contribution: publish_event.contribution,
        origin_file_modified: publish_event.origin_file_id ? true : false,
        artist: artworkInfo.artist
    };
    // 推送作品到频道
    const pushMessages = await pushArtwork(artwork, push_event);
    // 将频道的消息存入数据库

    await insertMessages(pushMessages);

    return {
        succeed: true,
        message: '作品成功发布啦~'
    };
}

export async function modifyArtwork(artwork: Artwork): Promise<ExecResult> {
    global.currentMongoSession = await Mongoose.startSession();
    global.currentMongoSession.startTransaction();

    const count = await updateArtwork(artwork);
    if (count < 1) {
        return {
            succeed: false,
            message: 'Artwork 数据库更新失败'
        };
    }
    const photo_message = await getMessageByArtwork(artwork.index, 'photo');

    await bot.telegram.editMessageCaption(
        config.PUSH_CHANNEL,
        photo_message.message_id,
        undefined,
        artworkCaption(artwork),
        {
            parse_mode: 'HTML'
        }
    );
    return {
        succeed: true,
        message: '作品信息修改成功'
    };
}

export async function delArtwork(artwork_index: number): Promise<ExecResult> {
    global.currentMongoSession = await Mongoose.startSession();
    global.currentMongoSession.startTransaction();

    const artwork_delete_count = await deleteArtwork(artwork_index);
    if (artwork_delete_count < 1) {
        return {
            succeed: false,
            message: 'Artwork 数据库删除失败'
        };
    }
    const messages = await getMessagesByArtwork(artwork_index);
    for (const message of messages) {
        await bot.telegram.deleteMessage(
            config.PUSH_CHANNEL,
            message.message_id
        );
    }
    const message_delete_count = await deleteMessagesByArtwork(artwork_index);
    if (message_delete_count < 1) {
        return {
            succeed: false,
            message: 'Artwork 数据库删除失败'
        };
    }
    return {
        succeed: true,
        message: '作品删除成功'
    };
}
