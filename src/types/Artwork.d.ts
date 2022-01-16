type ArtworkSourceType = "pixiv" | "twitter" | "danbooru"

export type ArtworkSource = {
    type: ArtworkSourceType
    post_url: string
    picture_index: number
}

export type ArtworkTag = {
    _id: string
    name: string
}

export type ImageSize = {
    width: number
    height: number
}

export type Artwork = {
    index: number
    quality: boolean
    title?: string
    desc?: string
    file_name: string
    img_thumb: string
    size: ImageSize
    tags: Array<ArtworkTag>
    source: ArtworkSource
    create_time?: Date
}
export type ArtworkInfo = {
    source_type: ArtworkSourceType
    post_url: string
    title?: string
    desc?: string
    url_thumb: string
    url_origin: string
    size: ImageSize
}

export interface getArtworkInfoInterface { 
    (post_url: string, picture_index: number): Promise<ArtworkInfo> 
}