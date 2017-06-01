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
    notFound: false,
  },
  lock: false,
  requestComics(content, page) {
    this.lock = true;
    const { cate, keyword } = content;
    const getComicList = keyword ? search : getCateComicList;
    getComicList(cate || keyword, page, (err, result) => {
      wx.hideLoading();
      if (err) {
        wx.showToast({
          title: '请求失败',
        });
        return console.error(err.message);
      }
      const { total, comics } = result;
      if (total === 0) {
        return this.setData({ notFound: true });
      }
      if (page === 1) {
        const max = Math.ceil(total / 15);
        comics.forEach((v) => {
          v.authors = v.authors.join(' / ');
          v.origin_cover = 'http://localhost:2333/cover' + v.origin_cover;
        });
        this.setData({
          comics: this.data.comics.concat(comics),
          page: this.data.page + 1,
          content,
          max,
        });
        return this.lock = false;
      }
      comics.forEach((v) => {
        v.authors = v.authors.join(' / ');
        v.origin_cover = 'http://localhost:2333/cover' + v.origin_cover;
      });
      this.setData({
        comics: this.data.comics.concat(comics),
        page: this.data.page + 1,
        content,
      });
      this.lock = false;
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
    if (!this.lock) {
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