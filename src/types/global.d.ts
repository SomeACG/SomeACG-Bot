import { ClientSession } from 'mongoose';

declare global {
    // eslint-disable-next-line no-var
    var currentMongoSession: ClientSession | undefined;
}
