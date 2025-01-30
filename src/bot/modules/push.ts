import path from 'path';
import { Message } from 'telegraf/typings/core/types/typegram';
import bot from '~/bot';
import config from '~/config';
import { Artwork, ArtworkInfo } from '~/types/Artwork';
import { PushEvent } from '~/types/Event';
import { ChannelMessage } from '~/types/Message';
import { artworkCaption } from '~/utils/caption';

export async function pushArtwork(
    artwork_info: ArtworkInfo,
    artwork: Artwork,
    event_info: PushEvent
): Promise<{ photos: ChannelMessage[]; documents: ChannelMessage[] }> {
    const caption = artworkCaption(artwork, artwork_info.artist, event_info);

    const sendPhotoMessages = (await bot.telegram.sendMediaGroup(
        config.PUSH_CHANNEL,
        event_info.thumb_files.map(file_name => ({
            type: 'photo',
            media: {
                source: path.resolve(config.TEMP_DIR, 'thumbnails', file_name)
            },
            caption:
                file_name === event_info.thumb_files[0] ? caption : undefined,
            parse_mode: 'HTML'
        }))
    )) as Message.PhotoMessage[];

    const sendDocumentMessages = (await bot.telegram.sendMediaGroup(
        config.PUSH_CHANNEL,
        event_info.origin_files.map(file_name => ({
            type: 'document',
            media: {
                source: path.resolve(config.TEMP_DIR, file_name)
            },
            caption: event_info.origin_file_modified
                ? '* <i>此原图经过处理</i>'
                : undefined,
            parse_mode: 'HTML'
        }))
    )) as Message.DocumentMessage[];

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
