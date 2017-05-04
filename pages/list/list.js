import { getCateComicList } from '../../api/index';

Page({
  data: {
    page: 1,
    comics: [],
    cate: '',
    lock: false,
  },
  requestComics(cate, page) {
    this.setData({ lock: true });
    getCateComicList(cate, page, (err, comics) => {
      if (err) {
        wx.showToast({
          title: '请求失败',
          duration: 2000,
        });
        return console.error(err.message);
      }
      comics.forEach(v => {
        v.authors = v.authors.join(' / ');
        v.origin_cover = 'http://localhost:2333/cover' + v.origin_cover;
      });
      this.setData({
        comics: this.data.comics.concat(comics),
        page: this.data.page + 1,
        cate,
        lock: false,
      });
    });
  },
  onLoad(options) {
    this.requestComics(options.cate, this.data.page);
  },
  handleScrollToLower() {
    if (!this.data.lock) {
      this.requestComics(this.data.cate, this.data.page);
    }
  },
})