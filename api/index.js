const BASE_URL = 'http://localhost:8888/api/v1';

const _get = (url, cb) => {
    wx.request({
        url,
        method: 'GET',
        success(res) {
            console.log(res);
            if (res.statusCode >= 200 && res.statusCode < 400) {
                return cb(null, res.data);
            }
            cb(new Error('res status is incorrect'));
        },
        fail() {
            cb(new Error('req fail'));
        },
    });
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

export const getThemes = (cb) => {
    _get(`${BASE_URL}/comic/theme`, cb);
}