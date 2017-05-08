import { getComic } from '../../api/index';

const app = getApp();

Page({
  data: {
    comic: {},
    chapters: [],
    descH: '58rpx',
    rotateX: 0,
    down: true,
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
      wx.setNavigationBarTitle({
        title: comic.title,
      });
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
  more() {
    if (this.data.descH === '58rpx') {
      this.setData({
        descH: 'auto',
        rotateX: '180deg',
      });
    } else {
      this.setData({
        descH: '58rpx',
        rotateX: '0deg',
      });
    }
  },
  sort() {
    const chapters = this.data.chapters.map(v => v.reverse());
    if (this.data.down) {
      this.setData({
        down: false,
        chapters,
      });
    } else {
      this.setData({
        down: true,
        chapters,
      });
    }
  },
});