import Vue from 'vue'
import VueRouter from 'vue-router'
import login from "../components/login";
import home from "../components/home";
import index from "../components/index";

Vue.use(VueRouter);

const routes = [
  {
    path: '',
    component: login
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
VueRouter.prototype.push = function push (to) {
  return VueRouterPush.call(this, to).catch(err => err)
}


const router = new VueRouter({
  routes
});

export default router
