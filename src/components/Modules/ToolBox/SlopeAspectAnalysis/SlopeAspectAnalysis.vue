<!--
 * @Author: chenxiaoxuan
 * @Date: 2022-11-01 13:05:03
 * @LastEditTime: 2022-12-15 16:50:46
 * @LastEditors: chenxiaoxuan
 * @Description: 
-->
<template>
  <div class="slopeAspectAnalysis">
    <div style="color: white">坡度分析</div>
    <button @click="addLayer">加载图层</button>
    <button @click="startAnalysis">开始分析</button>
    <button @click="reset">清除</button>
  </div>
</template>

<script>
let slopeSetting = null;
let handlerPolygon = null;
import { dora } from "@/utils/doraManager";
export default {
  data() {
    return {
      entityIDs: [],
      colorTable: [
        [255 / 255, 0 / 255, 0 / 255],
        [221 / 255, 224 / 255, 7 / 255],
        [20 / 255, 187 / 255, 18 / 255],
        [0, 161 / 255, 1],
        [9 / 255, 9 / 255, 255 / 255]
      ],
    };
  },
  methods: {
    addLayer() {
      dora.viewer.imageryLayers.addImageryProvider(new dora.Cesium.SuperMapImageryProvider({
        url: "http://www.supermapol.com/realspace/services/3D-ZF_normal/rest/realspace/datas/image"
      }));
      dora.viewer.terrainProvider = new dora.Cesium.CesiumTerrainProvider({
        url: "http://www.supermapol.com/realspace/services/3D-ZF_normal/rest/realspace/datas/srtm_54_07@zhufeng",
        isSct: true,
      });
      dora.viewer.scene.globe.enableLighting = true;
      dora.viewer.scene.camera.setView({
        destination: dora.Cesium.Cartesian3.fromDegrees(87.1, 27.8, 8000.0),
        orientation: {
          heading: 6.10547067016156,
          pitch: -0.8475077031996778,
          roll: 6.2831853016686185
        }
      });
      this.init();
    },
    init() {
      handlerPolygon = new dora.Cesium.DrawHandler(dora.viewer, dora.Cesium.DrawMode.Polygon, 0);
        handlerPolygon.activeEvt.addEventListener(function (isActive) {
            if (isActive == true) {
                dora.viewer.enableCursorStyle = false;
                dora.viewer._element.style.cursor = '';
            } else {
                dora.viewer.enableCursorStyle = true;
            }
        });
        handlerPolygon.movingEvt.addEventListener(function (windowPosition) {
            if (windowPosition.x < 200 && windowPosition.y < 150) {
                return;
            }
        });
        handlerPolygon.drawEvt.addEventListener(function (result) {
            if (!result.object.positions) {
                handlerPolygon.polygon.show = false;
                handlerPolygon.polyline.show = false;
                handlerPolygon.deactivate();
                handlerPolygon.activate();
                return;
            }
            var array = [].concat(result.object.positions);
            var positions = [];
            for (var i = 0, len = array.length; i < len; i++) {
                var cartographic = dora.Cesium.Cartographic.fromCartesian(array[i]);
                var longitude = dora.Cesium.Math.toDegrees(cartographic.longitude);
                var latitude = dora.Cesium.Math.toDegrees(cartographic.latitude);
                var h = cartographic.height;
                if (positions.indexOf(longitude) == -1 && positions.indexOf(latitude) == -1) {
                    positions.push(longitude);
                    positions.push(latitude);
                    positions.push(h);
                }
            }

            slopeSetting.CoverageArea = positions;
            // wide = dora.Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_REGION;
            dora.viewer.scene.globe.SlopeSetting = {
                slopeSetting: slopeSetting,
                analysisMode: dora.Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_REGION
            };
            handlerPolygon.polygon.show = false;
            handlerPolygon.polyline.show = true;
            // handlerPolygon.deactivate();
            // handlerPolygon.activate();
        });
    },
    startAnalysis() {
      this.configSlopeSetting();
      handlerPolygon.deactivate();
      handlerPolygon.activate();
    },
    reset() {
      handlerPolygon.deactivate();
      if(handlerPolygon.polygon ) handlerPolygon.polygon.show = false;
      if(handlerPolygon.polyline ) handlerPolygon.polyline.show = false;
      dora.viewer.scene.globe.SlopeSetting = {
        slopeSetting: slopeSetting,
        analysisMode: dora.Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_NONE
      };
      dora.viewer.scene.globe.enableLighting = false;
    },
    configSlopeSetting() {
      const Cesium = dora.Cesium;
      slopeSetting = new Cesium.SlopeSetting();
      slopeSetting.DisplayMode = 3;
      slopeSetting.MaxVisibleValue = 90;
      slopeSetting.MinVisibleValue = 0;
      const colorTable = new Cesium.ColorTable();
      colorTable.insert(
        0,
        new Cesium.Color(
          this.colorTable[4][0],
          this.colorTable[4][1],
          this.colorTable[4][2]
        )
      );
      colorTable.insert(
        2,
        new Cesium.Color(
          this.colorTable[3][0],
          this.colorTable[3][1],
          this.colorTable[3][2]
        )
      );
      colorTable.insert(
        6,
        new Cesium.Color(
          this.colorTable[2][0],
          this.colorTable[2][1],
          this.colorTable[2][2]
        )
      );
      colorTable.insert(
        15,
        new Cesium.Color(
          this.colorTable[1][0],
          this.colorTable[1][1],
          this.colorTable[1][2]
        )
      );
      colorTable.insert(
        25,
        new Cesium.Color(
          this.colorTable[0][0],
          this.colorTable[0][1],
          this.colorTable[0][2]
        )
      );
      slopeSetting.ColorTable = colorTable;
      slopeSetting.Opacity = 0.5;
      dora.viewer.scene.globe.enableLighting = true;
    },
  }
};
</script>

<style scoped lang="scss"></style>