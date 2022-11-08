import Mongoose from 'mongoose';
import config from '~/config';

Mongoose.connect(config.DB_URL, {});

Mongoose.connection.once('open', function () {
    console.log('数据库连接成功');
});

Mongoose.connection.once('close', function () {
    console.log('数据库连接已经断开');
});

export default Mongoose;
