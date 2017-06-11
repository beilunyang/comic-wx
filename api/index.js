import { login } from '../utils/util';

const BASE_URL = 'http://localhost:8080/api/v1';

const _get = (url, cb, app) => {
    wx.request({
        url,
        method: 'GET',
        header: {
          Authorization: app ? app.globalData.session_id : '',
        },
        success(res) {
            console.log(res);
            if (res.statusCode >= 200 && res.statusCode < 400) {
                return cb && cb(null, res.data);
            }
            if (res.statusCode === 401 && app) {
              login(app);
            }
            cb && cb(new Error('res status is incorrent'));
        },
        fail() {
            cb && cb(new Error('req fail'));
        },
    });
}

const _post = (url, data, cb, app) => {
  wx.request({
    url,
    method: 'POST',
    data,
    header: {
      Authorization: app ? app.globalData.session_id : '',
    },
    success(res) {
      console.log(res);
      if (res.statusCode >= 200 && res.statusCode < 400) {
        return cb && cb(null, res.data);
      }
      if (res.statusCode === 401 && app) {
        login(app);
      }
      cb && cb(new Error('res status is incorrent'));
    },
    fail() {
      cb && cb(new Error('req fail'));
    }
  })
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

export const getSlides = (cb) => {
  _get(`${BASE_URL}/comic/slide`, cb);
};

export const search = (keyword, page, cb) => {
    _get(`${BASE_URL}/comic/search/${keyword}/page/${page}`, cb);
};

export const addRecord = (data, cb, app) => {
  _post(`${BASE_URL}/user/record`, data, cb, app);
};

export const getRecords = (cb, app) => {
  _get(`${BASE_URL}/user/record`, cb, app);
};

export const getReadProgress = (mid, cb, app) => {
  _get(`${BASE_URL}/user/record/${mid}`, cb, app);
};

export const getCollections = (x, page, cb, app) => {
  _get(`${BASE_URL}/user/collection/page/${page}`, cb, app);
};

export const addCollection = (data, cb, app) => {
  _post(`${BASE_URL}/user/collection`, data, cb, app);
};

export const deCollection = (data, cb, app) => {
  _post(`${BASE_URL}/user/de_collection`, data, cb, app);
};

export const inCollection = (mid, cb, app) => {
  _get(`${BASE_URL}/user/collection/${mid}`, cb, app);
};