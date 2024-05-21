import { Photo } from '~/types/Photo';
import PhotoModel from '../models/PhotoModel';

export const insertPhotos = async (photos: Photo[]) => {
    return await PhotoModel.insertMany(photos, {
        session: global.currentMongoSession
    });
};

export const getPhotosByArtworkId = async (artwork_id: string) => {
    return await PhotoModel.find({ artwork_id: artwork_id });
};

export const removePhotoByArtworkId = async (artwork_id: string) => {
    return await PhotoModel.deleteMany(
        { artwork_id: artwork_id },
        {
            session: global.currentMongoSession
        }
    );
};

export const removePhotoByArtworkIndex = async (artwork_index: number) => {
    return await PhotoModel.deleteMany(
        { artwork_index: artwork_index },
        {
            session: global.currentMongoSession
        }
    );
};
