import { getRecords } from '../../api/index';

const app = getApp();
Page({
  data:{
    avatarUrl: '',
    nickName: '',
    records: [],
  },
  onShow() {
    const { avatarUrl, nickName } = app.globalData.userInfo;
    this.setData({ avatarUrl, nickName });
    getRecords((err, records) => {
      if (err) return console.error(err.message);
      records.forEach((record) => {
        record.cover = 'http://localhost:2333/cover' + record.cover;
      });
      this.setData({ records });
    });
  },
  more() {

  },
});