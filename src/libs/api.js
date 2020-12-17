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
  Message.error({message: '请求超时!'})
});
axios.interceptors.response.use(resp => {
  NProgress.done();
  store.commit('setLoading', false);

  if (!resp.status || resp.status !== 200) {
    Message.error({message: '响应状态码无法获取或无法识别'});
    return Promise.reject('响应状态码无法获取或无法识别');
  }
  if (!resp.data) {
    Message.error({message: '未获取到返回数据'});
    return Promise.reject('未获取到返回数据');
  }

  if (resp.data.code === 200) {
    return resp.data;
  }
  if (resp.data.code === -1 || resp.data.code === 500) {
    Message.error({message: resp.data.msg});
    return Promise.reject(resp.data.msg);
  }
  if (resp.data.code === 0) {
    console.log(resp.data);
    clearCookie();
    router.replace({path: '/'}).catch(err => {
    });
    return Promise.reject(resp.data.msg);
  }
  Message.error({message: '无法解析返回数据的状态码'});
  return Promise.reject('无法解析返回数据的状态码');
}, err => {
  NProgress.done();
  store.commit('setLoading', false);
  if (!err.response.status) Message.error({message: '未获取到请求响应状态码'});
  else if (err.response.status === 500 || err.response.status === 504) Message.error({message: '未获取到后台服务'});
  else if (err.response.status === 404) Message.error({message: '未获取到与请求地址相匹配的服务'});
  else Message.error({message: `未知错误，响应状态码：${err.response.status}`});
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
