import { Artist } from '~/types/Artwork';
import artistModel from '../models/ArtistModel';

export async function findOrInsertArtist(artist: Artist) {
    const foundArtist = await artistModel.findOne(artist);
    if (foundArtist) return foundArtist;

    const artistInstance = new artistModel(artist);
    const newArtist = await artistInstance.save();

    return newArtist;
}
