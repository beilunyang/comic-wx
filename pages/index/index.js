import { getThemes, getSlides } from '../../api/index';

import config from '../../config';

const { IMG_HOST } = config;

Page({
  data: {
    themes: [],
    slides: [],
  },
  onShareAppMessage() {
    return {
      title: '我正在使用炒鸡好用的漫画小程序|萌萝莉漫画, 里面有油腻的师姐欧~~',
      success() {
        wx.showToast({
          title: '转发成功',
        });
      },
      fail() {
        wx.showToast({
          title: '转发失败',
        });
      },
    };
  },
  onPullDownRefresh() {
    this.onLoad();
  },
  onLoad() {
    getThemes((err, themes) => {
      if (err) {
        wx.showToast({
          title: '请求失败，下拉刷新试试',
        });
        return console.error(err.message);
      };
      themes.forEach((theme) => {
        for (const comic of theme.comics) {
          comic.origin_cover = `${IMG_HOST}/cover${comic.origin_cover}`;
        }
      });
      this.setData({ themes });
    });
    getSlides((err, slides) => {
      if (err) {
        wx.showToast({
          title: 'slide获取失败，下拉刷新试试',
        });
        return console.error(err.message);
      }
      this.setData({ slides });
    });
  },
  test(e) {
    console.log(e.target);
  }
});
