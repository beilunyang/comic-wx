import { getThemes } from '../../api/index';

Page({
  data: {
    themes: [],
  },
  onLoad() {
    getThemes((err, themes) => {
      if (err) {
        wx.showToast({
          title: '请求失败，下拉刷新试试',
          duration: 2000
        });
        return console.error(err.message);
      };
      themes.forEach((theme) => {
        for (const comic of theme.comics) {
          comic.origin_cover = 'http://localhost:2333/cover' + comic.origin_cover;
        }
      });
      this.setData({
        themes,
      });
    });
  },
  test(e) {
    console.log(e.target);
  }
});
