<!--
 * @Author: chenxiaoxuan
 * @Date: 2022-11-01 13:05:03
 * @LastEditTime: 2022-11-10 16:18:38
 * @LastEditors: chenxiaoxuan
 * @Description: 
-->
<template>
  <div class="visibilityAnalysis">
    <div style="color: white">限高分析</div>
    <button @click="addLayer">加载图层</button>
    <button @click="heightLimitAnalysis">限高分析</button>
    <button @click="useCallbackProperty">useCallbackProperty</button>
    <button @click="usePrimitive">usePrimitive</button>
    <button @click="reset">重置</button>
  </div>
</template>

<script>
let arr = [];
let promise = [];
import { dora } from "@/utils/doraManager";
import { createPolygonGeometryCanUpdate } from "@/utils/entity.js";
export default {
  data() {
    return {
      entityIDs: []
    };
  },
  methods: {
    addLayer() {
      // const promise = dora.viewer.scene.open("http://www.supermapol.com/realspace/services/3D-data_all/rest/realspace");
      // dora.viewer.flyTo(promise);
      // console.log(promise)
      promise[0] = dora.viewer.scene.addS3MTilesLayerByScp(
        "http://www.supermapol.com/realspace/services/3D-data_all/rest/realspace/datas/%E5%90%88%E5%B9%B6%E5%90%8E@%E4%B9%9D%E5%8F%B7%E6%A5%BC/config",
        {
          name: "九号楼@九号楼"
        }
      );
      promise[1] = dora.viewer.scene.addS3MTilesLayerByScp(
        "http://www.supermapol.com/realspace/services/3D-data_all/rest/realspace/datas/%E5%90%88%E5%B9%B6%E5%90%8E@%E4%B9%9D%E5%8F%B7%E6%A5%BC/config",
        {
          name: "九号楼@九号楼1"
        }
      );
      promise[2] = dora.viewer.scene.addS3MTilesLayerByScp(
        "http://www.supermapol.com/realspace/services/3D-data_all/rest/realspace/datas/building_udb@building/config",
        {
          name: "original"
        }
      );
      promise[3] = dora.viewer.scene.addS3MTilesLayerByScp(
        "http://www.supermapol.com/realspace/services/3D-data_all/rest/realspace/datas/%E5%86%85%E9%83%A8%E7%BB%93%E6%9E%84@%E5%AE%A4%E5%86%85/config",
        {
          name: "origina白膜控制"
        }
      );
      promise[4] = dora.viewer.scene.addS3MTilesLayerByScp(
        "http://www.supermapol.com/realspace/services/3D-data_all/rest/realspace/datas/%E5%9C%B0%E9%9D%A2/config",
        {
          name: "ground"
        }
      );
      promise[5] = dora.viewer.scene.addS3MTilesLayerByScp(
        "http://www.supermapol.com/realspace/services/3D-data_all/rest/realspace/datas/%E5%B1%B1/config",
        {
          name: "hill"
        }
      );
      dora.Cesium.when.all(promise, function() {
        //设置相机位置、方向，定位至模型
        dora.viewer.scene.camera.setView({
          destination: dora.Cesium.Cartesian3.fromDegrees(
            115.00022575830863,
            39.009956534844858,
            500
          ),
          orientation: {
            heading: 1.705646,
            pitch: -0.499956,
            roll: 0.0
          }
        });

        var original = dora.viewer.scene.layers.find("original");
        var origina2 = dora.viewer.scene.layers.find("origina白膜控制");
        original.setObjsVisible([47], false);
        origina2.setObjsVisible([47], false);
      });
    },
    heightLimitAnalysis() {
      dora.viewer.camera.flyTo({
        destination: new dora.Cesium.Cartesian3.fromDegrees(
          115.00366140297365,
          39.01073839434967,
          331.116406992883
        ),
        orientation: {
          heading: 1.92451,
          pitch: -0.403816,
          roll: 0.0
        }
      });
      let entity;
      console.log(dora);
      console.log(dora.viewer.scene.layers);
      let i = 0;
      while (i < 20000) {
        arr.push(i);
        i++;
      }
      let original = dora.viewer.scene.layers.find("original");
      let origina2 = dora.viewer.scene.layers.find("origina白膜控制");
      let building = dora.viewer.scene.layers.find("九号楼@九号楼");
      let building1 = dora.viewer.scene.layers.find("九号楼@九号楼1");
      original.setObjsVisible([47], false);
      origina2.setObjsVisible([47], false);
      let instance = new dora.Cesium.S3MInstanceCollection(
        dora.viewer.scene._context
      );
      dora.viewer.scene.primitives.add(instance);
      window.setTimeout(function() {
        entity = dora.viewer.entities.add({
          id: "polygonA",
          polygon: {
            hierarchy: dora.Cesium.Cartesian3.fromDegreesArray([
              115.00769546779887,
              39.00948953601627,
              115.01061031637882,
              39.01040583624218,
              115.01127283211821,
              39.00875368295838,
              115.00837238000206,
              39.0079302039017
            ]),
            height: 105,
            material: new dora.Cesium.Color(1, 1, 0.2, 0.5),
            outline: true,
            outlineColor: dora.Cesium.Color.RED
          }
        });
        building.clipLineColor = dora.Cesium.Color.WHITE.withAlpha(0.0);
        building1.setObjsColor(
          arr,
          dora.Cesium.Color.DARKORANGE.withAlpha(0.5)
        );
        original.clipLineColor = dora.Cesium.Color.WHITE.withAlpha(0.0);
        origina2.clipLineColor = dora.Cesium.Color.WHITE.withAlpha(0.0);
        origina2.setObjsColor(
          [21, 17, 160, 62, 50, 55, 203, 57, 69, 197, 481, 29, 198, 202, 47],
          dora.Cesium.Color.DARKORANGE.withAlpha(0.5)
        );
        let height = 100;
        let flag = true;
        let flagA = true;
        window.setInterval(function() {
          if (height <= 170 && flagA) {
            if (flag) {
              height += 1.0;
            }
            if (height == 170) {
              flagA = false;
              // var tooltip;
              // tooltip = createTooltip(document.body);
              // var cartesian = dora.Cesium.Cartesian3.fromDegrees(115.00781714813387, 39.00939422072619, 172.618)
              // 	var pick = dora.Cesium.SceneTransforms.wgs84ToWindowCoordinates(dora.viewer.scene, cartesian);
              // 	// tooltip.showAt(pick, '建筑限高97米');
              // 	window.setTimeout(function() {
              // 		// tooltip.setVisible(false);
              // 	}, 3000);
            }
            entity.polygon.height = height + 2;
            dora.viewer.scene.layers.find("九号楼@九号楼").setCustomClipBox({
              dimensions: new dora.Cesium.Cartesian3(280, 250, height * 2),
              position: dora.Cesium.Cartesian3.fromDegrees(
                115.00942125650806,
                39.00903543560274,
                height / 50 - 1
              ),
              clipMode: "clip_behind_any_plane"
            });
            dora.viewer.scene.layers.find("九号楼@九号楼1").setCustomClipBox({
              dimensions: new dora.Cesium.Cartesian3(280, 250, height * 2),
              position: dora.Cesium.Cartesian3.fromDegrees(
                115.00942125650806,
                39.00903543560274,
                height / 50 - 1
              ),
              clipMode: "clip_behind_all_plane"
            });
            dora.viewer.scene.layers.find("original").setCustomClipBox({
              dimensions: new dora.Cesium.Cartesian3(280, 250, height * 2),
              position: dora.Cesium.Cartesian3.fromDegrees(
                115.00942125650806,
                39.00903543560274,
                height / 50 - 1
              ),
              clipMode: "clip_behind_any_plane"
            });
            dora.viewer.scene.layers.find("origina白膜控制").setCustomClipBox({
              dimensions: new dora.Cesium.Cartesian3(280, 250, height * 2),
              position: dora.Cesium.Cartesian3.fromDegrees(
                115.00942125650806,
                39.00903543560274,
                height / 50 - 1
              ),
              clipMode: "clip_behind_all_plane"
            });
          }
        }, 220);
      }, 2000);
    },
    useCallbackProperty() {
      let temp = 105;
      const extendedHeight = new dora.Cesium.CallbackProperty(function() {
        if (temp < 75 + 105) {
          temp += 1;
        }
        return temp;
      }, false);
      const box = dora.viewer.entities.add({
        polygon: {
          hierarchy: dora.Cesium.Cartesian3.fromDegreesArray([
            115.00769546779887,
            39.00948953601627,
            115.01061031637882,
            39.01040583624218,
            115.01127283211821,
            39.00875368295838,
            115.00837238000206,
            39.0079302039017
          ]),
          extrudedHeight: extendedHeight,
          outlineColor: dora.Cesium.Color.RED,
          outlineWidth: 1,
          height: 105,
          material: new dora.Cesium.Color(1, 1, 0.2, 0.5),
          outline: true
        }
      });
      this.entityIDs.push(box.id);
    },
    usePrimitive() {
      let entityUpdate = new createPolygonGeometryCanUpdate(
        dora,
        dora.Cesium.Cartesian3.fromDegreesArray([
          115.00769546779887,
          39.00948953601627,
          115.01061031637882,
          39.01040583624218,
          115.01127283211821,
          39.00875368295838,
          115.00837238000206,
          39.0079302039017
        ]),
        [],
        {
          extrudedHeight: 0,
          outlineColor: dora.Cesium.Color.RED,
          outlineWidth: 1,
          height: 105,
          outline: true
        }
      );
      dora.viewer.scene.groundPrimitives.add(entityUpdate);
      let extrudedHeight = 0;
      window.setTimeout(function() {
        window.setInterval(function() {
          extrudedHeight += 10;
          entityUpdate.params = {
            extrudedHeight: extrudedHeight,
            outlineColor: dora.Cesium.Color.RED,
            outlineWidth: 1,
            height: 105,
            outline: true
          };
        }, 200);
      }, 2000);
    },
    reset() {
      dora.viewer.entities.removeAll();
      let building = dora.viewer.scene.layers.find("九号楼@九号楼");
      let building1 = dora.viewer.scene.layers.find("九号楼@九号楼1");
      building.removeObjsColor(arr);
      building1.removeObjsColor(arr);
      dora.viewer.scene.camera.setView({
        destination: dora.Cesium.Cartesian3.fromDegrees(
          115.00022575830863,
          39.009956534844858,
          500
        ),
        orientation: {
          heading: 1.705646,
          pitch: -0.499956,
          roll: 0.0
        }
      });
    }
  }
};
</script>

<style scoped lang="scss"></style>