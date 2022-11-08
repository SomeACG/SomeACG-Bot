import axios from 'axios';

export default axios.create({
    headers: {
        'accept-language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7'
    }
});
