import ArtworkModel from '~/database/models/ArtworkModel';
import {
    Artwork,
    ArtworkSource,
    ArtworkWithFileId,
    ArtworkWithMessages
} from '~/types/Artwork';
import { ChannelMessage } from '~/types/Message';
import { getConfig, setConfig } from './config';
import { Config } from '~/types/Config';

interface ArtworkAggregate {
    index: number;
    title: string;
    source: ArtworkSource;
    messages: ChannelMessage[];
}

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
): Promise<ArtworkWithMessages[]> {
    const results = await ArtworkModel.aggregate<ArtworkAggregate>([
        {
            $lookup: {
                from: 'messages',
                localField: 'index',
                foreignField: 'artwork_index',
                as: 'messages'
            }
        },
        {
            $project: {
                index: 1,
                title: 1,
                source: 1,
                'messages.type': 1,
                'messages.file_id': 1,
                'messages.message_id': 1
            }
        },
        {
            $sample: {
                size: limit
            }
        }
    ]);

    const artworks: ArtworkWithMessages[] = results.map(result => {
        const photo_message = result.messages.filter(
            message => message.type === 'photo'
        )[0] as ChannelMessage<'photo'>;

        const document_message = result.messages.filter(
            message => message.type === 'document'
        )[0] as ChannelMessage<'document'>;

        return {
            index: result.index,
            source: result.source,
            title: result.title,
            photo_message,
            document_message
        };
    });

    return artworks;
}

export async function getArtworksByTags(
    tags: string[]
): Promise<ArtworkWithMessages[]> {
    const results = await ArtworkModel.aggregate<ArtworkAggregate>([
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
                as: 'messages'
            }
        },
        {
            $project: {
                index: 1,
                title: 1,
                source: 1,
                'messages.type': 1,
                'messages.file_id': 1,
                'messages.message_id': 1
            }
        },
        {
            $sample: {
                size: 20
            }
        }
    ]);

    const artworks: ArtworkWithMessages[] = results.map(result => {
        const photo_message = result.messages.filter(
            message => message.type === 'photo'
        )[0] as ChannelMessage<'photo'>;

        const document_message = result.messages.filter(
            message => message.type === 'document'
        )[0] as ChannelMessage<'document'>;

        return {
            index: result.index,
            source: result.source,
            title: result.title,
            photo_message,
            document_message
        };
    });

    return artworks;
}
