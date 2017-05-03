//app.js
App({
  onLaunch: function () {
    wx.login({
      success() {
        wx.getUserInfo({
          success: () => {
            this.globalData.userInfo = res.userInfo;
          },
          fail(res) {
            console.error('用户授权失败');
          },
        }); 
      },
    });
  },
  globalData:{
    userInfo: null,
    chapter: {},
  }
})