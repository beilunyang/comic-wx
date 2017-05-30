import { login } from './utils/util';
App({
  getUserInfo() {
    const userInfo = wx.getStorageSync('userInfo');
    const session_id = wx.getStorageSync('session_id');
    if (userInfo && session_id) {
      this.globalData.session_id = session_id;
      this.globalData.userInfo = userInfo;
      return;
    }
    login(this);
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