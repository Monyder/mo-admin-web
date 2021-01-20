import Vue from 'vue'
import VueRouter from 'vue-router'
import login from "../components/login";
import login1 from "../components/login";
import home from "../components/home";
import index from "../components/index";
import errPage404 from '../components/common/errPage/404'
import errPage from '../components/common/errPage/err'

Vue.use(VueRouter);

const routes = [
  {
    path: '',
    component: login
  },
  {
    path: '/login1',
    component: login1
  },
  {
    path: '/404',
    component: errPage404
  },
  {
    path: '/errPage',
    name: 'errPage',
    component: errPage
  },
  {
    path: '/home',
    component: home,
    children: [
      {
        path: '',
        component: index
      }
    ]
  }
];


const VueRouterPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(to) {
  return VueRouterPush.call(this, to).catch(err => err)
}


const router = new VueRouter({
  routes
});

export default router
