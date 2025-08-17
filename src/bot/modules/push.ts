import path from 'path';
import { Message } from 'telegraf/typings/core/types/typegram';
import bot from '~/bot';
import config from '~/config';
import { Artwork, ArtworkInfo } from '~/types/Artwork';
import { PushEvent } from '~/types/Event';
import { ChannelMessage } from '~/types/Message';
import { artworkCaption } from '~/utils/caption';
import { resizeFitChannelPhoto } from '~/utils/sharp';

export async function pushArtwork(
    artwork_info: ArtworkInfo,
    artwork: Artwork,
    event_info: PushEvent
): Promise<{ photos: ChannelMessage[]; documents: ChannelMessage[] }> {
    const caption = artworkCaption(artwork, artwork_info.artist, event_info);

    const thumb_file_paths = event_info.thumb_files.map(file_name =>
        path.resolve(config.TEMP_DIR, 'thumbnails', file_name)
    );

    const origin_file_paths = event_info.origin_files.map(file_name =>
        path.resolve(config.TEMP_DIR, file_name)
    );

    const resized_channel_photos = await Promise.all(
        origin_file_paths.map(async (file_path, index) => {
            return await resizeFitChannelPhoto(
                file_path,
                thumb_file_paths[index]
            );
        })
    );

    const sendPhotoMessages = (await bot.telegram.sendMediaGroup(
        config.PUSH_CHANNEL,
        resized_channel_photos.map((file_path, index) => ({
            type: 'photo',
            media: {
                source: file_path
            },
            caption: index === 0 ? caption : undefined,
            parse_mode: 'HTML'
        }))
    )) as Message.PhotoMessage[];

    const sendDocumentMessages: Message.DocumentMessage[] = [];

    if (event_info.origin_file_modified && event_info.origin_file_id) {
        const message = await bot.telegram.sendDocument(
            config.PUSH_CHANNEL,
            event_info.origin_file_id,
            {
                caption: event_info.origin_file_modified
                    ? '* <i>此原图经过处理</i>'
                    : undefined,
                parse_mode: 'HTML'
            }
        );

        sendDocumentMessages.push(message);
    } else {
        const messages = await bot.telegram.sendMediaGroup(
            config.PUSH_CHANNEL,
            origin_file_paths.map(origin_file_path => ({
                type: 'document',
                media: {
                    source: origin_file_path
                },
                parse_mode: 'HTML'
            }))
        );

        sendDocumentMessages.push(...(messages as Message.DocumentMessage[]));
    }

    const photoMessages: ChannelMessage[] = sendPhotoMessages.map(msg => ({
        type: 'photo',
        message_id: msg.message_id,
        artwork_index: artwork.index,
        file_id: msg.photo[0].file_id
        // send_time: new Date(msg.date * 1000)
    }));

    const documentMessages: ChannelMessage[] = sendDocumentMessages.map(
        msg => ({
            type: 'document',
            message_id: msg.message_id,
            artwork_index: artwork.index,
            file_id: msg.document.file_id
            // send_time: new Date(msg.date * 1000)
        })
    );

    return {
        photos: photoMessages,
        documents: documentMessages
    };
}
