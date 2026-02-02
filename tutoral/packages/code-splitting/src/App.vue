<template>
  <!-- <div style="width: 400px; display: flex; justify-content:space-between;">
    <router-link to="/">首页</router-link>
    <router-link to="/student">学生页面</router-link>
    <router-link to="/user">用户页面</router-link>
    <router-link to="/about">关于</router-link> 
  </div> -->


  <el-menu
    :default-active="routePath"
    class="el-menu-demo"
    mode="horizontal"
    router
  >
    <el-menu-item index="/">首页</el-menu-item>
    <el-menu-item index="/student">学生页面</el-menu-item>
    <el-menu-item index="/user">用户页面</el-menu-item>
    <el-menu-item index="/about">关于</el-menu-item>
  </el-menu>


  <div>
    <router-view></router-view>
  </div>
</template>
<script lang="ts" setup>
import { computed } from "vue";
import { ElMenu, ElMenuItem } from 'element-plus';
import { useRoute } from "vue-router";
import { debounce } from 'lodash-es';
const route = useRoute();
const routePath = computed(() => route.path);
debounce(() => {
  console.log('lodash debounce');
}, 1000)();
</script>
<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
