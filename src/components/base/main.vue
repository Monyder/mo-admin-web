<template>
  <div class="center_main_container">
    <el-tabs v-model="activeTab" v-show="isShowCenterMain" type="card" @tab-click="handleTabClick"
             @tab-remove="handleTabRemove" closable>
      <el-tab-pane v-for="tab in openTabs" :key="tab.name" :label="tab.title" :name="tab.name"/>
    </el-tabs>
    <el-scrollbar class="center_main_scrollbar">
      <router-view v-show="isShowCenterMain" @addTab="addTab"/>
    </el-scrollbar>
  </div>
</template>

<script>
  import {getMenuLabelByPath} from '../../libs/base.js'

  export default {
    name: "CenterMain",
    data() {
      return {
        activeTab: '/home',
        openTabs: [{title: '首页', name: '/home'}],
        isShowCenterMain: true
      }
    },
    mounted() {
      this.routerChangeCascadeTab(this.$route.fullPath);
    },
    watch: {
      $route(to) {
        this.routerChangeCascadeTab(to.fullPath);
      },
      activeTab(val) {
        if (this.activeTab) this.isShowCenterMain = true;
        else this.isShowCenterMain = false;
        this.$router.push(val).catch(err => {
        })
      }
    },
    methods: {
      addTab(title, name) {
        for (let tab of this.openTabs) {
          if (name && name === tab.name) {
            tab.title = title;
            this.activeTab = tab.name;
            return
          }
        }
        this.openTabs.push({
          title: title,
          name: name
        });
        this.activeTab = name
      },
      handleTabClick(tab) {
        this.$router.push(tab.name).catch(err => {
        })
      },
      handleTabRemove(removeTab) {
        let tabs = this.openTabs;
        if (removeTab === this.activeTab) {
          tabs.forEach((tab, index) => {
            if (tab.name === removeTab) {
              let nextTab = tabs[index + 1] || tabs[index - 1];
              if (nextTab) this.activeTab = nextTab.name
            }
          })
        }
        this.openTabs = tabs.filter(tab => tab.name !== removeTab);
        if (this.openTabs.length === 0) this.activeTab = ''
      },
      routerChangeCascadeTab(path) {
        let targetTab = this.openTabs.find(openTab => openTab.name === path);
        if (!targetTab) {
          let label = getMenuLabelByPath(this.$store.state.menus, path.replace('/home/', ''));
          if (label) {
            this.addTab(label, path);
            return;
          }
          let tempMenu = sessionStorage.getItem('tempMenu');
          if (tempMenu) {
            this.addTab(JSON.parse(tempMenu).nodeName, path);
            return;
          }
        }
        //this.activeTab = path
      }
    }
  }
</script>

<style scoped>
  .center_main_container {
    width: 100%;
    background-color: #fff;
    padding: 10px;
  }

  .center_main_scrollbar {
    height: 85%
  }
</style>
