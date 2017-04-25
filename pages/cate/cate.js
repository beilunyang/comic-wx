import { getComicCates, getCateComicList } from '../../api/index'
Page({
  data: {
    cates: [],
  },
  onLoad() {
    getComicCates((err, cates) => {
      if (err) {
        wx.showToast({
          title: '请求失败，下拉刷新试试(づ￣3￣)づ╭❤～',
          duration: 2000
        });
        return console.error(err.message);
      };
      this.setData({
        cates,
      });
    });
  },
})