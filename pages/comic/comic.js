import { getComic } from '../../api/index';

const app = getApp();

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
      comic.origin_cover = 'http://localhost:2333/cover' + comic.origin_cover;
      this.setData({ comic, chapters: comic.chapters });
    });
  },
  handleTap(e) {
    const dataset = e.target.dataset;
    const chapter = this.data.chapters[dataset.cat][dataset.idx];
    const images = chapter.origin_images;
    chapter.images = images.map(v => 'http://localhost:2333' + v);
    app.globalData.chapter = chapter;
  },
})