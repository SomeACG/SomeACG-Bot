import Router from 'koa-router';
import { getArtworkImgLink } from '../functions/preview';

const rootRouter = new Router();

export default rootRouter.get(
    /^(\/origin)?\/(((ht|f)tps?):\/\/)?([^!@#$%^&*?.\s-]([^!@#$%^&*?.\s]{0,63}[^!@#$%^&*?.\s])?\.)+[a-z]{2,6}\/?/,
    async ctx => {
        let target = ctx.url.slice(1);
        let original = false;

        if (target.startsWith('origin/')) {
            target = target.slice(7);
            original = true;
        }

        try {
            const img_link = await getArtworkImgLink(target, original);

            ctx.redirect(img_link.replace('i.pximg.net', 'i.pixiv.cat'));
        } catch (err) {
            ctx.body = {
                code: 400,
                message: 'Bad Request: ' + err
            };
        }
    }
);
