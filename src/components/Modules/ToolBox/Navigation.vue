<!--
 * @Author: chenxiaoxuan
 * @Date: 2022-01-17 13:38:14
 * @LastEditTime: 2022-03-29 16:14:34
 * @LastEditors: chenxiaoxuan
 * @Description: 
-->
<template>
  <div class="menu">
    <el-menu
      mode="horizontal"
      background-color="rgb(122, 126, 147)"
      text-color="#fff"
      @open="handleOpen" 
      @close="handleClose" 
      :collapse="collapsed" 
      ref="rightNavigation"
      style="list-style-type: none">
      <el-submenu
        v-for="tool in tools" 
        :key="tool.id"
        :index="tool.id"
      >
        <template slot="title"><span>{{tool.label}}</span></template>
        <div v-if="tool.children">
            <div v-for="(subitem, subindex) in tool.children" :key="subindex">
              <el-menu-item style="list-style-type: none" :index="subitem.code" @click="handleOpenTool(subitem)">{{subitem.label}}</el-menu-item>
            </div>
        </div>
      </el-submenu>
    </el-menu>
    <remark></remark>
  </div>
</template>

<script>
import { dora } from '@/utils/doraManager';
import Remark from './Remark/Remark';

export default {
  data() {
    return {
      collapsed: false
    }
  },
  props: {
    tools:{
      type:Array,
      default:()=>{
        return []
      }
    }
  },
  components: {
    Remark
  },
  provide() {
    return {
      dora: dora
    };
  },
  beforeCreate() {},
  mounted() {},
  methods: {
    handleOpen() {},
    handleClose() {},
    handleOpenTool(subitem) {
      console.log(subitem.code);
      
    }
  }
}
</script>

<style scoped lang='scss'>
  .menu {
    float: right;
    height: 100%;
    position: relative;
    top: 2rem;
  }
</style>