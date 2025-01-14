import config from '~/config';
import server from '~/api';
import bot from '~/bot';
import logger from './utils/logger';

logger.info('SomeACG-Bot Version: ' + config.VERSION);
server.listen(config.PORT);
logger.info('Koa server started');

let launch_wait = 0;

if (process.env.BOT_LAUNCH_WAIT) {
    launch_wait = parseInt(process.env.BOT_LAUNCH_WAIT);
    logger.info('Waiting for bot launch...');
}

setTimeout(() => {
    bot.launch();
    logger.info('Bot instance launched successfully');
}, launch_wait * 1000);
