import { ParameterizedContext } from "koa"
import Router from "koa-router"

const webhookRouter = new Router()

export default webhookRouter.all('/webhook', async (ctx:ParameterizedContext) => {
    ctx.body = {
        code: 400,
        message: '功能尚在开发中...'
    }
})