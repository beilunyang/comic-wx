import { getCateComicList, search } from '../../api/index';

Page({
  data: {
    page: 1,
    max: 0,
    comics: [],
    content: {
      cate: '',
      keyword: '',
    },
    lock: false,
  },
  requestComics(content, page) {
    this.setData({ lock: true });
    const { cate, keyword } = content;
    const getComicList = keyword ? search : getCateComicList;
    getComicList(cate || keyword, page, (err, comics) => {
      wx.hideLoading();
      if (err) {
        wx.showToast({
          title: '请求失败',
          duration: 2000,
        });
        return console.error(err.message);
      }
      if (page === 1) {
        const max = Math.ceil(comics.total / 15);
        comics = comics.comics;
        comics.forEach((v) => {
          v.authors = v.authors.join(' / ');
          v.origin_cover = 'http://localhost:2333/cover' + v.origin_cover;
        });
        return this.setData({
          comics: this.data.comics.concat(comics),
          page: this.data.page + 1,
          content,
          lock: false,
          max,
        });
      }
      comics.forEach((v) => {
        v.authors = v.authors.join(' / ');
        v.origin_cover = 'http://localhost:2333/cover' + v.origin_cover;
      });
      this.setData({
        comics: this.data.comics.concat(comics),
        page: this.data.page + 1,
        content,
        lock: false,
      });
    });
  },
  onLoad(options) {
    const { cate, keyword } = options;
    wx.setNavigationBarTitle({
      title: cate || keyword,
    });
    wx.showLoading({
      title: '少年养成中',
    });
    this.requestComics(options, 1);
  },
  handleScrollToLower() {
    if (!this.data.lock) {
      if (this.data.page > this.data.max) {
        return wx.showToast({
          title: '养成完毕',
        });
      }
      wx.showLoading({
        title: '少女养成中',
      });
      this.requestComics(this.data.content, this.data.page);
    }
  },
});