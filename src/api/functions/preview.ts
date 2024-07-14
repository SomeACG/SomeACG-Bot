import getArtworkInfoByUrl from '~/platforms';

export async function getArtworkImgLink(
    url: string,
    original?: boolean
): Promise<string> {
    const artworkInfo = await getArtworkInfoByUrl(url);

    if (original) {
        return artworkInfo.photos[0].url_origin;
    }

    return artworkInfo.photos[0].url_thumb;
}
