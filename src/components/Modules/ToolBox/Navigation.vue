<!--
 * @Author: chenxiaoxuan
 * @Date: 2022-01-17 13:38:14
 * @LastEditTime: 2022-10-20 16:35:53
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
        <template slot="title"><span style="color: white">{{tool.label}}</span></template>
        <div v-if="tool.children">
            <div v-for="(subitem, subindex) in tool.children" :key="subindex">
              <el-menu-item style="list-style-type: none" :index="subitem.code" @click="handleOpenTool(subitem)">{{subitem.label}}</el-menu-item>
            </div>
        </div>
      </el-submenu>
    </el-menu>
    <remark v-show="remarkshow"></remark>
    <VisibilityAnalysis v-show="vaShow"></VisibilityAnalysis>
    <SkylineAnalysis v-show="saShow"></SkylineAnalysis>
  </div>
</template>

<script>
import { dora } from '@/utils/doraManager';
import Remark from './Remark/Remark';
import VisibilityAnalysis from './VisibilityAnalysis/VisibilityAnalysis';
import SkylineAnalysis from './SkylineAnalysis/SkylineAnalysis';
export default {
  data() {
    return {
      collapsed: false,
      remarkshow: false,
      vaShow: false,
      saShow: false
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
    Remark,
    VisibilityAnalysis,
    SkylineAnalysis
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
      if (subitem.label === "标注") {
        this.remarkshow = !this.remarkshow;
      } else if (subitem.label === "通视分析") {
        this.vaShow = !this.vaShow;
      } else if (subitem.label === "天际线分析") {
        this.saShow = !this.saShow;
      }
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
    width: 25vmin;
  }
</style>