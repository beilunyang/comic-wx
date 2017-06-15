import { login } from './utils/util';
App({
  getUserInfo() {
    const userInfo = wx.getStorageSync('userInfo');
    const session_id = wx.getStorageSync('session_id');
    if (userInfo && session_id) {
      this.store.session_id = session_id;
      this.store.userInfo = userInfo;
      return;
    }
    login(this);
  },
  onLaunch() {
    this.getUserInfo();
  },
  store: {
    userInfo: null,
    session_id: '',
    chapter: {},
    chapters: [],
    comic_title: '',
  },
});