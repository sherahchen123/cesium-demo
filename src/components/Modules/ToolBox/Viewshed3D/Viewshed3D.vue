<!--
 * @Author: chenxiaoxuan
 * @Date: 2022-03-29 15:04:19
 * @LastEditTime: 2022-11-24 16:12:37
 * @LastEditors: chenxiaoxuan
 * @Description: 
-->
<template>
  <div class="viewshed3D">
    <div style="color: white">可视域分析</div>
    <button @click="addLayers">添加图层</button>
    <button @click="draw">绘制可视域</button>
    <button @click="clip">绘制裁剪面</button>
    <button @click="clearAll">清除</button>
    <div class="param-item">
        <b>裁剪模式：</b>
        <select id="clip-mode" class="cesium-button">
            <option value="keep-inside">保留区域内</option>
            <option value="keep-outside">保留区域外</option>
        </select>
    </div>
  </div>
</template>

<script>
let directionalLight_1 = null;
import { dora } from "@/utils/doraManager";
export default {
  data() {
    return {
      
    };
  },
  mounted() {},
  methods: {
    async addLayers() {
      const promise = dora.viewer.scene.open(
        "http://www.supermapol.com/realspace/services/3D-CBD/rest/realspace"
      );
      await promise.then(() => {
        dora.viewer.scene.camera.setView({
          destination: dora.Cesium.Cartesian3.fromDegrees(
            116.4491,
            39.9011,
            180
          ),
          orientation: {
            heading: 0.0912,
            pitch: -0.3177,
            roll: 0
          }
        });
        var scene = dora.viewer.scene;
        scene.shadowMap.darkness = 1.275; //设置第二重烘焙纹理的效果（明暗程度）
        scene.skyAtmosphere.brightnessShift = 0.4;  //修改大气的亮度
        scene.debugShowFramesPerSecond = true;
        scene.hdrEnabled = false;
        scene.sun.show = true;
        // 01设置环境光的强度-新处理CBD场景
        scene.lightSource.ambientLightColor = new dora.Cesium.Color(0.65, 0.65, 0.65, 1);
        // 添加光源
        var position1 = new dora.Cesium.Cartesian3.fromDegrees(116.261209157595, 39.3042238956531, 480);
        //光源方向点

        var targetPosition1 = new dora.Cesium.Cartesian3.fromDegrees(116.261209157595, 39.3042238956531, 430);
        var dirLightOptions = {
            targetPosition: targetPosition1,
            color: new dora.Cesium.Color(1.0, 1.0, 1.0, 1),
            intensity: 0.55
        };
        directionalLight_1 = new dora.Cesium.DirectionalLight(position1, dirLightOptions);
        scene.addLightSource(directionalLight_1);
      });
    },
    draw() {},
    clip() {},
    clearAll() {}
  }
};
</script>

<style>
</style>


