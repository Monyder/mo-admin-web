import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'font-awesome/css/font-awesome.min.css'
import './assets/css/common.css'
import moment from 'moment'
import 'moment/locale/zh-cn'
import 'babel-polyfill'
import 'default-passive-events'
import store from './libs/store'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import {getRequest, postRequest} from './libs/api'
import {
  clearCookie,
  clearRouteAndMenu,
  initRouter,
  addMenuDevToRouter,
  getIsAuthority,
  assembleMenus
} from './libs/base'

Vue.use(ElementUI);
Vue.config.productionTip = false;
Vue.prototype._post = postRequest;
Vue.prototype._get = getRequest;
Vue.prototype.assembleMenus = assembleMenus;
Vue.prototype.addMenuDevToRouter = addMenuDevToRouter;
Vue.prototype.clearCookie = clearCookie;
Vue.prototype.clearRouteAndMenu = clearRouteAndMenu;
Vue.filter('dateFormat', (dataStr, pattern = 'YYYY-MM-DD') => {
  if (!dataStr) return '';
  return moment(dataStr).format(pattern);
});

NProgress.configure({showSpinner: false})
router.beforeEach((to, from, next) => {
  if (to.path === '/') {
    NProgress.start();
    clearCookie();
    next();
    return;
  }
  NProgress.start();
  getIsAuthority().then(err => {
  });
  initRouter().then(err => {
  });
  next();
  return;
});
router.afterEach(() => {
  NProgress.done()
})
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
