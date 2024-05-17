import config from '~/config';
import { Artist, Artwork, ArtworkInfo } from '~/types/Artwork';
import { PushEvent } from '~/types/Event';

function encodeHtmlChars(text: string) {
    return text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function genArtistUrl(artist: Artist) {
    switch (artist.type) {
        case 'pixiv':
            return 'https://www.pixiv.net/users/' + artist.uid;
        case 'twitter':
            return 'https://twitter.com/' + artist.username;
        case 'danbooru':
            return 'https://danbooru.donmai.us/artists/' + artist.id;
    }
}

export function pushChannelUrl(message_id: number) {
    const channel_username = config.PUSH_CHANNEL.slice(1);

    return `https://t.me/${channel_username}/${message_id}`;
}

export function artworkCaption(
    artwork: Artwork,
    artist: Artist,
    event_info?: PushEvent
) {
    let caption = '';
    if (artwork.quality) caption += '#精选\n';
    if (artwork.title)
        caption += `<b>作品标题:</b> ${encodeHtmlChars(artwork.title)}\n`;

    caption += `<b>画师主页:</b> `;
    caption += `<a href="${genArtistUrl(artist)}">${artist.name}</a>\n`;

    if (artwork.desc)
        caption += `<b>作品描述:</b> <code>${artwork.desc}</code>\n\n`;
    caption += `\n来源: ${artwork.source.post_url}\n`;
    if (event_info?.contribution)
        caption += `投稿 by <a href="tg://user?id=${event_info.contribution.user_id}">${event_info.contribution.user_name}</a>\n`;

    for (const tag of artwork.tags) {
        caption += `#${tag.name} `;
    }

    return caption;
}

export function infoCmdCaption(artwork_info: ArtworkInfo) {
    let caption = '图片下载成功!\n';
    if (artwork_info.title)
        caption += `<b>作品标题:</b> ${encodeHtmlChars(artwork_info.title)}\n`;
    if (artwork_info.desc)
        caption += `<b>作品描述:</b> <code>${artwork_info.desc}</code>\n`;
    if (artwork_info.artist) {
        caption += `<b>画师主页:</b> `;
        caption += `<a href="${genArtistUrl(artwork_info.artist)}">${
            artwork_info.artist.name
        }</a>\n`;
    }
    if (artwork_info.raw_tags && artwork_info.raw_tags.length > 0) {
        caption += '<b>原始标签:</b> ';
        caption += artwork_info.raw_tags.map(str => `#${str}`).join(' ');
        caption += '\n';
    }
    caption += `<b>尺寸:</b> ${artwork_info.size.width}x${artwork_info.size.height}`;

    return caption;
}

export function contributeCaption(artwork_info: ArtworkInfo) {
    let caption = '感谢投稿 ! 正在召唤 @Revincx_Rua \n';
    caption += `图片链接: ${artwork_info.post_url}\n`;
    if (artwork_info.raw_tags && artwork_info.raw_tags.length > 0) {
        caption += '原始标签: ';
        caption += artwork_info.raw_tags.map(str => `#${str}`).join(' ');
        caption += '\n';
    }
    caption += `图片尺寸: ${artwork_info.size.width}x${artwork_info.size.height}`;

    return caption;
}
