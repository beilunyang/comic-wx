const app = getApp();
Page({
  data:{
    avatarUrl: '',
    nickName: '',
  },
  onLoad() {
    const { avatarUrl, nickName } = app.globalData.userInfo;
    this.setData({ avatarUrl, nickName });
  },
});