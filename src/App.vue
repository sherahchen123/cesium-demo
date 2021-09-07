<!--
 * @Author: chenxiaoxuan
 * @Date: 2021-09-07 09:28:03
 * @LastEditTime: 2021-09-07 09:52:34
 * @LastEditors: chenxiaoxuan
 * @Description: 
-->
<template>
  <div id="app">
    <SceneViewer/>
  </div>
</template>

<script>
import SceneViewer from './components/SceneViewer'
export default {
  name: 'App',
  components: {SceneViewer}
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

