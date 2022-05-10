<!--
 * @Author: chenxiaoxuan
 * @Date: 2022-03-29 15:04:19
 * @LastEditTime: 2022-05-10 15:11:34
 * @LastEditors: chenxiaoxuan
 * @Description: 
-->
<template>
  <div class="remark">
    <div>标注渲染</div>
    <button @click="point">point</button>
    <button @click="label">label</button>
    <button @click="billboard">billboard</button>
    <button @click="model">model</button>
    <button @click="polyline">polyline</button>
    <button @click="entityWithMaterial">entityWithMaterial</button>
  </div>  
</template>

<script>
import { dora } from '@/utils/doraManager'
import {
  creatPoint,
  creatLabel,
  creatBillboard,
  creatModel,
  creatPolyline,
  createBoxWithImageMaterial
} from "@/utils/entity.js";

export default {
  data() {
    return {
      pointStyle: {
        color: "#DC143C",
        pixelSize: 10,
      },
      labelStyle: {
        text: "测试点",
      },
      billBoardStyle: {
        url: './static/location.svg'
      },
      modelStyle: {
        uri: "./static/xiaofangche2.gltf",
        scale: 1,
      },
      imageMaterial: "@/components/Resources/blue.png"
    }
  },
  mounted() {
    this.$nextTick(() =>{
      this.cartesian3 = new dora.Cesium.Cartesian3(
        -2180742.5339854513,
        4394790.151274532,
        4075672.903681026
      );
      this.modelC3 = new dora.Cesium.Cartesian3(
        -2180741.075961025,
        4394782.819574336,
        4075645.189332013
      );
      this.polylineC3s = [
        { x: -2180746.6418459467, y: 4394775.8755090395, z: 4075649.7015055697 },
        { x: -2180749.0107562444, y: 4394780.066282442, z: 4075643.9191940115 },
        { x: -2180742.044299121, y: 4394784.1581653375, z: 4075643.248501407 },
      ];
     })
    
  },
  methods: {
    point() {
      const en = creatPoint(dora, this.cartesian3, this.pointStyle);
      dora.viewer.flyTo(en);
    },
    label() {
      const en = creatLabel(dora, this.cartesian3, {
        ...this.pointStyle,
        ...this.labelStyle,
      });
      dora.viewer.flyTo(en);
    },
    billboard() {
      const en = creatBillboard(dora, this.cartesian3, {
        ...this.pointStyle,
        ...this.billBoardStyle,
      });
      dora.viewer.flyTo(en);
    },
    model() {
      creatModel(dora, this.modelC3, {
        ...this.pointStyle,
        ...this.modelStyle,
      });
    },
    polyline() {
      creatPolyline(dora, this.polylineC3s, {
        ...this.pointStyle,
        ...this.modelStyle,
      });
    },
    entityWithMaterial() {
      const en = createBoxWithImageMaterial(dora, this.imageMaterial);
      dora.viewer.flyTo(en);
    }
  }
}
</script>

<style>

</style>


