<!--
 * @Author: chenxiaoxuan
 * @Date: 2022-11-14 14:59:35
 * @LastEditTime: 2022-11-17 16:09:58
 * @LastEditors: chenxiaoxuan
 * @Description: 
-->
<template>
  <div class="justify-center items-center w-full PR-8">
    <div style="color: white">光源加载</div>
    <button @click="addLayers">加载图层</button>
    <select
      id="lightSourceType"
      class="selectpicker show-tick form-control"
      @change="changeLightType"
      v-model="lightType"
    >
      <option value="NONE" selected>不添加光源</option>
      <option value="POINTLIGHT">点光源</option>
      <option value="SPOTLIGHT">聚光源</option>
      <option value="DIRECTIONALLIGHT">平行光源</option>
      <option value="LIGHTFOLLOWCAMERA">光源跟随</option>
    </select>
    <div id="pannel" style="padding: 10px;display: block;">
      <div id="pointLightPannel" v-show="pointLightShow">
        <div class="param-item">
          <label style="color:white;">扩散距离：</label>
          <input
            type="range"
            id="p_distance"
            min="0"
            max="2000"
            value="1000"
            step="10"
            style="width: 120px"
            v-model="sprayDistancePointLight"
          />
        </div>
        <div class="param-item">
          <label style="color:white;">衰减因子：</label>
          <input
            type="range"
            id="p_dacay"
            min="0"
            max="100"
            value="1"
            step="0.1"
            style="width: 120px"
            v-model="decayPointLight"
          />
        </div>
        <div class="param-item">
          <label style="color:white;">光源强度：</label>
          <input
            type="range"
            id="p_intensity"
            min="0"
            max="20"
            value="3"
            step="0.1"
            style="width: 120px"
            v-model="intensityPointLight"
          />
        </div>
      </div>
      <div id="spotLightPannel" v-show="spotLightShow">
        <div class="param-item">
          <label style="color:white;">光照距离：</label>
          <input
            type="range"
            id="s_distance"
            min="0"
            max="400"
            value="200"
            step="1"
            style="width: 120px"
            v-model="distanceSpot"
          />
        </div>
        <div class="param-item">
          <label style="color:white;">衰减因子：</label>
          <input
            type="range"
            id="s_dacay"
            min="0"
            max="6"
            value="0.5"
            step="0.1"
            style="width: 120px"
            v-model="decaySpot"
          />
        </div>
        <div class="param-item">
          <label style="color:white;">光源强度：</label>
          <input
            type="range"
            id="s_intensity"
            min="0"
            max="10"
            value="5"
            step="0.1"
            style="width: 120px"
            v-model="intensitySpot"
          />
        </div>
      </div>
      <div id="directionalLightPannel" v-show="directionalLightShow">
        <div class="param-item">
          <label style="color:white;" for="directionalLight_v">垂直平行光源</label>
          <input type="checkbox" id="directionalLight_v" checked />
        </div>
        <div class="param-item">
          <label style="color:white;">光源强度：</label>
          <input
            type="range"
            id="dLight_v"
            min="0"
            max="10"
            value="2"
            step="0.1"
            style="width: 120px"
            v-model="intensityV"
          />
        </div>
        <div class="divider"></div>
        <div class="param-item">
          <label style="color:white;" for="directionalLight_h1">水平平行光源</label>
          <input type="checkbox" id="directionalLight_h1" checked />
        </div>
        <div class="param-item">
          <label style="color:white;">光源强度：</label>
          <input
            type="range"
            id="dLight_h1"
            min="0"
            max="10"
            value="2"
            step="0.1"
            style="width:120px"
            v-model="intensityH"
          />
        </div>
      </div>
      <div id="lightFollowCamera" v-show="lightFollowCameraShow">
        <div class="param-item">
          <label style="color:white;">水平夹角(度):</label>
          <input
            type="range"
            id="horizonalFov"
            min="-180"
            max="180"
            value="0"
            step="1"
            style="width:120px"
            v-model="devH"
          />
        </div>
        <div class="param-item">
          <label style="color:white;">垂直夹角(度):</label>
          <input
            type="range"
            id="verticalFov"
            min="-180"
            max="180"
            value="0"
            step="1"
            style="width:120px"
            v-model="devV"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
let pointLight;
let spotLight;
let directionalLight_v, directionalLight_h1;
let pointEntity, spotEntity;
let directionalLight_1, removalFunc;
import { dora } from "@/utils/doraManager";
export default {
  name: "lightSetting",
  components: {},
  data() {
    return {
      pointLightShow: false,
      spotLightShow: false,
      directionalLightShow: false,
      lightFollowCameraShow: false,
      lightType: "NONE",
      sprayDistancePointLight: 1000,
      decayPointLight: 1,
      intensityPointLight: 3,
      distanceSpot: 200,
      decaySpot: 0.5,
      intensitySpot: 5,
      intensityV: 2,
      intensityH: 2,
      devH: 0,
      devV: 0
    };
  },
  mounted() {},
  watch: {
    sprayDistancePointLight: {
      handler(val) {
        pointLight.cutoffDistance = Number(val);
      },
      immediate: true
    },
    decayPointLight: {
      handler(val) {
        pointLight.decay = Number(val);
      },
      immediate: true
    },
    intensityPointLight: {
      handler(val) {
        pointLight.intensity = Number(val);
      },
      immediate: true
    },
    distanceSpot: {
      handler(val) {
        spotLight.distance = Number(val);
      },
      immediate: true
    },
    decaySpot: {
      handler(val) {
        spotLight.decay = Number(val);
      },
      immediate: true
    },
    intensitySpot: {
      handler(val) {
        spotLight.intensity = Number(val);
      },
      immediate: true
    },
    intensityV: {
      handler(val) {
        directionalLight_v.intensity = Number(val);
      },
      immediate: true
    },
    intensityH: {
      handler(val) {
        directionalLight_h1.intensity = Number(val);
      },
      immediate: true
    }
    // devH: {
    //   handler(val) {
    //     directionalLight_1.intensity = Number(val);
    //   },
    //   immediate: true
    // },
    // devV: {
    //   handler(val) {
    //     directionalLight_1.intensity = Number(val);
    //   },
    //   immediate: true
    // }
  },
  methods: {
    async addLayers() {
      const promise = dora.viewer.scene.open(
        "http://www.supermapol.com/realspace/services/3D-BIMbuilding/rest/realspace"
      );
      await promise.then(() => {
        dora.viewer.scene.camera.setView({
          destination: new dora.Cesium.Cartesian3(
            -2180753.065987198,
            4379023.266141494,
            4092583.575045952
          ),
          orientation: {
            heading: 4.0392222751147955,
            pitch: 0.010279641987852584,
            roll: 1.240962888005015e-11
          }
        });
        dora.viewer.scene.sun.show = false;
        dora.viewer.scene.globe.enableLighting = false;
        dora.viewer.scene.lightSource._ambientLightColor = new dora.Cesium.Color(
          0.4,
          0.4,
          0.4,
          0.4
        );
      });
      // dora.viewer.flyTo(promise);

      console.log(promise);
    },
    changeLightType() {
      if (this.lightType === "POINTLIGHT") {
        this.pointLightShow = true;
        this.spotLightShow = false;
        this.directionalLightShow = false;
        this.lightFollowCameraShow = false;
        let position = new dora.Cesium.Cartesian3(
          -2180734.470505298,
          4379055.704271189,
          4092558.53920364
        );
        let posDeg = dora.Cesium.Cartographic.fromCartesian(position);
        let pointPosition = dora.Cesium.Cartesian3.fromRadians(
          posDeg.longitude,
          posDeg.latitude,
          posDeg.height
        );
        pointEntity = dora.viewer.entities.add(
          new dora.Cesium.Entity({
            point: new dora.Cesium.PointGraphics({
              color: new dora.Cesium.Color(1, 1, 1),
              pixelSize: 10,
              outlineColor: new dora.Cesium.Color(1, 1, 1)
            }),
            position: pointPosition
          })
        );
        let options = {
          color: new dora.Cesium.Color(1, 1, 1, 1),
          cutoffDistance: 1000,
          decay: 1,
          intensity: 3
        };
        pointLight = new dora.Cesium.PointLight(position, options);
        dora.viewer.scene.addLightSource(pointLight);
        dora.viewer.scene.removeLightSource(spotLight);
        dora.viewer.scene.removeLightSource(directionalLight_v);
        dora.viewer.scene.removeLightSource(directionalLight_h1);
        dora.viewer.entities.remove(spotEntity);
        dora.viewer.scene.removeLightSource(directionalLight_1);
        if (removalFunc) removalFunc();
      } else if (this.lightType === "SPOTLIGHT") {
        this.pointLightShow = false;
        this.spotLightShow = true;
        this.directionalLightShow = false;
        this.lightFollowCameraShow = false;
        let position = new dora.Cesium.Cartesian3(
          -2180745.273232958,
          4379070.071537397,
          4092580.1516873706
        );
        let targetPosition = new dora.Cesium.Cartesian3(
          -2180741.228113831,
          4379061.016078637,
          4092570.800119596
        );
        let posDeg = dora.Cesium.Cartographic.fromCartesian(position);
        let pointPosition = dora.Cesium.Cartesian3.fromRadians(
          posDeg.longitude,
          posDeg.latitude,
          posDeg.height
        );
        spotEntity = dora.viewer.entities.add(
          new dora.Cesium.Entity({
            point: new dora.Cesium.PointGraphics({
              color: new dora.Cesium.Color(1, 1, 1),
              pixelSize: 10,
              outlineColor: new dora.Cesium.Color(1, 1, 1)
            }),
            position: pointPosition
          })
        );
        let options = {
          color: new dora.Cesium.Color(1, 1, 1, 1),
          distance: 200,
          decay: 0.5,
          intensity: 5
        };
        spotLight = new dora.Cesium.SpotLight(
          position,
          targetPosition,
          options
        );
        dora.viewer.scene.addLightSource(spotLight);
        dora.viewer.scene.removeLightSource(pointLight);
        dora.viewer.scene.removeLightSource(directionalLight_v);
        dora.viewer.scene.removeLightSource(directionalLight_h1);
        dora.viewer.entities.remove(pointEntity);
        dora.viewer.scene.removeLightSource(directionalLight_1);
        if (removalFunc) removalFunc();
      } else if (this.lightType === "DIRECTIONALLIGHT") {
        this.pointLightShow = false;
        this.spotLightShow = false;
        this.directionalLightShow = true;
        this.lightFollowCameraShow = false;
        let position = new dora.Cesium.Cartesian3(
          -2180765.1825337997,
          4379131.271389126,
          4092630.162654784
        );
        let position1 = new dora.Cesium.Cartesian3(
          -2180878.0519406004,
          4378948.067730668,
          4092609.6775166253
        );
        let targetPosition1 = new dora.Cesium.Cartesian3(
          -2180587.505824384,
          4379172.4152414,
          4092534.7949573714
        );
        let options = {
          intensity: 2
        };
        let options1 = {
          targetPosition: targetPosition1,
          intensity: 2
        };
        directionalLight_h1 = new dora.Cesium.DirectionalLight(
          position1,
          options1
        );
        directionalLight_v = new dora.Cesium.DirectionalLight(
          position,
          options
        );
        dora.viewer.scene.addLightSource(directionalLight_v);
        dora.viewer.scene.addLightSource(directionalLight_h1);
        dora.viewer.scene.removeLightSource(pointLight);
        dora.viewer.scene.removeLightSource(spotLight);
        dora.viewer.entities.remove(pointEntity);
        dora.viewer.entities.remove(spotEntity);
        dora.viewer.scene.removeLightSource(directionalLight_1);
        if (removalFunc) removalFunc();
      } else if (this.lightType === "LIGHTFOLLOWCAMERA") {
        this.lightFollowCameraShow = true;
        this.pointLightShow = false;
        this.spotLightShow = false;
        this.directionalLightShow = false;
        let position1 = new dora.Cesium.Cartesian3.fromDegrees(
          116.148411753949 - 0.000009405717451407729 * 86.6,
          40.2317259501307 - 0.00000914352698135 * 50,
          350
        );
        let targetPosition1 = new dora.Cesium.Cartesian3.fromDegrees(
          116.148411753949,
          40.2317259501307,
          130
        );
        let dirLightOptions = {
          targetPosition: targetPosition1,
          color: new dora.Cesium.Color(1.0, 1.0, 1.0, 1),
          intensity: 0.7
        };
        directionalLight_1 = new dora.Cesium.DirectionalLight(
          position1,
          dirLightOptions
        );
        dora.viewer.scene.addLightSource(directionalLight_1);
        removalFunc = dora.viewer.scene.postRender.addEventListener(() => {
          // 每一帧都去计算气泡的正确位置
          let cameraPosition = dora.Cesium.Cartesian3.clone(
            dora.viewer.scene.camera.position
          );
          let length = 100;
          let quad1 = dora.Cesium.Quaternion.fromAxisAngle(
            dora.viewer.scene.camera.upWC,
            dora.Cesium.Math.toRadians(Number(this.devH))
          );
          let quad2 = dora.Cesium.Quaternion.fromAxisAngle(
            dora.viewer.scene.camera.rightWC,
            dora.Cesium.Math.toRadians(Number(this.devV))
          );
          let resQuad = dora.Cesium.Quaternion.add(quad2, quad1, quad1);
          let rotation = dora.Cesium.Matrix3.fromQuaternion(resQuad);
          let direction = dora.Cesium.Matrix3.multiplyByVector(
            rotation,
            dora.viewer.scene.camera.directionWC,
            new dora.Cesium.Cartesian3()
          );
          let targetPosition2 = dora.Cesium.Cartesian3.add(
            dora.viewer.scene.camera.positionWC,
            dora.Cesium.Cartesian3.multiplyByScalar(
              direction,
              length,
              new dora.Cesium.Cartesian3()
            ),
            new dora.Cesium.Cartesian3()
          );
          directionalLight_1.position = cameraPosition;
          directionalLight_1.targetPosition = targetPosition2;
        });
        dora.viewer.entities.remove(pointEntity);
        dora.viewer.entities.remove(spotEntity);
        dora.viewer.scene.removeLightSource(pointLight);
        dora.viewer.scene.removeLightSource(spotLight);
        dora.viewer.scene.removeLightSource(directionalLight_v);
        dora.viewer.scene.removeLightSource(directionalLight_h1);
      } else {
        this.pointLightShow = false;
        this.spotLightShow = false;
        this.directionalLightShow = false;
        this.lightFollowCameraShow = false;
        dora.viewer.entities.remove(pointEntity);
        dora.viewer.entities.remove(spotEntity);
        dora.viewer.scene.removeLightSource(pointLight);
        dora.viewer.scene.removeLightSource(spotLight);
        dora.viewer.scene.removeLightSource(directionalLight_v);
        dora.viewer.scene.removeLightSource(directionalLight_h1);
        dora.viewer.scene.removeLightSource(directionalLight_1);
        if (removalFunc) removalFunc();
      }
    }
  }
};
</script>
<style lang="scss" scoped></style>