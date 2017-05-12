import { WxPromisify } from '../../utils/util';

const app = getApp();

Page({
  data: {
    readerHs: [],
    images: [],
    i: 0, // 类似page
    max: 0,
    lock: false,
    show: false,
    showChapterList: false,
    chapters: [],
  },
  onLoad() {
    let readerW = '';
    const chapter = app.globalData.chapter;
    const origin_images = chapter.origin_images;
    const images = origin_images.map(v => 'http://localhost:2333' + v);
    const max = Math.floor(images.length / 5);
    chapter.images = images;
    wx.setNavigationBarTitle({
      title: chapter.title,
    });
    this.setData({
      max,
      chapters: app.globalData.chapters,
      chapter,
    });
    this.loadImages(0);
  },
  loadImages(i) {
    this.setData({ lock: true });
    const images = app.globalData.chapter.images.slice(i * 5, ++i * 5);
    const ps = [];
    for (let k = 0; k < images.length; k++) {
      const img = images[k];
      if (img) {
        // getImageInfo 最多连续请求10张，第11张起会下载失败
        ps.push(WxPromisify.getImageInfo(img, (res) => {
          const ratio = res.height / res.width;
          return ratio * 750 + 'rpx';
        }));
      }
    }
    Promise.all(ps).then((readerHs) => {
      this.setData({
        readerHs: this.data.readerHs.concat(readerHs),
        images: this.data.images.concat(images),
        i,
        lock: false,
      });
    }).catch(() => {
      console.error('fail');
      this.setData({ lock: false });
    });
  },
  handleScrollToLower() {
    if (!this.data.lock) {
      if (this.data.i > this.data.max) {
        return console.log('finished');
      }
      this.loadImages(this.data.i);
    }
  },
  handleTap(e) {
    const dataset = e.target.dataset;
    const chapter = this.data.chapters[dataset.cat][dataset.idx];
    app.globalData.chapter = chapter;
  },
  showToolbar() {
    this.setData({
      show: !this.data.show,
      showChapterList: false,
    });
  },
  showChapters() {
    this.setData({
      showChapterList: !this.data.showChapterList,
    });
  },
  prevChapter() {

  },
  nextChapter() {

  },
});