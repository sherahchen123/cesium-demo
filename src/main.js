/*
 * @Author: chenxiaoxuan
 * @Date: 2021-09-07 09:28:03
 * @LastEditTime: 2021-09-10 14:37:22
 * @LastEditors: chenxiaoxuan
 * @Description: 
 */
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue/dist/vue.esm.js'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';

// import '@supermap/vue-iclient3d-webgl/dist/styles/vue-iclient3d-webgl.min.css'
// import VueiClient from '@supermap/vue-iclient3d-webgl'
// Vue.use(VueiClient)
Vue.use(ElementUI);
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

