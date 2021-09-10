<!--
 * @Author: chenxiaoxuan
 * @Date: 2021-09-10 13:08:47
 * @LastEditTime: 2021-09-10 13:21:13
 * @LastEditors: chenxiaoxuan
 * @Description: 
-->
<template>
  <div class="treeContainer">
    <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
  </div>
</template>
<script>
import {showLayerByName} from '@/utils/loaderManager'
export default {
    data() {
      return {
        data1: [
          {
          label: '一级 1',
          children: [{
            label: '二级 1-1',
            children: [{
              label: '三级 1-1-1'
            }]
          }]
        }, {
          label: '一级 2',
          children: [{
            label: '二级 2-1',
            children: [{
              label: '三级 2-1-1'
            }]
          }, {
            label: '二级 2-2',
            children: [{
              label: '三级 2-2-1'
            }]
          }]
        }, {
          label: '一级 3',
          children: [{
            label: '二级 3-1',
            children: [{
              label: '三级 3-1-1'
            }]
          }, {
            label: '二级 3-2',
            children: [{
              label: '三级 3-2-1'
            }]
          }]
        }],
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      };
    },
    props:{
      data:{
        type:Array,
        default:()=>{
          return []
          }
      }
    },
    methods: {
      handleNodeClick(data) {
        console.log(data.layerInfo);
        showLayerByName(data.layerInfo)
      }
    }
  };

</script>

<style scoped lang='scss'>
.treeContainer{
  position:absolute;
  top: 0px;
  left: 0px;
  height: 600px;
  overflow: auto;
  .el-tree {
    background: #3d5469;
    color: #f4f5f8;
  }
  ::v-deep .el-tree-node__content:hover {
    // background-color: #F5F7FA;
   color: black;
  }
}
</style>
