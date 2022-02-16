<!--
 * @Author: chenxiaoxuan
 * @Date: 2022-01-17 13:38:14
 * @LastEditTime: 2022-02-16 16:03:28
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
              <el-menu-item style="list-style-type: none" :index="subitem.code" @click="handleOpenTool(subitem.code)">{{subitem.label}}</el-menu-item>
            </div>
        </div>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
import { dora } from '@/utils/doraManager'

export default {
  data() {
    return {
      tools: [
        {
          label: "三维分析工具箱",
          id: 1,
          url: "/",
          children: [
            {
              label: "数据查询",
              code: 1,
              url: "/DataQuery/index"
            },
            {
              label: "测量",
              code: 2,
              url: "/Measure/index"
            },
            {
              label: "标注",
              code: 3,
              url: "/Remark/index"
            },
          ]
        }
      ],
      collapsed: false
    }
  },
  components: {
    
  },
  provide() {
    return {
      dora: dora
    };
  },
  mounted() {},
  methods: {
    handleOpen() {},
    handleClose() {},
    handleOpenTool(code) {
      console.log(code);
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