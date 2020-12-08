import {postRequest} from './api'
import router from '../router'
import store from './store'

export const getUserTokenFromCookie = () => {
  let cookie = document.cookie.split(';').reduce((f, sv) => {
    let _sv = sv.trim().split('=').map(v => {
      return v.trim()
    });
    f[_sv[0]] = _sv[1];
    return f
  }, {});
  if (cookie && cookie.token) return cookie.token;
  else return;
};

export const clearCookie = () => {
  let date = new Date();
  date.setTime(date.getTime() - 10000);
  let keys = document.cookie.match(/[^ =;]+(?=\=)/g);
  if (keys && keys.length > 0) {
    keys.forEach((key) => {
      document.cookie = key + "=0; expire=" + date.toGMTString() + "; path=/";
    })
  }
};

export const initRouter = async () => {
  let home = router.options.routes.find(route => route.path === '/home');
  if (home.children.length !== 1) {
    return;
  }
  let {data} = await postRequest('/sysMenu/sys-menu/getSysMenu');
  if (!data || data.length === 0) {
    return
  }
  let routes = [];
  let {children} = data[0];
  if (children && children instanceof Array) {
    assembleRouter(routes, children);
  }
  home.children = [...home.children, ...routes];
  router.addRoutes([home]);
  store.commit('setHomeRoute', home);
  store.commit('setMenus', assembleMenus(children));
}

export const assembleRouter = (routes, menus) => {
  menus.forEach(menu => {
    let {nodePath, nodeComponent, nodeIconcls, children} = menu;
    if (children && children instanceof Array) {
      assembleRouter(routes, children);
    }
    if (nodePath && nodeComponent && nodeIconcls) {
      let route = {
        path: nodePath,
        component: () => import(`../components${nodeComponent}`)
      };
      routes.push(route);
    }
  });
}

export const getIsAuthority = async () => {
  const {data: res_} = await postRequest('/sysRole/sys-role/finRoleById', {id: sessionStorage.getItem("roleId")});
  if (res_.authority === 1) store.commit('setIsAuthority', false);
  else if (res_.authority === 0) store.commit('setIsAuthority', true);
}

export const assembleMenus = (menus) => {
  let menus_ = [];
  menus.forEach(menu => {
    let {
      id,
      name,
      weight,
      children,
      nodePath,
      nodeIconcls
    } = menu;
    if (children && children instanceof Array) {
      children = assembleMenus(children);
    }
    let menu_ = {
      id: id,
      roderCode: weight,
      index: nodePath,
      label: name ? name : '未命名',
      iconCls: nodeIconcls ? nodeIconcls : nodeIconcls,
      children
    };
    menus_.push(menu_);
  });
  return menus_;
}


export const clearRouteAndMenu = () => {
  let homeRoute = router.options.routes.find(route => route.path === '/home');
  homeRoute.children.splice(1, homeRoute.children.length);
  store.commit('setMenus', []);
};
export const existRouteInHome = (path) => {
  let homeRoute = router.options.routes.find(route => route.path === '/home');
  if (homeRoute && homeRoute.children) {
    if (homeRoute.children.find(route => `/home/${route.path}` === path)) return true
  }
  return false;
};


export const getMenuLabelByPath = (menus, path) => {
  let label_ = '';
  menus.forEach(menu => {
    let {index, label, children} = menu;
    if (index === path) label_ = label;
    if (!label_ && children && children instanceof Array) label_ = getMenuLabelByPath(children, path);
  });
  return label_;
};