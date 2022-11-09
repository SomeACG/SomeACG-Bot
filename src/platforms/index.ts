import { ArtworkInfo } from '~/types/Artwork';

export default async function getArtworkInfoByUrl(
    url: string,
    picture_index?: number
): Promise<ArtworkInfo> {
    const matchPixiv = url.match(
        /https:\/\/www.pixiv.net(\/en)?\/artworks\/(\d{1,9})(\/)?/
    );
    const matchTwitter = url.match(
        /https:\/\/twitter.com\/(.+)\/status\/(\d+)/
    );
    const matchDanbooru = url.match(
        /https:\/\/danbooru.donmai.us\/posts\/(\d+)/
    );

    if (!picture_index) picture_index = 0;

    let module: {
        default: (url: string, picture_index: number) => Promise<ArtworkInfo>;
    };

    if (matchPixiv) {
        module = await import('~/platforms/pixiv');
        url = matchPixiv[0];
    }
    if (matchTwitter) {
        module = await import('~/platforms/twitter');
        url = matchTwitter[0];
    }
    if (matchDanbooru) {
        module = await import('~/platforms/danbooru');
        url = matchDanbooru[0];
    }

    if (!module)
        throw new Error(
            '不支持的链接类型, 目前仅仅支持 Pixiv,Twitter,Danbooru'
        );

    return await module.default(url, picture_index);
}
