import { wxlogin } from './api/index.js';
App({
  getUserInfo() {
    const userInfo = wx.getStorageSync('userInfo');
    const session_id = wx.getStorageSync('session_id');
    if (userInfo && session_id) {
      this.globalData.session_id = session_id;
      this.globalData.userInfo = userInfo;
      return;
    }
    const self = this;
    wx.login({
      success(res) {
        const code = res.code;
        if (code) {
          wx.getUserInfo({
            success(res2) {
              console.log(res2);
              // 感觉没必要验证数据的完整性
              const { rawData } = res2;
              wxlogin({ code, rawData }, (err, result) => {
                if (err) return console.error(err.message);
                const { session_id } = result;
                if (session_id) {
                  wx.setStorageSync('session_id', session_id);
                  const userInfo = {
                    nickName: res2.userInfo.nickName,
                    avatarUrl: res2.userInfo.avatarUrl,
                  }
                  wx.setStorageSync('userInfo', userInfo);
                  self.globalData.session_id = session_id;
                  self.globalData.userInfo = userInfo;
                } else {
                  wx.showToast({
                    title: '授权登入失败',
                  })
                }
              });
            },
            fail(res) {
              console.error(res.errMsg);
              wx.showToast({
                title: '获取用户信息失败',
              });
            },
          });
        }
      },
      fail() {
        console.error('login请求发送失败');
        wx.showToast({
          title: '授权失败',
        })
      },
    });

  },
  onLaunch() {
    this.getUserInfo();
  },
  globalData: {
    userInfo: null,
    session_id: '',
    chapter: {},
    chapters: [],
  },
});