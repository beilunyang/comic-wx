import { getCateComicList, search } from '../../api/index';

Page({
  data: {
    page: 1,
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
    this.requestComics(options);
  },
  handleScrollToLower() {
    if (!this.data.lock) {
      this.requestComics(this.data.content, this.data.page);
    }
  },
});