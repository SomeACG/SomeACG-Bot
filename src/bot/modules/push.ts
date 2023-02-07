import path from 'path';
import bot from '~/bot';
import config from '~/config';
import { Artist, Artwork } from '~/types/Artwork';
import { PushEvent } from '~/types/Event';
import { ChannelMessage } from '~/types/Message';
import { artworkCaption } from '~/utils/caption';

export async function pushArtwork(
    artwork: Artwork,
    event_info: PushEvent,
    artist?: Artist
): Promise<ChannelMessage[]> {
    const caption = artworkCaption(artwork, event_info, artist);

    const sendPhotoMessage = await bot.telegram.sendPhoto(
        config.PUSH_CHANNEL,
        {
            source: path.resolve(config.TEMP_DIR, event_info.file_thumb_name)
        },
        {
            caption,
            parse_mode: 'HTML'
        }
    );

    const sendDocumentMessage = await bot.telegram.sendDocument(
        config.PUSH_CHANNEL,
        {
            source: path.resolve(config.TEMP_DIR, artwork.file_name)
        },
        {
            caption: event_info.origin_file_modified
                ? '* <i>此原图经过处理</i>'
                : undefined,
            parse_mode: 'HTML'
        }
    );

    const photoMessage: ChannelMessage = {
        type: 'photo',
        message_id: sendPhotoMessage.message_id,
        artwork_index: artwork.index,
        file_id: sendPhotoMessage.photo[0].file_id
        // send_time: new Date(sendPhotoMessage.date * 1000)
    };

    const documentMessage: ChannelMessage = {
        type: 'document',
        message_id: sendDocumentMessage.message_id,
        artwork_index: artwork.index,
        file_id: sendDocumentMessage.document.file_id
        // send_time: new Date(sendDocumentMessage.date * 1000)
    };

    return [photoMessage, documentMessage];
}
