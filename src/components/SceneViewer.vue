<!--
 * @Author: chenxiaoxuan
 * @Date: 2021-09-07 09:28:03
 * @LastEditTime: 2022-10-26 18:01:48
 * @LastEditors: chenxiaoxuan
 * @Description: 
-->
<template>
  <div class="hello">
    <!-- <div id="backgroundItem" ref="backgroundItem" class="fullSize"></div> -->
    <div id="cesiumContainer"></div>
    <basic-tools></basic-tools>
    <LayerTree :data="treeData"></LayerTree>
    <navigation :tools="tools"></navigation>
    <scale></scale>
  </div>
</template>

<script>
import { setDora } from '@/utils/doraManager';
import LayerTree from './Modules/LayerTree';
import { getLayerInfo } from "@/api/index.js";
import BasicTools from './Modules/BasicTools';
import Navigation from './Modules/ToolBox/Navigation';
import Scale from './Modules/Scale';
import { getSpaceToolsConfig } from "@/api/index.js";

let Cesium = window.Cesium
let viewer = null
export default {
  name: 'SceneViewer',
  components: {
    LayerTree,
    BasicTools,
    Navigation,
    Scale
  },
  props: {
    msg: String
  },
  data() {
    return {
      dora: null,
      treeData: [],
      tools: []
    }
  },
  
  mounted () {
    /* eslint-disable */
    this.initCesium()
    /* eslint-enable */
  },
  methods: {
    initCesium() {
      viewer = new Cesium.Viewer('cesiumContainer', {
        animation: false, //是否显示动画控件
        timeline: false, //是否显示时间线控件
        // fullscreenButton: false, //全屏按钮
        // sceneModePicker: false, //是否显示投影方式控件
        navigationHelpButton: false, //是否显示帮助信息控件
        shouldAnimate: true,// 设置自动循环，在使用czml数据加载小汽车动态数据时使用到
        navigation: false,
        // infoBox:false,   右上角弹出的信息框
      })
      // Object.freeze(viewer)
      viewer.scene.backgroundColor = Cesium.Color.TRANSPARENT
      viewer._cesiumWidget._creditContainer.style.display = 'none' //去掉logo
      viewer.scene.globe.depthTestAgainstTerrain = true;  //开启地形检测，若不开启地形检测，导致3dtiles模型始终悬浮在地形之上，在调整数字地球视角的时候，会导致3dtiles模型的位置有偏移
      // 地形半透明
      viewer.scene.undergroundMode = true;
      viewer.scene.globe.globeAlpha = 0.5;
      // 去掉裙边
      viewer.scene.terrainProvider.isCreateSkirt = false; 
       //改变天空颜色
      viewer.scene.backgroundColor = new Cesium.Color(112 / 255, 128 / 255, 144 / 255, 1.0);/* 112 128 144*/
      viewer.scene.globe.cullEnable = false;
      let Dora = {
        viewer: viewer,
        Cesium: Cesium
      }
      setDora(Dora)
      console.log("version", Dora.Cesium.VERSION)
      this.getLayerTree();
      this.getConfig();
      let str = "http://52.82.98.186:6080/arcgis/rest/services/YZT/YX2014/MapServer";
      let num = str.indexOf("MapServer")
      console.log(num)
      // console.log(layer1)
    },
    async getLayerTree() {
     await getLayerInfo().then(res => {
        let originData = [];
        console.log(res)
        for (const item of res) {
          originData.push({
            label:item.name,
            layerInfo:item,
            children:[]
          })
        }
        this.treeData = originData;
      })
      .catch((err) => { throw new Error(err.message); });
    },
    async getConfig() {
      await getSpaceToolsConfig().then(res => {
        console.log(res)
        this.tools = res;
      })
      .catch((err) => { throw new Error(err.message); });
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
#cesiumContainer {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  margin: 0;
  overflow: hidden;
  padding: 0;
  font-family: sans-serif;
}
// .fullSize {
//   display: block;
//   position: absolute;
//   top: 0;
//   left: 0;
//   border: none;
//   width: 100%;
//   height: 100%;
//   background-image: url('./Resources/sky.jpg');
// }
</style>
