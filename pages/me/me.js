import { getRecords } from '../../api/index';
import { login } from '../../utils/util';

const app = getApp();
Page({
  data: {
    avatarUrl: 'https://ooo.0o0.ooo/2017/05/31/592d9ac5cc253.jpg',
    nickName: '登入',
    records: [],
  },
  onShow() {
    const session_id = app.globalData.session_id;
    const userInfo = app.globalData.userInfo;
    if (userInfo) {
      const { avatarUrl, nickName } = userInfo;
      this.setData({ avatarUrl, nickName });
    }
    if (session_id) {
      getRecords((err, records) => {
        if (err) return console.error(err.message);
        records.forEach((record) => {
          record.cover = 'http://localhost:2333/cover' + record.cover;
        });
        this.setData({ records });
      }, app);
    }
  },
  more() {

  },
  login() {
    if (!app.globalData.session_id) {
      login(app);
    }
  },
});