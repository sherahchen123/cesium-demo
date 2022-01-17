<!--
 * @Author: chenxiaoxuan
 * @Date: 2022-01-17 13:35:46
 * @LastEditTime: 2022-01-17 16:59:07
 * @LastEditors: chenxiaoxuan
 * @Description: 
-->
<template>
  <div class="scaler">
    <div class="scaler-bar">
      <div class="scaler-item">
        <span class="scaler-label">比例尺:</span>
        <span>1:{{ scaleValue }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { dora } from '@/utils/doraManager'

export default {
  data() {
    return {
      scaleValue: 1
    }
  },
  mounted() {
    this.$nextTick(() =>{
      const handler = new dora.Cesium.ScreenSpaceEventHandler(
        dora.viewer.scene.canvas
      );
      handler.setInputAction(() => {
        const { value } = this.updateScale(dora, 4);
        this.scaleValue = value || "N/A";
      }, dora.Cesium.ScreenSpaceEventType.WHEEL);
    })
  },
  methods: {
    updateScale(dora, stepCount = 4) {
      const scene = dora.viewer.scene;
      const distances = [
        1,
        2,
        3,
        5,
        10,
        20,
        30,
        50,
        100,
        200,
        300,
        500,
        1000,
        2000,
        3000,
        5000,
        10000,
        20000,
        30000,
        50000,
        100000,
        200000,
        300000,
        500000,
        1000000,
        2000000,
        3000000,
        5000000,
        10000000,
        20000000,
        30000000,
        50000000,
      ];
      const width = scene.canvas.clientWidth;
      const height = scene.canvas.clientHeight;
      // 屏幕一像素的地图距离
      let leftwidth = (width / 2) | 0;
      let leftheight = height - 1;
      let rightwidth = (1 + width / 2) | 0;
      const left = scene.camera.getPickRay(
        new dora.Cesium.Cartesian2(leftwidth, leftheight)
      );
      const right = scene.camera.getPickRay(
        new dora.Cesium.Cartesian2(rightwidth, leftheight)
      );
      const leftPosition = scene.globe.pick(left, scene);
      const rightPosition = scene.globe.pick(right, scene);
      if (!leftPosition || !rightPosition) {
        return {};
      }
      const point1cartographic = dora.Cesium.Ellipsoid.WGS84.cartesianToCartographic(leftPosition);
      const point2cartographic = dora.Cesium.Ellipsoid.WGS84.cartesianToCartographic(rightPosition);
      const geodesic = new dora.Cesium.EllipsoidGeodesic();
      geodesic.setEndPoints(point1cartographic, point2cartographic);
      const pixelDistance = geodesic.surfaceDistance;

      const maxBarWidth = 100;
      let distance;
      for (let i = distances.length - 1; !distance && i >= 0; --i) {
        if (distances[i] / pixelDistance < maxBarWidth) {
          distance = distances[i];
        }
      }
      let barWidth = (distance / pixelDistance) | 0;
      barWidth = barWidth * (stepCount / 2);
      return {
        value: distance,
        width: barWidth,
      };
    },
  }
}
</script>

<style scoped lang='scss'>
  .scaler {
    position: absolute;
    bottom: 1rem;
    right: 3rem;
    display: flex;
    height: 1.56rem;
    margin: 0 0.39rem;
    align-items: center;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 0.21rem;
    user-select: none;
    pointer-events: all;
    &-bar {
      display: flex;
      align-items: center;
      height: 100%;
      .scaler-item {
        white-space: nowrap;
        margin: 0.39rem;
        .scaler-label {
          margin-right: 0.3rem;
        }
      }
      .scaler-item:first-child {
        cursor: pointer;
      }
    }
}
</style>