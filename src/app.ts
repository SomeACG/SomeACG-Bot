// console.log('App entry')
import config from '~/config';
// console.log('import config')
import server from '~/api';
// console.log('import server')
import bot from '~/bot'
// import { Telegraf } from 'telegraf';
console.log('import bot')

// bot.use(Telegraf.command('start', async ctx => {
//     return await ctx.reply("喵喵喵喵")
// }))


console.log('bot launch')
bot.launch()

console.log('server listen')
server.listen(config.PORT)
