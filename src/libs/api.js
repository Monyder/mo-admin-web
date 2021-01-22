import axios from 'axios'
import {Message} from 'element-ui'
import qs from 'qs'
import store from './store'
import router from '../router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import {clearCookie} from './base'

NProgress.configure({
  showSpinner: false,
  speed: 500,
});
axios.interceptors.request.use(config => {
  if (config.data && config.data.notShowLoading) return config;
  NProgress.start();
  store.commit('setLoading', true);
  return config
}, err => {
  NProgress.done();
  store.commit('setLoading', false);
  router.push({name: 'page500', params: {'msg': '请求超时!'}}).catch(err => {
  });
  return Promise.reject('请求超时!');
});
axios.interceptors.response.use(resp => {
  NProgress.done();
  store.commit('setLoading', false);

  if (resp.data.code === 200) {
    return resp.data;
  }
  if (resp.data.code === -1) {
    Message.error({message: resp.data.msg});
    return Promise.reject(resp.data.msg);
  }
  if (resp.data.code === 500) {
    router.push({name: 'page500', params: {'msg': resp.data.msg}}).catch(err => {
    });
    return Promise.reject(resp.data.msg);
  }
  if (resp.data.code === 0) {
    clearCookie();
    router.replace({path: '/'}).catch(err => {
    });
    return Promise.reject(resp.data.msg);
  }
  router.push({name: 'page500', params: {'msg': '系统出错啦，请联系管理人员！'}}).catch(err => {
  });
  return Promise.reject('系统出错啦，请联系管理人员！');
}, err => {
  NProgress.done();
  store.commit('setLoading', false);
  if (err.response.status === 500 || err.response.status === 504) {
    router.push({name: 'errPage', params: {'msg': '请求失败，服务器可能出了点问题...'}}).catch(err => {
    });
  } else if (err.response.status === 404) {
    router.push("/home/page404").catch(err => {
    });
  } else {
    router.push({name: 'errPage', params: {'msg': `未知错误，响应状态码：${err.response.status}`}}).catch(err => {
    });
  }
  return Promise.reject(err)
});
let base = '';
export const postRequest = (url, params) => {
  return axios({
    method: 'post',
    url: `${base}${url}`,
    data: params,
    transformRequest: [(data) => {
      return qs.stringify(data)
    }],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
      //'Content-Type': 'application/json;charset=UTF-8'
    }
  })
};
export const getRequest = url => {
  return axios({
    method: 'get',
    url: `${base}${url}`
  })
};
