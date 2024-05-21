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
import {
    findOrInsertArtist,
    getArtistById
} from '~/database/operations/artist';
import { Photo } from '~/types/Photo';
import {
    insertPhotos,
    removePhotoByArtworkIndex
} from '~/database/operations/photo';

// @ErrCatch 不会用，暂时不用了
export async function publishArtwork(
    artworkInfo: ArtworkInfo,
    publish_event: PublishEvent
): Promise<ExecResult> {
    global.currentMongoSession = await Mongoose.startSession();
    global.currentMongoSession.startTransaction();

    // 下载文件
    const thumb_files = await Promise.all(
        artworkInfo.photos.map(async photo => {
            const file_name = await downloadFile(
                photo.url_thumb,
                path.basename(new URL(photo.url_thumb).pathname)
            );
            return file_name;
        })
    );
    // 判断是否有文件ID传入
    const origin_files = await Promise.all(
        artworkInfo.photos.map(async photo => {
            const file_name = await downloadFile(
                photo.url_origin,
                publish_event.origin_file_name
                    ? publish_event.origin_file_name
                    : path.basename(new URL(photo.url_origin).pathname)
            );
            return file_name;
        })
    );

    // 上传到OSS和OneDrive
    // await uploadOSS(file_name_thumb)
    await Promise.all(
        thumb_files.map(async file_name => {
            await uploadFileB2(file_name);
        })
    );

    await Promise.all(
        origin_files.map(async file_name => {
            await uploadOneDrive(file_name);
        })
    );

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
        quality: publish_event.is_quality,
        title: artworkInfo.title,
        desc: artworkInfo.desc,
        tags: tags,
        source: {
            type: artworkInfo.source_type,
            post_url: artworkInfo.post_url,
            picture_index: publish_event.picture_index
        },
        artist_id: artist.id,

        // @deprecated, @TODO should be removed in the future version
        file_name: origin_files[0],
        size: artworkInfo.photos[0].size
    });

    const push_event: PushEvent = {
        thumb_files,
        origin_files,
        contribution: publish_event.contribution,
        origin_file_modified: publish_event.origin_file_modified
    };
    // 推送作品到频道
    const pushMessages = await pushArtwork(artworkInfo, artwork, push_event);
    // 将频道的消息存入数据库

    await insertMessages([...pushMessages.photos, ...pushMessages.documents]);

    const photos: Photo[] = artworkInfo.photos.map((photo, index) => ({
        artwork_id: artwork._id,
        artwork_index: artwork.index,
        size: photo.size,
        file_name: origin_files[index],
        thumb_file_id: pushMessages.photos[index].file_id,
        document_file_id: pushMessages.documents[index].file_id,
        thumb_message_id: pushMessages.photos[index].message_id,
        document_message_id: pushMessages.documents[index].message_id,
        create_time: new Date()
    }));

    await insertPhotos(photos);

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
    const artist = await getArtistById(artwork.artist_id.toString());

    await bot.telegram.editMessageCaption(
        config.PUSH_CHANNEL,
        photo_message.message_id,
        undefined,
        artworkCaption(artwork, artist),
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

    await removePhotoByArtworkIndex(artwork_index);

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
