import { getRecords, getChapter } from '../../api/index';

const app = getApp();
Page({
  data:{
    avatarUrl: '',
    nickName: '',
    records: [],
  },
  onLoad() {
    const { avatarUrl, nickName } = app.globalData.userInfo;
    this.setData({ avatarUrl, nickName });
    getRecords((err, records) => {
      if (err) return console.error(err.message);
      const newRecords = Object.keys(records).map((mid) => {
        const comic = JSON.parse(records[mid]);
        comic.cover = 'http://localhost:2333/cover' + comic.cover;
        comic.mid = mid;
        return comic;
      });
      this.setData({ records: newRecords });
    });
  },
  continueRead(e) {
    const { mid, pid } = e.target;
    // to be continued
    getComic(mid, pid, (err, chapter) => {
      if (err) return console.error(err.message);
      app.globalData.chapter = chapter;
    });
  },
  more() {

  },
});