<!--
 * @Author: chenxiaoxuan
 * @Date: 2022-03-29 15:04:19
 * @LastEditTime: 2022-10-13 17:04:26
 * @LastEditors: chenxiaoxuan
 * @Description: 
-->
<template>
  <div class="visibilityAnalysis">
    <div style="color: white">通视分析</div>
    <button @click="firstPoint">开始打点（左键开始、左键结束）</button>
    <button @click="startAnalysis">开始分析</button>
    <button @click="clear">清除</button>
  </div>
</template>

<script>
import { dora } from "@/utils/doraManager";
let markers = [];
let lines = [];
let Positions = [];
export default {
  data() {
    return {
      positions: [],
    };
  },
  mounted() {
    this.positions = [];
  },
  methods: {
    firstPoint() {
      let CesiumEventHandler = new dora.Cesium.ScreenSpaceEventHandler(
        dora.viewer.scene.canvas
      );
      CesiumEventHandler.setInputAction(function(movement) {
        let cartesian = dora.viewer.scene.pickPosition(movement.position);
        if (cartesian) {
          Positions.push(cartesian); //加点
          if (markers.length == 0) {
            //创建点实体
            var startpoint = dora.viewer.entities.add({
              position: cartesian,
              point: {
                color: dora.Cesium.Color.fromCssColorString("#DC143C"),
                pixelSize: 10
              },
              label: {
                text: "观察点",
                scale: 0.5,
                fillColor: dora.Cesium.Color.BLACK,
                outlineColor: dora.Cesium.Color.BLACK,
                outlineWidth: 10,
                verticalOrigin: dora.Cesium.VerticalOrigin.TOP,
                eyeOffset: new dora.Cesium.Cartesian3(0, 0, -30),
                distanceDisplayCondition: 10,
                pixelOffset: new dora.Cesium.Cartesian2(0, 0)
              }
            });
            markers.push(startpoint);
          } else if (markers.length == 1) {
            var endpoint = dora.viewer.entities.add({
              position: cartesian,
              point: {
                color: dora.Cesium.Color.fromCssColorString("#44AB47"),
                pixelSize: 10
              },
              label: {
                text: "目标点",
                scale: 0.5,
                fillColor: dora.Cesium.Color.BLACK,
                outlineColor: dora.Cesium.Color.BLACK,
                outlineWidth: 10,
                verticalOrigin: dora.Cesium.VerticalOrigin.TOP,
                eyeOffset: new dora.Cesium.Cartesian3(0, 0, -30),
                distanceDisplayCondition: 10,
                pixelOffset: new dora.Cesium.Cartesian2(0, 0)
              }
            });
            markers.push(endpoint);
            CesiumEventHandler.removeInputAction(
              dora.Cesium.ScreenSpaceEventType.LEFT_CLICK
            ); //移除左键事件
          }
        }
      }, dora.Cesium.ScreenSpaceEventType.LEFT_CLICK);
    },
    startAnalysis() {
      let direction = dora.Cesium.Cartesian3.normalize(
        dora.Cesium.Cartesian3.subtract(
          Positions[1],
          Positions[0],
          new dora.Cesium.Cartesian3()
        ),
        new dora.Cesium.Cartesian3()
      );
      // 建立射线
      let ray = new dora.Cesium.Ray(Positions[0], direction);
      // 计算交互点，返回第一个
      let result = dora.viewer.scene.pickFromRay(ray, null);
      // console.log(result)
      if (dora.Cesium.defined(result) && dora.Cesium.defined(result.object)) {
        this.drawLine(result.position, Positions[0], dora.Cesium.Color.GREEN); // 可视区域
        this.drawLine(result.position, Positions[1], dora.Cesium.Color.RED); // 不可视区域
      } else {
        this.drawLine(Positions[0], Positions[1], dora.Cesium.Color.GREEN);
        console.log("不在模型上");
      }
    },
    drawLine(leftPoint, secPoint, color) {
      let Lines = dora.viewer.entities.add({
        polyline: {
          positions: [leftPoint, secPoint],
          width: 2,
          material: color,
          depthFailMaterial: color
        }
      });
      lines.push(Lines);
    },
    clear() {
      markers.map(marker => {
        dora.viewer.entities.removeById(marker.id);
      });
      lines.map(line => {
        dora.viewer.entities.removeById(line.id);
      });
      Positions = [];
    }
  }
};
</script>

<style>
</style>


