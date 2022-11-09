import pino from 'pino';

export default pino({
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: process.env.DEV_MODE
        }
    },
    level: process.env.LOG_LEVEL || 'info'
});
