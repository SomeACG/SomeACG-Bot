import config from '~/config';
import {
    Artist,
    Artwork,
    ArtworkInfo,
    ArtworkWithMessages
} from '~/types/Artwork';
import { PushEvent } from '~/types/Event';

const MAX_CAPTION_LENGTH = 1024;

function encodeHtmlChars(text: string) {
    return text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function replaceHtmlTags(text: string) {
    return text.replace(/<br(\s)?(\/)?>/g, '\n');
}
/**
 * Cut off description text and remove unclosed tags
 *
 * @param {string} text The text should escaped the </br> tag
 * @param {number} length
 * @return {*}
 */
function cutDescription(description: string, totalLength: number) {
    const unclosedTagRegex = /<([a-zA-Z]+)(?:(?!<\/\1>).)*$/g;

    const expect_slice =
        MAX_CAPTION_LENGTH - totalLength + description.length - 3;

    let desc_cut = description.slice(0, expect_slice);

    desc_cut = desc_cut.replace(unclosedTagRegex, '');

    if (desc_cut[desc_cut.length - 1] === '<') {
        desc_cut = desc_cut.slice(0, desc_cut.length - 1);
    }

    return desc_cut + '...';
}

function genArtistUrl(artist: Artist) {
    switch (artist.type) {
        case 'pixiv':
            return 'https://www.pixiv.net/users/' + artist.uid;
        case 'twitter':
            return 'https://twitter.com/' + artist.username;
        case 'danbooru':
            return 'https://danbooru.donmai.us/artists/' + artist.id;
        case 'bilibili':
            return 'https://space.bilibili.com/' + artist.uid + '/dynamic';
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
    if (artwork.title)
        caption += `<b>${encodeHtmlChars(artwork.title)}</b> \n\n`;

    caption += `来源: ${artwork.source.post_url}\n`;
    caption += `画师: `;
    caption += `<a href="${genArtistUrl(artist)}">${artist.name}</a>\n`;
    if (event_info?.contribution)
        caption += `投稿 by <a href="tg://user?id=${event_info.contribution.user_id}">${event_info.contribution.user_name}</a>\n`;

    if (artwork.desc)
        caption += `\n<blockquote expandable>${replaceHtmlTags(
            artwork.desc
        )}</blockquote>\n`;

    caption += '\n';

    if (artwork.quality) caption += '#精选 ';

    for (const tag of artwork.tags) {
        caption += `#${tag.name} `;
    }

    // When the caption length is longer than 1024, cut off the description
    if (caption.length > MAX_CAPTION_LENGTH) {
        artwork.desc = cutDescription(
            replaceHtmlTags(artwork.desc),
            caption.length
        );
        caption = artworkCaption(artwork, artist, event_info);
    }

    return caption;
}

export function infoCmdCaption(artwork_info: ArtworkInfo) {
    let caption = '图片下载成功!\n\n';
    if (artwork_info.title)
        caption += `<b>${encodeHtmlChars(artwork_info.title)}</b>\n`;
    if (artwork_info.artist) {
        caption += `画师: `;
        caption += `<a href="${genArtistUrl(artwork_info.artist)}">${
            artwork_info.artist.name
        }</a>\n`;
    }
    caption += `尺寸: `;

    caption += artwork_info.photos
        .map(photo => `${photo.size.width}x${photo.size.height}`)
        .join('/');
    if (artwork_info.desc)
        caption += `<blockquote expandable>${replaceHtmlTags(
            artwork_info.desc
        )}</blockquote>\n`;
    if (artwork_info.raw_tags && artwork_info.raw_tags.length > 0) {
        caption += '\n';
        caption += '<blockquote expandable>';
        caption += artwork_info.raw_tags.map(str => `#${str}`).join(' ');
        caption += '</blockquote>';
    }

    // When the caption length is longer than 1024, cut off the description
    if (caption.length > MAX_CAPTION_LENGTH) {
        artwork_info.desc = cutDescription(
            replaceHtmlTags(artwork_info.desc),
            caption.length
        );
        caption = infoCmdCaption(artwork_info);
    }

    return caption;
}

export function contributeCaption(artwork_info: ArtworkInfo) {
    let caption = '感谢投稿 ! 正在召唤 @Revincx_Rua \n\n';
    caption += `链接: ${artwork_info.post_url}\n`;
    caption += `尺寸: ${artwork_info.photos[0].size.width}x${artwork_info.photos[0].size.height}\n\n`;
    if (artwork_info.raw_tags && artwork_info.raw_tags.length > 0) {
        caption += '<blockquote expandable>';
        caption += artwork_info.raw_tags.map(str => `#${str}`).join(' ');
        caption += '</blockquote>';
        caption += '\n';
    }

    return caption;
}

export function randomCaption(
    artwork: Artwork | ArtworkWithMessages,
    tags?: string[]
) {
    let caption = '';
    if (artwork.title && artwork.source.post_url)
        caption += `<a href="${artwork.source.post_url}">${encodeHtmlChars(
            artwork.title
        )}</a>\n\n`;

    caption += `这是你要的`;

    if (tags && tags.length > 0) {
        caption += ' ';
        caption += tags.map(str => `#${str}`).join(' ');
        caption += ' ';
    }

    caption += '壁纸~';

    return caption;
}
