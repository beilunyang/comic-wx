export const getImageInfo = (src, cb) => {
  return new Promise((resolve, reject) => {
    wx.getImageInfo({
      src,
      success(res) {
        resolve(cb(res));
      },
      fail(res) {
        reject();
      },
    });
  });
};


