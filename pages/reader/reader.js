import { WxPromisify } from '../../utils/util';

const app = getApp();

Page({
  data: {
    readerHs: [],
    images: [],
    i: 0,
    max: 0,
    lock: false,
  },
  onLoad() {
    let readerW = '';
    const images = app.globalData.chapter.images;
    const max = Math.floor(images.length / 5);
    this.setData({ max, lock: true });
    this.loadImages(0);
  },
  loadImages(i) {
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
      this.setData({ lock: true });
      this.loadImages(this.data.i);
    }
  }
});