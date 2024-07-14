import Koa from 'koa';
import BodyParser from 'koa-bodyparser';

import webhookRouter from './routers/webhook';
import rootRouter from './routers/root';

const server = new Koa();

server.use(BodyParser());

server.use(rootRouter.routes());
server.use(webhookRouter.routes());

export default server;
