import { wxlogin } from './api/index.js';
App({
  onLaunch () {
    wx.login({
      success(res) {
        const code = res.code;
        if (code) {
          wxlogin(code, (err, result) => {
            if (err) return console.error(err.message);
            console.log(result);
          });
        }
      },
      fail() {
        console.error('login请求发送失败');
      }
    });
  },
  globalData:{
    userInfo: null,
    chapter: {},
    chapters: [],
  },
});