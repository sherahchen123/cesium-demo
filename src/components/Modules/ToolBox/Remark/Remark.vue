<!--
 * @Author: chenxiaoxuan
 * @Date: 2022-03-29 15:04:19
 * @LastEditTime: 2022-11-09 11:24:23
 * @LastEditors: chenxiaoxuan
 * @Description: 
-->
<template>
  <div class="remark">
    <div style="color: white">标注渲染</div>
    <button @click="point">point</button>
    <button @click="label">label</button>
    <button @click="billboard">billboard</button>
    <button @click="model">model</button>
    <button @click="polyline">polyline</button>
    <button @click="try1">try1</button>
    <button @click="try2">try2</button>
    <button @click="try3">try3</button>
    <button @click="entityWithMaterial">entityWithMaterial</button>
    <button @click="drawPrimitive">drawPrimitive</button>
    <button @click="clearAll">清除所有标注</button>
  </div>
</template>

<script>
let billEntity = [];
import { dora } from "@/utils/doraManager";
import {
  creatPoint,
  creatLabel,
  creatBillboard,
  creatModel,
  creatPolyline,
  createBoxWithImageMaterial,
  createPolygonGeometry1
} from "@/utils/entity.js";
let entityCollection = [];
export default {
  data() {
    return {
      pointStyle: {
        color: "#DC143C",
        pixelSize: 10
      },
      labelStyle: {
        text: "测试点"
      },
      billBoardStyle: {
        url: require("@/components/Resources/location.png")
      },
      modelStyle: {
        // uri: require("./static/xiaofangche2.gltf"),
        uri: "./static/xiaofangche2.gltf",
        scale: 1
      },
      imageMaterial: require("@/components/Resources/blue.png"),
      primitivePoints: require("@/components/Resources/location.png")
    };
  },
  mounted() {
    this.$nextTick(() => {
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
        {
          x: -2180746.6418459467,
          y: 4394775.8755090395,
          z: 4075649.7015055697
        },
        { x: -2180749.0107562444, y: 4394780.066282442, z: 4075643.9191940115 },
        { x: -2180742.044299121, y: 4394784.1581653375, z: 4075643.248501407 }
      ];
    });
  },
  methods: {
    point() {
      const en = creatPoint(dora, this.cartesian3, this.pointStyle);
      dora.viewer.flyTo(en);
      entityCollection.push(en);
    },
    label() {
      const en = creatLabel(dora, this.cartesian3, {
        ...this.pointStyle,
        ...this.labelStyle
      });
      dora.viewer.flyTo(en);
      entityCollection.push(en);
    },
    billboard() {
      const en = creatBillboard(dora, this.cartesian3, {
        ...this.pointStyle,
        ...this.billBoardStyle
      });
      dora.viewer.flyTo(en);
      entityCollection.push(en);
    },
    model() {
      const en = creatModel(dora, this.modelC3, {
        ...this.pointStyle,
        ...this.modelStyle
      });
      entityCollection.push(en);
    },
    polyline() {
      const en = creatPolyline(dora, this.polylineC3s, {
        ...this.pointStyle,
        ...this.modelStyle
      });
      entityCollection.push(en);
    },
    entityWithMaterial() {
      const en = createBoxWithImageMaterial(dora, this.imageMaterial);
      dora.viewer.flyTo(en);
      entityCollection.push(en);
    },
    try1() {
      console.time();
      this.tryEntity().then(() => {
        console.timeEnd();
      });
    },
    try2() {
      console.time();
      this.tryPrimitive().then(() => {
        console.timeEnd();
      });
    },
    try3() {
      console.time();
      this.tryPrimitive2().then(() => {
        console.timeEnd();
      })
    },
    async tryEntity() {
      for (let index = 0; index < 2500; index++) {
        await dora.viewer.entities.add({
          position: new dora.Cesium.Cartesian3.fromDegrees(
            Math.random() * 100,
            Math.random() * 100,
            10000
          ),
          ellipse: {
            semiMinorAxis: 10000.0,
            semiMajorAxis: 10000.0,
            material: dora.Cesium.Color.RED
          }
        });
      }
    },
    async tryPrimitive() {
      var instances = [];
      for (let index = 0; index < 3500; index++) {
        var ellipse = new dora.Cesium.EllipseGeometry({
          center: new dora.Cesium.Cartesian3.fromDegrees(
            Math.random() * 100,
            Math.random() * 100
          ),
          semiMajorAxis: 10000.0,
          semiMinorAxis: 10000.0
        });
        var geometry = dora.Cesium.EllipseGeometry.createGeometry(ellipse);
        var ellipseInstance = new dora.Cesium.GeometryInstance({
          geometry: geometry,
          attributes: {
            color: dora.Cesium.ColorGeometryInstanceAttribute.fromColor(
              dora.Cesium.Color.RED
            )
          }
        });

        instances.push(ellipseInstance);
      }
      await dora.viewer.scene.primitives.add(
        new dora.Cesium.Primitive({
          geometryInstances: instances,
          appearance: new dora.Cesium.PerInstanceColorAppearance(),
          asynchronous: false
        })
      );
    },
    async tryPrimitive2() {
      // var instances = [];
      for (let index = 0; index < 3500; index++) {
        var ellipse = new dora.Cesium.EllipseGeometry({
          center: new dora.Cesium.Cartesian3.fromDegrees(
            Math.random() * 100,
            Math.random() * 100
          ),
          semiMajorAxis: 10000.0,
          semiMinorAxis: 10000.0
        });
        var geometry = dora.Cesium.EllipseGeometry.createGeometry(ellipse);
        var ellipseInstance = new dora.Cesium.GeometryInstance({
          geometry: geometry,
          attributes: {
            color: dora.Cesium.ColorGeometryInstanceAttribute.fromColor(
              dora.Cesium.Color.RED
            )
          }
        });
        await dora.viewer.scene.primitives.add(
          new dora.Cesium.Primitive({
            geometryInstances: ellipseInstance,
            appearance: new dora.Cesium.PerInstanceColorAppearance(),
            asynchronous: false
          })
        );
        // instances.push(ellipseInstance);
      }
    },
    drawPrimitive() {
      var positionWord = [];
      positionWord.push(dora.Cesium.Cartesian3.fromDegrees(110.2, 34.55, 0));
      positionWord.push(dora.Cesium.Cartesian3.fromDegrees(115.2, 34.55, 0));
      positionWord.push(dora.Cesium.Cartesian3.fromDegrees(115.2, 39.55, 0));
      var pr = new createPolygonGeometry1(dora, positionWord);
      console.log(pr);
      const en = dora.viewer.scene.primitives.add(pr);
      dora.viewer.flyTo(en);
      let editFlag = false;
      console.log(editFlag);
      var moveFlag = false; //当点击的点是bill时，开始变动primitive
      // var billEntity=[];//记录添加的折点entity
      var handler = new dora.Cesium.ScreenSpaceEventHandler(
        dora.viewer.scene.canvas
      );
      var that = this;
      var dragId = -1;
      handler.setInputAction(function(movement) {
        var pick = dora.viewer.scene.pick(movement.position);
        console.log(pick);
        if (pick) {
          //pick的是bill
          if (pick.id != null && pick.id.name == "bill") {
            console.log("相机锁定");
            dragId = pick.id.id.split("-")[1];
            moveFlag = true;
            dora.viewer.scene.screenSpaceCameraController.enableRotate = false; //锁定相机
          } else {
            editFlag = true;
            var pos = pick.primitive.geometryInstances.geometry._positions;
            console.log(pick.primitive.geometryInstances.geometry._positions);
            that.removeMarkEntity(billEntity);
            billEntity = [];
            that.addMark(pos);
            dora.viewer.scene.screenSpaceCameraController.enableRotate = false; //锁定相机
            dragId = -1;
          }
        } else {
          editFlag = false;
          that.removeMarkEntity(billEntity);
          billEntity = [];
          dragId = -1;
          //viewer.scene.screenSpaceCameraController.enableRotate = true;//锁定相机
        }
      }, dora.Cesium.ScreenSpaceEventType.LEFT_CLICK);
      handler.setInputAction(function(movement) {
        let ray = dora.viewer.camera.getPickRay(movement.endPosition);
        let cartesian = dora.viewer.scene.globe.pick(ray, dora.viewer.scene);
        if (moveFlag && dragId != -1) {
          pr.positions[dragId] = cartesian;
          // billEntity[dragId].position=new Cesium.CallbackProperty(function () {
          //     return cartesian;
          // }, false);//防止闪烁，在移动的过程)
        }
      }, dora.Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    },
    addMark(positions) {
      var bill = {
        show: true,
        pixelOffset: new dora.Cesium.Cartesian2(0, 0),
        eyeOffset: new dora.Cesium.Cartesian3(0.0, 0.0, 0.0),
        horizontalOrigin: dora.Cesium.HorizontalOrigin.CENTER,
        verticalOrigin: dora.Cesium.VerticalOrigin.CENTER,
        scale: 2.0,
        image: this.primitivePoints,
        color: new dora.Cesium.Color(1.0, 1.0, 1.0, 1.0)
      };
      var entity;
      positions.map((v, index) => {
        console.log(index);
        var cartesian3 = new dora.Cesium.Cartesian3(v.x, v.y, v.z);
        var cartographic = dora.viewer.scene.globe.ellipsoid.cartesianToCartographic(
          cartesian3
        );

        var lat = dora.Cesium.Math.toDegrees(cartographic.latitude);
        var lng = dora.Cesium.Math.toDegrees(cartographic.longitude);
        var height = dora.Cesium.Math.toDegrees(cartographic.height);

        entity = dora.viewer.entities.add({
          position: dora.Cesium.Cartesian3.fromDegrees(lng, lat, height),
          billboard: bill,
          name: "bill",
          id: "bill-" + index
        });
        billEntity.push(entity);
      });
    },
    removeMarkEntity(entities) {
      entities.map(v => {
        dora.viewer.entities.remove(v);
      });
    },

    clearAll() {
      entityCollection.map(entity => {
        dora.viewer.entities.removeById(entity.id);
      });
      // dora.viewer.entities.removeAll();
    }
  }
};
</script>

<style>
</style>


