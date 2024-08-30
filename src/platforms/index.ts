import { ArtworkInfo } from '~/types/Artwork';

export default async function getArtworkInfoByUrl(
    url: string,
    indexes?: number[]
): Promise<ArtworkInfo> {
    const matchPixiv = url.match(
        /(https:\/\/)?(www.)?pixiv.net(\/en)?\/(artworks|i)\/(\d{1,9})(\/)?/
    );
    const matchTwitter = url.match(
        /(https:\/\/)?(vx|fx|fixup)?(twitter|x|twittpr).com\/(.+)\/status\/(\d+)/
    );
    const matchDanbooru = url.match(
        /(https:\/\/)?danbooru.donmai.us\/(posts|post\/show)\/(\d+)/
    );
    const matchBiliDynamic = url.match(
        /(https:\/\/)?((t.|m.|www.)?bilibili.com(\/opus)?\/(\d+))/
    );

    if (!indexes) indexes = [0];

    let module: {
        default: (url: string, indexes: number[]) => Promise<ArtworkInfo>;
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
    if (matchBiliDynamic) {
        module = await import('~/platforms/bilibili');
        url = matchBiliDynamic[0];
    }

    if (!module)
        throw new Error(
            '不支持的链接类型, 目前仅仅支持 Pixiv,Twitter,Danbooru, Bilibili 动态'
        );

    return await module.default(url, indexes);
}
