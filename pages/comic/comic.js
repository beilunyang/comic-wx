import { getComic, getReadProgress } from '../../api/index';

const app = getApp();

Page({
  data: {
    comic: {},
    chapters: [],
    descH: '58rpx',
    rotateX: 0,
    down: true,
    progress: null,
  },
  onLoad({ mid }) {
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
      comic.cover = 'http://localhost:2333/cover' + comic.origin_cover;
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
      this.setData({ comic, chapters });
    });
    const session_id = app.globalData.session_id;
    if (session_id) {
      getReadProgress(mid, (err, chapter) => {
        if (err) return console.error(err.message);
        this.setData({ progress: chapter });
      });
    }
  },
  handleTap(e) {
    const dataset = e.target.dataset;
    const chapter = this.data.chapters[dataset.cat][dataset.idx];
    app.globalData.chapter = chapter;
    app.globalData.chapters = this.data.chapters;
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
      for (const chapter of chapters) {
        if (chapter.pid === progress.pid) {
          app.globalData.chapter = chapter;
          break;
        }
      }
    } else {
      if (this.data.down) {
        const cateChapters = chapters[chapters.length - 1];
        app.globalData.chapter = cateChapters[cateChapters.length - 1];
      } else {
        app.globalData.chapter = chapters[0][0];
      }
    }
    app.globalData.chapters = this.data.chapters;
    wx.navigateTo({
      url: '/pages/reader/reader',
    });
  },
});