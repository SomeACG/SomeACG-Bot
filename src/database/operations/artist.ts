import { Artist } from '~/types/Artwork';
import artistModel from '../models/ArtistModel';

export async function findOrInsertArtist(artist: Artist) {
    const foundArtist = artistModel.findOne(artist);
    if (foundArtist) return foundArtist;

    const newArtist = await artistModel.create(artist);
    return newArtist;
}
