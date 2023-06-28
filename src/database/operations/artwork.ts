import ArtworkModel from '~/database/models/ArtworkModel';
import { Artwork, ArtworkWithFileId } from '~/types/Artwork';
import { getConfig, setConfig } from './config';
import { Config } from '~/types/Config';

export async function insertArtwork(artwork: Artwork): Promise<Artwork> {
    let current_count = await getConfig(Config.ARTWORK_COUNT);

    if (!current_count) {
        current_count = '0';
    }

    let current_count_number = parseInt(current_count);

    current_count_number++;

    await setConfig(Config.ARTWORK_COUNT, current_count_number.toString());

    artwork.index = current_count_number;
    const artwork_instance = new ArtworkModel(artwork);

    const document = await artwork_instance.save({
        session: global.currentMongoSession
    });

    return document;
}

export async function getArtwork(artwork_index: number): Promise<Artwork> {
    const artwork = await ArtworkModel.findOne({
        index: artwork_index
    });

    if (!artwork) throw new Error('Artwork not found');

    return artwork;
}

export async function updateArtwork(artwork: Artwork): Promise<number> {
    const result = await ArtworkModel.updateOne(
        {
            index: artwork.index
        },
        artwork
    );
    return result.modifiedCount;
}

export async function deleteArtwork(artwork_index: number): Promise<number> {
    const result = await ArtworkModel.deleteOne({
        index: artwork_index
    });

    return result.deletedCount;
}

export async function getRandomArtworks(
    limit: number
): Promise<ArtworkWithFileId[]> {
    const results = await ArtworkModel.aggregate([
        {
            $lookup: {
                from: 'messages',
                localField: 'index',
                foreignField: 'artwork_index',
                as: 'message'
            }
        },
        {
            $project: {
                index: 1,
                source: 1,
                'message.type': 1,
                'message.file_id': 1
            }
        },
        {
            $sample: {
                size: limit
            }
        }
    ]);

    const artworks: ArtworkWithFileId[] = results.map(result => ({
        index: result.index,
        source: result.source,
        photo_file_id:
            result.message[0].type === 'photo'
                ? result.message[0].file_id
                : result.message[1].file_id,
        document_file_id:
            result.message[0].type === 'document'
                ? result.message[0].file_id
                : result.message[1].file_id
    }));

    return artworks;
}

export async function getArtworksByTags(
    tags: string[]
): Promise<ArtworkWithFileId[]> {
    // let artworks = await ArtworkModel.find({
    //     $and: tags.map(tag => ({ "tags.name": tag.name }))
    // })

    const results = await ArtworkModel.aggregate([
        {
            $match: {
                $and: tags.map(tag => ({ 'tags.name': tag }))
            }
        },
        {
            $lookup: {
                from: 'messages',
                localField: 'index',
                foreignField: 'artwork_index',
                as: 'message'
            }
        },
        {
            $project: {
                index: 1,
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
    ]);

    const artworks: ArtworkWithFileId[] = results.map(result => ({
        index: result.index,
        source: result.source,
        photo_file_id:
            result.message[0].type === 'photo'
                ? result.message[0].file_id
                : result.message[1].file_id,
        document_file_id:
            result.message[0].type === 'document'
                ? result.message[0].file_id
                : result.message[1].file_id
    }));

    return artworks;
}
