import config from '~/config';
import server from '~/api';
import bot from '~/bot';
import logger from './utils/logger';

bot.launch();
logger.info('Bot instance launched successfully.');

server.listen(config.PORT);
logger.info('Koa server started.');
