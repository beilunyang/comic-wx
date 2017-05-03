import { getCateComicList } from '../../api/index';

Page({
  data: {
    page: 1,
    comics: [],
    cate: '',
  },
  requestComics(cate, page) {
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
        v.origin_cover = v.origin_cover.replace('http://images.dmzj.com', 'http://localhost:2333/cover');
      });
      this.setData({
        comics: this.data.comics.concat(comics),
        page: this.data.page + 1,
        cate,
      });
    });
  },
  onLoad(options) {
    this.requestComics(options.cate, this.data.page);
  },
  onReachBottom() {
    this.requestComics(this.data.cate, this.data.page);
  },
})