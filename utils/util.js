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

const wxlogin = (data, cb) => {
  wx.request({
    url: 'http://localhost:8080/api/v1/wxlogin',
    method: 'POST',
    data,
    success(res) {
      console.log(res);
      if (res.statusCode >= 200 && res.statusCode < 400) {
        return cb && cb(null, res.data);
      }
      cb && cb(new Error('res status is incorrent'));
    },
    fail() {
      cb && cb(new Error('req fail'));
    }
  });
};

const clearLastLoginState = (app) => {
  app.globalData.userInfo = null;
  app.globalData.session_id = '';
  wx.clearStorageSync();
};

export const login = (app) => {
  clearLastLoginState(app);
  wx.login({
    success(res) {
      const code = res.code;
      if (code) {
        wx.getUserInfo({
          success(res2) {
            console.log(res2);
            // 感觉没必要验证数据的完整性
            const { rawData, signature } = res2;
            wxlogin({ code, rawData, signature }, (err, result) => {
              if (err) return console.error(err.message);
              const { session_id } = result;
              if (session_id) {
                wx.setStorageSync('session_id', session_id);
                const userInfo = {
                  nickName: res2.userInfo.nickName,
                  avatarUrl: res2.userInfo.avatarUrl,
                }
                wx.setStorageSync('userInfo', userInfo);
                app.globalData.session_id = session_id;
                app.globalData.userInfo = userInfo;
              } else {
                wx.showToast({
                  title: '授权登入失败',
                })
              }
            });
          },
          fail(res) {
            console.error(res.errMsg);
            wx.showToast({
              title: '登入失败',
            });
          },
        });
      }
    },
    fail() {
      console.error('login请求发送失败');
      wx.showToast({
        title: '授权失败',
      })
    },
  });
};


