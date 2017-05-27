const BASE_URL = 'http://localhost:8888/api/v1';

const _get = (url, cb) => {
    wx.request({
        url,
        method: 'GET',
        header: {
          Authorization: wx.getStorageSync('session_id'),
        },
        success(res) {
            console.log(res);
            if (res.statusCode >= 200 && res.statusCode < 400) {
                return cb && cb(null, res.data);
            }
            cb && cb(new Error('res status is incorrect'));
        },
        fail() {
            cb && cb(new Error('req fail'));
        },
    });
}

const _post = (url, data, cb) => {
  wx.request({
    url,
    method: 'POST',
    data,
    header: {
      Authorization: wx.getStorageSync('session_id'),
    },
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
  })
}

export const wxlogin = (data, cb) => {
    _post(`${BASE_URL}/wxlogin`, data, cb);
}

export const getComicCates = (cb) => {
    _get(`${BASE_URL}/comic/cate`, cb);
};

export const getCateComicList = (cate, page = 1, cb) => {
   _get(`${BASE_URL}/comic/cate/${cate}/page/${page}`, cb);
};

export const getComic = (id, cb) => {
    _get(`${BASE_URL}/comic/${id}`, cb);
};

export const getChapter = (mid, pid, cb) => {
  _get(`${BASE_URL}/comic/${mid}/chapter/${pid}`, cb);
};

export const getThemes = (cb) => {
    _get(`${BASE_URL}/comic/theme`, cb);
};

export const search = (keyword, page, cb) => {
    _get(`${BASE_URL}/comic/search/${keyword}/page/${page}`, cb);
};

export const addRecord = (data, cb) => {
  _post(`${BASE_URL}/user/record`, data, cb);
};

export const getRecords = (cb) => {
  _get(`${BASE_URL}/user/record`, cb);
};