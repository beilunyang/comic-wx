import { getComic } from '../../api/index';

Page({
  data: {
    comic: {},
    chapters: [],
  },
  onLoad: function (options) {
    getComic(options.mid, (err, comic) => {
      if (err) {
        wx.showToast({
          title: '请求失败',
          duration: 2000,
        });
        return console.error(err.message);
      }
      comic.update_time = new Date(comic.update_time * 1000).toLocaleDateString();
      comic.authors = comic.authors.join('/');
      comic.types = comic.types.join('/');
      const arr = comic.chapters.sort((a, b) => a.order - b.order);
      // TODO
      // chapters 排序并分类
      this.setData({ comic });
    });
  },
})