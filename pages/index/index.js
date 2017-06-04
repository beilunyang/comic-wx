import { getThemes, getSlides } from '../../api/index';

Page({
  data: {
    themes: [],
    slides: [],
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
          comic.origin_cover = 'http://localhost:2333/cover' + comic.origin_cover;
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
