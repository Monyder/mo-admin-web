import Vue from 'vue'
import Vuex from 'vuex'
import 'moment/locale/zh-cn'

Vue.use(Vuex);
export default new Vuex.Store({
  state: {
    loading: false,
    isAuthority: "0",
    menus: [],
    homeRoute: [],
    docBaseDetail: {},
    flowUserDetail: {},
    dataReportDetail: {}
  },
  mutations: {
    setLoading(state, isLoading) {
      state.loading = isLoading
    },
    setIsAuthority(state, isAuthority) {
      state.isAuthority = isAuthority
    },
    setMenus(state, menus) {
      state.menus = menus
    },
    setHomeRoute(state, homeRoute) {
      state.homeRoute = homeRoute
    },
    setDocBaseDetail(state, docBaseDetail) {
      state.docBaseDetail = docBaseDetail
    },
    setFlowUserDetail(state, flowUserDetail) {
      state.flowUserDetail = flowUserDetail
    },
    setDataReportDetail(state, dataReportDetail) {
      state.dataReportDetail = dataReportDetail
    }
  }
})
