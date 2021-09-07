/*
 * @Author: chenxiaoxuan
 * @Date: 2021-09-07 09:54:52
 * @LastEditTime: 2021-09-07 09:54:59
 * @LastEditors: chenxiaoxuan
 * @Description: 
 */
import Vue from 'vue'
import Router from 'vue-router'
import SceneViewer from '@/components/SceneViewer'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'SceneViewer',
      component: SceneViewer
    }
  ]
})
