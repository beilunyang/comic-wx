import { getImageInfo } from '../../utils/util';
import { addRecord } from '../../api/index';

import config from '../../config';

const { IMG_HOST } = config;
const app = getApp();

Page({
  data: {
    readerHs: [],
    images: [],
    i: 0, // 类似page
    max: 0,
    show: false,
    showChapterList: false,
    chapters: [],
    comic_title: '',
    loadAll: false,
  },
  lock: false,
  onLoad() {
    let readerW = '';
    const chapter = app.store.chapter;
    const chapters = app.store.chapters;
    const origin_cover = chapters.cover;
    const { title, mid, pid } = chapter;
    if (app.store.session_id) {
      addRecord({ title, mid, pid, origin_cover }, null, app);
    }
    const origin_images = chapter.origin_images;
    const images = origin_images.map(v => `${IMG_HOST}${v}`);
    const max = Math.floor(images.length / 5);
    chapter.images = images;
    wx.setNavigationBarTitle({
      title: chapter.title,
    });
    this.setData({
      max,
      chapters,
      chapter,
      comic_title: app.store.comic_title,
    });
    this.loadImages(0);
  },
  loadImages(i) {
    this.lock = true;
    const images = app.store.chapter.images.slice(i * 5, ++i * 5);
    const ps = [];
    for (let k = 0; k < images.length; k++) {
      const img = images[k];
      if (img) {
        // getImageInfo 最多连续请求10张，第11张起会下载失败
        ps.push(getImageInfo(img, (res) => {
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
      });
      this.lock = false;
    }).catch(() => {
      console.error('fail');
      this.lock = false;
    });
  },
  handleScrollToLower() {
    if (!this.lock) {
      if (this.data.i > this.data.max) {
        return this.setData({ loadAll: true });
      }
      this.loadImages(this.data.i);
    }
  },
  handleTap(e) {
    const dataset = e.target.dataset;
    const chapter = this.data.chapters[dataset.cat][dataset.idx];
    app.store.chapter = chapter;
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
    const cp = app.store.chapter;
    if (cp.foremost) {
      wx.showToast({
        title: '已经是第一章了',
      });
    } else {
      app.store.chapter = app.store.chapters.nav[cp.idx-2];
      wx.redirectTo({
        url: '/pages/reader/reader',
      });
    }
  },
  nextChapter() {
    const cp = app.store.chapter;
    if (cp.latest) {
      wx.showToast({
        title: '已经是最后一章了',
      });
    } else {
      app.store.chapter = this.data.chapters.nav[cp.idx];
      wx.redirectTo({
        url: '/pages/reader/reader',
      });
    }
  },
});