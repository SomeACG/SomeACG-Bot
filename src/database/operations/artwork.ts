import ArtworkModel from "~/database/models/ArtworkModel"
import { Artwork } from "~/types/Artwork"

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