import { getComic, getReadProgress, addCollection, deCollection, inCollection } from '../../api/index';
import config from '../../config';

const { IMG_HOST } = config;
const app = getApp();

Page({
  data: {
    comic: {},
    chapters: [],
    descH: '58rpx',
    rotateX: 0,
    down: true,
    progress: null,
    inCollection: false,
  },
  mid: null,
  onLoad({ mid }) {
    this.mid = mid;
    getComic(mid, (err, comic) => {
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
      comic.cover = `${IMG_HOST}/cover${comic.origin_cover}`;
      const chapters = comic.chapters;
      // 为chapter设置位置索引
      let chapterNum = 0;
      chapters.forEach(cps => chapterNum += cps.length);
      let idx = chapterNum;
      const nav = [];
      chapters.forEach((cps) => {
        cps.forEach((cp) => {
          if (idx === chapterNum) cp.latest = true;
          if (idx === 1) cp.foremost = true;
          cp.idx = idx;
          nav.push(cp);
          --idx;
        });
      });
      chapters.nav = nav.reverse();
      chapters.cover = comic.origin_cover;
      app.store.comic_title = comic.title;
      this.setData({ comic, chapters });
    });
  },
  onShow() {
    const mid = this.mid;
    const session_id = app.store.session_id;
    if (session_id) {
      getReadProgress(mid, (err, chapter) => {
        if (err) return console.error(err.message);
        this.setData({ progress: chapter });
      }, app);
      inCollection(mid, (err, result) => {
        if (err) return console.error(err.message);
        if (result.status === 'ok') {
          this.setData({ inCollection: true });
        }
      }, app);
    }
  },
  handleTap(e) {
    const dataset = e.target.dataset;
    const chapter = this.data.chapters[dataset.cat][dataset.idx];
    app.store.chapter = chapter;
    app.store.chapters = this.data.chapters;
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
  collection() {

  },
  read() {
    const progress = this.data.progress;
    const chapters = this.data.chapters;
    if (progress) {
      findChapter:
      for (const cate of chapters) {
        for (const chapter of cate) {
          if (chapter.pid === progress.pid) {
            app.store.chapter = chapter;
            break findChapter;
          }
        }
      }
    } else {
      if (this.data.down) {
        const cateChapters = chapters[chapters.length - 1];
        app.store.chapter = cateChapters[cateChapters.length - 1];
      } else {
        app.store.chapter = chapters[0][0];
      }
    }
    app.store.chapters = this.data.chapters;
    wx.navigateTo({
      url: '/pages/reader/reader',
    });
  },
  toggleCollect() {
    const mid = this.data.comic.mid;
    if (this.data.inCollection) {
      deCollection({ mid }, (err, result) => {
        if (err) return console.error(err.message);
        if (result.status === 'ok') {
          this.setData({ inCollection: false });
        }
      }, app);
    } else {
      const { authors, origin_cover, title } = this.data.comic;
      const data = {
        mid,
        origin_cover,
        title,
        authors: authors.split('/'),
      };
      addCollection(data, (err, result) => {
        if (err) return console.error(err.message);
        if (result.status === 'ok') {
          this.setData({ inCollection: true });
        }
      }, app);
    }
  },
});