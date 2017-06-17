import { getComicCates, getCateComicList } from '../../api/index'
Page({
  data: {
    cates: [],
  },
  onPullDownRefresh() {
    this.onLoad();
  },
  onLoad() {
    getComicCates((err, cates) => {
      if (err) {
        wx.showToast({
          title: '请求失败，下拉刷新试试',
        });
        return console.error(err.message);
      };
      this.setData({ cates });
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
      });
    }
  },
});