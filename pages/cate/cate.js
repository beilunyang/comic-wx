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
  search(e) {
    const keyword = e.detail.value;
    if (keyword) {
      wx.navigateTo({
        url: `/pages/list/list?keyword=${keyword}`,
      });
    } else {
      wx.showToast({
        title: '关键字不能为空',
        duration: 2000,
      });
    }
  },
});