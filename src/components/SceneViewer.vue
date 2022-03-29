<!--
 * @Author: chenxiaoxuan
 * @Date: 2021-09-07 09:28:03
 * @LastEditTime: 2022-03-24 17:26:19
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
      viewer = new Cesium.Viewer('cesiumContainer', {})
      // Object.freeze(viewer)
      viewer.scene.backgroundColor = Cesium.Color.TRANSPARENT
      viewer._cesiumWidget._creditContainer.style.display = 'none' //去掉logo
      let Dora = {
        viewer: viewer,
        Cesium: Cesium
      }
      setDora(Dora)
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
