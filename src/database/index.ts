import Mongoose from 'mongoose';
import config from '~/config';
import logger from '~/utils/logger';

Mongoose.connect(config.DB_URL, {});

Mongoose.connection.once('open', function () {
    logger.info('Database connected');
});

Mongoose.connection.once('close', function () {
    logger.info('Database disconnected');
});

export default Mongoose;
