<!--
 * @Author: chenxiaoxuan
 * @Date: 2022-01-17 13:35:46
 * @LastEditTime: 2022-03-09 15:02:45
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
import { 
  getSuperMapPointsJson,
  getSuperMapPolylineJson,
  getSuperMapPolygonJson
} from "@/api/index.js";

export default {
  data() {
    return {
      scaleValue: 1
    }
  },
  async mounted() {
    await getSuperMapPointsJson().then(res => {
      console.log(res)
      this.togeojson(res);
        // this.tools = res;
    })
    .catch((err) => { throw new Error(err.message); });
    await getSuperMapPolylineJson().then(res => {
      console.log(res)
      this.togeojson(res);
        // this.tools = res;
    })
    .catch((err) => { throw new Error(err.message); });
    await getSuperMapPolygonJson().then(res => {
      console.log(res)
      this.togeojson(res);
        // this.tools = res;
    })
    .catch((err) => { throw new Error(err.message); });
    // let polylineJson = getSuperMapPolylineJson();
    // let polygonJson = getSuperMapPolygonJson();
    // console.log(pointsJson)
    // this.togeojson(pointsJson);
    // this.togeojson(polylineJson);
    // this.togeojson(polygonJson);
    this.$nextTick(() =>{
      const handler = new dora.Cesium.ScreenSpaceEventHandler(
        dora.viewer.scene.canvas
      );
      handler.setInputAction(() => {
        const { value } = this.updateScale(dora, 4);
        this.scaleValue = value || "N/A";
      }, dora.Cesium.ScreenSpaceEventType.WHEEL);
      // handler.setInputAction(function(click){
      //   console.log('中键按下事件：', click.position);     
      // },dora.Cesium.ScreenSpaceEventType.MIDDLE_DOWN);
    })
  },
  methods: {
    togeojson(jsonA) {
      console.log(jsonA)
      const geojson = this.jsonTOGeojson(jsonA)
      console.log(geojson)
    },
    jsonTOGeojson(jsonA) {   //jsonA为超图矢量图层的json格式，可以是点数据、线数据或面数据
      let result = null;
      let Onefeature = null;
      let type = null;
      //提取属性
      let properties = {};
      // for (let i = 0; i < jsonA.fieldNames.length; i++) {
      //   properties[jsonA.fieldNames[i]] = jsonA.fieldValues[i]
      // }
      jsonA.fieldNames.map((name, i) => {
        properties[name] = jsonA.fieldValues[i];
      });
      if (jsonA.geometry.type == "POINT") {  //点数据的情况
        if (jsonA.geometry.points.length === 1) {
          type = "Point";
        } else {
          type = "MultiPoint";
        }
        let coordinates = [];
        jsonA.geometry.points.map(res => {
          let point = [res.x, res.y];
          coordinates.push(point);
        })
        Onefeature = {
          "type": "Feature",
          "geometry": {
            "type": type,
            "coordinates": coordinates
          },
          "properties": properties
        }
      } else if (jsonA.geometry.type == "LINE") {  //线数据的情况
        let coordinates = [];
        if (jsonA.geometry.parts.length === 1) {
          type = "LineString";
          jsonA.geometry.points.map(res => {
            let point = [res.x, res.y];
            coordinates.push(point);
          })
        } else {
          type = "MultiLineString";
          let cursor = 0;
          jsonA.geometry.parts.map(num => {
            let coor = [];
            for (let i = 0; i < num; i++) {
              let point = [jsonA.geometry.points[i+cursor].x, jsonA.geometry.points[i+cursor].y]
              coor.push(point)
            }
            coordinates.push(coor);
            cursor += num;
          })
        }
        Onefeature = {
          "type": "Feature",
          "geometry": {
            "type": type,
            "coordinates": coordinates
          },
          "properties": properties
        }
      } else if (jsonA.geometry.type == "REGION") {  //面数据的情况
        let coordinates = [];
        if (jsonA.geometry.parts.length === 1) {
          type = "Polygon";
          let coor = [];
          jsonA.geometry.points.map(res => {
            let point = [res.x, res.y];
            coor.push(point);
          })
          coordinates.push(coor);
        } else {
          type = "MultiPolygon";
          let cursor = 0;
          let partTopo = []  //区分“一个总多边形”，包括外层多边形和内部孔洞，重组一个数组
          let partgroup = [];
          for (let i = 0; i < jsonA.geometry.partTopo.length; i++) {
            let num = jsonA.geometry.partTopo[i];
            let num1 = jsonA.geometry.partTopo[i+1];
            if (i == 0 && num1 > 0) {
              partTopo.push([num])
            } else if (num > 0 && num1 > 0) {
              partTopo.push([num])
            } else if (num > 0 && num1 == null) {
              partTopo.push([num])
            } else if (num > 0 && num1 < 0) {
              partgroup = [];
              partgroup.push(num);
            } else if (num < 0 && num1 < 0) {
              partgroup.push(num);
            } else if (num < 0 && num1 > 0) {
              partgroup.push(num);
              partTopo.push(partgroup);
            }
          }
          let pointcursor = 0;
          partTopo.map(parts => {
            let coor = []; //这一层代表“一个总多边形”，包括外层多边形和内部孔洞
            for (let i = 0; i < parts.length; i++) {
              let num = jsonA.geometry.parts[i+cursor];
              let Onepoly = [];  //单个多边形
              for (let j = 0; j < num; j++) {
                let point = [jsonA.geometry.points[i+pointcursor].x, jsonA.geometry.points[i+pointcursor].y];
                Onepoly.push(point);
              }
              coor.push(Onepoly);
              pointcursor += num;
            }
            cursor += parts.length;
            coordinates.push(coor);
          })
        }
        Onefeature = {
          "type": "Feature",
          "geometry": {
            "type": type,
            "coordinates": coordinates
          },
          "properties": properties
        }
      }
      result = {
        "type": "FeatureCollection",
        "features": [Onefeature]
      }
      return result;
    },
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