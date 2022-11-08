import path from 'path'
import bot from '~/bot'
import config from '~/config'
import { Artwork } from '~/types/Artwork'
import { PushEvent } from '~/types/Event'
import { ChannelMessage } from '~/types/Message'

function encodeHtmlChars(text: string) {
    return text.replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

export function genCaption(artwork: Artwork, event_info?: PushEvent): string {

    // Replace special chars
    artwork.title = encodeHtmlChars(artwork.title)
    // artwork.desc = encodeHtmlChars(artwork.desc)

    let caption = ""
    if (artwork.quality) caption += "#精选\n"
    if (artwork.title) caption += `<b>作品标题:</b> ${artwork.title}\n`
    if (artwork.desc) caption += `<b>作品描述:</b> <pre>${artwork.desc}</pre>\n\n`
    caption += `\n来源: ${artwork.source.post_url}\n`
    if (event_info?.contribution) caption += `投稿 by <a href="tg://user?id=${event_info.contribution.user_id}">${event_info.contribution.user_name}</a>\n`

    for (let tag of artwork.tags) {
        caption += `#${tag.name} `
    }

    return caption
}

export async function pushArtwork(artwork: Artwork, event_info: PushEvent): Promise<ChannelMessage[]> {

    let artworkCaption = genCaption(artwork, event_info)

    console.log('Caption: ' + artworkCaption);


    let sendPhotoMessage = await bot.telegram.sendPhoto(config.PUSH_CHANNEL, {
        source: path.resolve(config.TEMP_DIR, event_info.file_thumb_name)
    }, {
        caption: artworkCaption,
        parse_mode: "HTML"
    })

    let sendDocumentMessage = await bot.telegram.sendDocument(config.PUSH_CHANNEL, {
        source: path.resolve(config.TEMP_DIR, artwork.file_name)
    }, {
        caption: event_info.origin_file_modified ? "* <i>此原图经过处理</i>" : undefined,
        parse_mode: 'HTML'
    })

    let photoMessage: ChannelMessage = {
        type: "photo",
        message_id: sendPhotoMessage.message_id,
        artwork_index: artwork.index,
        file_id: sendPhotoMessage.photo[0].file_id,
        // send_time: new Date(sendPhotoMessage.date * 1000)
    }

    let documentMessage: ChannelMessage = {
        type: "document",
        message_id: sendDocumentMessage.message_id,
        artwork_index: artwork.index,
        file_id: sendDocumentMessage.document.file_id,
        // send_time: new Date(sendDocumentMessage.date * 1000)
    }

    return [photoMessage, documentMessage]
}