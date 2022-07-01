import ArtworkModel from "~/database/models/ArtworkModel"
import { Artwork, ArtworkTag, ArtworkWithFileId } from "~/types/Artwork"

export async function insertArtwork(artwork: Artwork): Promise<Artwork> {
    let artwork_instance = new ArtworkModel(artwork)

    let document = await artwork_instance.save()

    return document
}

export async function getArtwork(artwork_index: number): Promise<Artwork> {
    let artwork = await ArtworkModel.findOne({
        index: artwork_index
    })

    if (!artwork) throw new Error('Artwork not found')

    return artwork
}

export async function updateArtwork(artwork: Artwork): Promise<number> {
    let result = await ArtworkModel.updateOne({
        index: artwork.index
    }, artwork)
    return result.modifiedCount
}

export async function deleteArtwork(artwork_index: number): Promise<number> {
    let result = await ArtworkModel.deleteOne({
        index: artwork_index
    })

    return result.deletedCount
}

export async function getRandomArtworks(limit: number): Promise<ArtworkWithFileId[]> {
    let results = await ArtworkModel.aggregate([
        {
            $lookup: {
                from: "messages",
                localField: "index",
                foreignField: "artwork_index",
                as: "message"
            }
        },
        {
            $project: {
                'index': 1,
                'source': 1,
                'message.type': 1,
                'message.file_id': 1
            }
        },
        {
            $sample: {
                size: limit
            }
        }
    ])


    let artworks: ArtworkWithFileId[] = results.map(result => ({
        index: result.index,
        source: result.source,
        photo_file_id: result.message[0].type === 'photo' ? result.message[0].file_id : result.message[1].file_id,
        document_file_id: result.message[0].type === 'document' ? result.message[0].file_id : result.message[1].file_id
    }))

    return artworks
}

export async function getArtworksByTags(tags: string[]): Promise<ArtworkWithFileId[]> {
    // let artworks = await ArtworkModel.find({
    //     $and: tags.map(tag => ({ "tags.name": tag.name }))
    // })

    let results = await ArtworkModel.aggregate([
        {
            $match: {
                $and: tags.map(tag => ({ "tags.name": tag }))
            }
        },
        {
            $lookup: {
                from: "messages",
                localField: "index",
                foreignField: "artwork_index",
                as: "message"
            }
        },
        {
            $project: {
                'index': 1,
                'source.post_url': 1,
                'message.type': 1,
                'message.file_id': 1
            }
        },
        {
            $sample: {
                size: 20
            }
        }
    ])

    let artworks: ArtworkWithFileId[] = results.map(result => ({
        index: result.index,
        source: result.source,
        photo_file_id: result.message[0].type === 'photo' ? result.message[0].file_id : result.message[1].file_id,
        document_file_id: result.message[0].type === 'document' ? result.message[0].file_id : result.message[1].file_id
    }))

    return artworks
}