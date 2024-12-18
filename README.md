<p align="center">
<img src="https://t.me/i/userpic/320/SomeACG.jpg" alt="SomeACG" width="240">
</p>
<h1 align="center">SomeACG Bot</h1>


这里是 [@SomeACG](https://t.me/SomeACG) 自用的壁纸推送机器人的源码仓库。

### 架构概述

数据库：[MongoDB](https://www.mongodb.com/)

缩略图存储：[Blackblaze](https://www.backblaze.com/)

高清图存储：[OneDrive](https://www.office.com/onedrive)

所支持的图源平台：

* [Pixiv](https://www.pixiv.net/)
* [Twitter](https://twitter.com/?lang=en)
* [Danbooru](https://danbooru.donmai.us/)
* [Bilibili 动态](https://t.bilibili.com)

目前所使用的 PaaS 托管平台：[Fly.io](https://fly.io/)

### 配置文件

项目在开发环境下使用 DotEnv 格式的配置文件，其中主要的配置项已在 `.env.example` 中给出。

其中各项配置的说明如下：

| 名称          | 示例                                                         | 说明                         |
| ------------- | ------------------------------------------------------------ | ---------------------------- |
| BOT_TOKEN     | `123456789:ABCDEFGYgsSi`                                     | Telegram 机器人的 Bot Token  |
| PUSH_CHANNEL  | `@SomeACG`                                                   | 壁纸推送的目标频道           |
| CLIENT_ID     | `8e9771c9-a07c-45f6-93e3-9bc4062125d0`                       | Microsoft Graph 的客户端 ID  |
| CLIENT_SECRET | `jCO8Q~Wt6kJJQLYGBD5O6Kk8EjO76sQIYlm9c_xZ`                   | Microsoft Graph 的客户端密钥 |
| ADMIN_LIST    | `123456732`                                                  | 默认管理员的 User ID         |
| DB_URL        | `mongodb://localhost:27017/SomeACG?replicaSet=rs0`           | MongoDB 数据库连接字符串     |
| B2_ENDPOINT   | `s3.us-west-001.backblazeb2.com`                             | Blackblaze 的存储桶地址      |
| B2_KEY_ID     | `1b002831244`                                                | Blackblaze 的应用 ID         |
| B2_KEY        | `O923+1uaJH686d7hTw2`                                        | Blackblaze 的应用密钥        |
| PIXIV_COOKIE  | `yuid_b=IyTgsd8; PHPSESSID=91263823_7H4nvJHtguiu6yYiu7OIOIomS;` | Pixiv 的网站 Cookie          |

一些其他需要注意的配置项：

* REFRESH_TOKEN：第一次运行时需要手动获取 Microsoft Graph API 的 Refresh Token，并设置到 `REFRESH_TOKEN` 环境变量中。之后的 Refresh Token 便会自动存入到数据库并自动刷新。
* DOTENV_NAME：开发环境下设置此环境变量用来指定以哪个文件作为启动时的配置文件，比如设置了 `DOTENV_NAME=development` 则会使用 `.env.development` 这个文件作为配置文件，默认情况下使用 `yarn dev` 启动时也会使用此配置文件。如果不设置这个变量时贼会使用 `.env` 作为配置文件。
* USE_PROXY：启动时设置此环境变量为1时，程序会读取系统内设置的 `HTTPS_PROXY_HOST` 和 `HTTPS_PROXY_PORT` 作为 Telegram Bot API 的连接代理。
* DEV_MODE：启动时设置此环境变量为1时，机器人将不再回复除了默认管理员以外的任何用户的指令，以避免其他用户的干扰。同时设置了此变量后程序会使用 `./temp` 作为临时下载目录，未设置时将会使用 `/tmp` 作为临时下载目录。
* SP_SITE_ID：如果使用 SharePoint 站点作为存储源，则需要配置此变量为站点 ID。
* 数据库环境：由于程序使用了 MongoDB 的数据库事务功能来进行失败时的回滚操作，而 MongoDB 的事务功能需要数据库运行在 Replica Set 模式下才能正常使用。如果需要在本地进行开发测试，请先确保 MongoDB 数据库已经正确配置了 Replica 模式。

### 测试

目前项目只有一个单元测试，用来测试 Twitter Web API 的可用性。可以使用下面的命令来运行这个测试。

```shell
yarn jest --runTestsByPath src/tests/twitter.test.ts
```

### 编译和运行

本项目使用 `yarn` 作为 Node.js 包管理工具，使用 TypeScript 作为主要编程语言，运行 `yarn build` 后的编译产物默认在 `dist` 文件夹下。

如上所述，默认的 `yarn dev` 默认使用 `.env.development` 文件作为配置文件。如需在本地进行开发，请先将 `.env.example` 复制一份并填写上面表格中所必须的配置项。

### 感谢

感谢以下项目为本项目所提供的代码、思路和灵感。

* [RSSHub](https://github.com/DIYgod/RSSHub)：提供 Twitter Web API 的实现代码。
* [Telegraf](https://github.com/telegraf/telegraf)：完全类型支持的 Telegram 机器人框架。
