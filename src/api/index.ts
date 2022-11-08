import Koa from 'koa';
import BodyParser from 'koa-bodyparser';

import webhookRouter from './routers/webhook';

const server = new Koa();

server.use(BodyParser());

server.use(webhookRouter.routes());

export default server;
