<!--
 * @Author: chenxiaoxuan
 * @Date: 2022-10-26 13:36:53
 * @LastEditTime: 2022-10-27 16:45:56
 * @LastEditors: chenxiaoxuan
 * @Description: 
-->
<template>
  <div class="ShadowAnalysis">
    <div style="color: white">阴影分析</div>
    <div class="param-item">
        <b>日期选择：</b>
        <input id="selDate" type="date" value="2017-05-13" v-model="selDate"/>
    </div>
    <div class="param-item">
        <b>开始时间：</b>
        <select id="startTime" class="form-control" v-model="startTime">
            <option value="0">0:00</option>
            <option value="2">2:00</option>
            <option value="4">4:00</option>
            <option value="6">6:00</option>
            <option value="8">8:00</option>
            <option value="10" selected>10:00</option>
            <option value="12">12:00</option>
            <option value="14">14:00</option>
            <option value="16">16:00</option>
            <option value="18">18:00</option>
            <option value="20">20:00</option>
            <option value="22">22:00</option>
        </select>
    </div>
    <div class="param-item">
        <b>结束时间：</b>
        <select id="endTime" class="form-control" v-model="endTime">
            <option value="2">2:00</option>
            <option value="4">4:00</option>
            <option value="6">6:00</option>
            <option value="8">8:00</option>
            <option value="10">10:00</option>
            <option value="12" selected>12:00</option>
            <option value="14">14:00</option>
            <option value="16">16:00</option>
            <option value="18">18:00</option>
            <option value="20">20:00</option>
            <option value="22">22:00</option>
            <option value="24">24:00</option>
        </select>
    </div>
    <div class="param-item">
        <b>底部高程：</b>
        <input id="bottomHeight" value="20" v-model="bottomHeight"/>
    </div>
    <div class="param-item">
        <b>拉伸高度：</b>
        <input id="extrudeHeight" value="20" v-model="extrudeHeight"/>
    </div>
    <div class="param-item">
        <button type="button" id="shadowAnalysis" class="button black" @click="adds3mLayer">定位图层</button>
        <button type="button" id="shadowAnalysis" class="button black" @click="shadowAnalysis">阴影分析</button>
        <button type="button" id="sunlight" class="button black" @click="sunLight">日照效果</button>
        <button type="button" id="clear" class="button black" @click="clearAll">清除</button>
        <button type="button" id="shadowRadio" class="button black" @click="getShadowRatio">获取阴影率</button>
    </div>
    <div id="shadowRadioBox" v-show="radioshow">
        <table style="color:#000">
            <caption id="title"><b>阴影率窗口</b></caption>
            <tr>
                <td><b>阴影率：</b></td>
                <td><input type="text" id="shadowRadioText" class="displayText" readonly v-model="shadowRadioText"/></td>
            </tr>
            <tr>
                <td><b>经度：</b></td>
                <td><input type="text" id="longitudeText" readonly class="displayText" v-model="longitudeText"></td>
            </tr>
            <tr>
                <td><b>纬度：</b></td>
                <td><input type="text" id="latitudeText" readonly class="displayText" v-model="latitudeText"></td>
            </tr>
            <tr>
                <td><b>高程：</b></td>
                <td><input type="text" id="heightText" readonly class="displayText" v-model="heightText"></td>
            </tr>

        </table>
    </div>
  </div>
</template>

<script>
let handlerPolygon = null;
let shadowQuery = null;
let selectedDate = "2017-05-13";
let StartTime = 10;
let EndTime = 12;
let BottomHeight = 20;
let ExtrudeHeight = 20;
import { dora } from "@/utils/doraManager";
export default {
  data() {
    return {
      selDate: "2017-05-13",
      startTime: 10,
      endTime: 12,
      bottomHeight: 20,
      extrudeHeight: 20,
      radioshow: false,
      shadowRadioText: "",
      longitudeText: "",
      latitudeText: "",
      heightText: ""
    }
  },
  mounted() {},
  methods: {
    async adds3mLayer() {
      const promise = dora.viewer.scene.open("http://www.supermapol.com/realspace/services/3D-CBD/rest/realspace");
      await promise.then(() => {
        dora.viewer.scene.camera.setView({
          destination : dora.Cesium.Cartesian3.fromDegrees(116.4491, 39.9011, 180),
          orientation : {
            heading : 0.0912,
            pitch : -0.3177,
            roll : 0
          }
        });
      });
      this.addlights();
      this.init();
    },
    addlights() {
      // 01设置环境光的强度-新处理CBD场景
      dora.viewer.scene.lightSource.ambientLightColor = new dora.Cesium.Color(0.65, 0.65, 0.65, 1);
      // 添加光源
      const position1 = new dora.Cesium.Cartesian3.fromDegrees(116.261209157595,  39.3042238956531, 480);
      //光源方向点

      const targetPosition1 = new dora.Cesium.Cartesian3.fromDegrees(116.261209157595, 39.3042238956531,430);
      const dirLightOptions = {
        targetPosition: targetPosition1,
        color: new dora.Cesium.Color(1.0, 1.0, 1.0, 1),
        intensity: 0.55
      };
      let directionalLight_1 = new dora.Cesium.DirectionalLight(position1, dirLightOptions);
      dora.viewer.scene.addLightSource(directionalLight_1);

      dora.viewer.scene.shadowMap.darkness = 0.3; //设置第二重烘焙纹理的效果（明暗程度）
      dora.viewer.scene.skyAtmosphere.brightnessShift = 0.4;  //修改大气的亮度
      dora.viewer.scene.debugShowFramesPerSecond = true;
    },
    init() {
      shadowQuery = new dora.Cesium.ShadowQueryPoints(dora.viewer.scene);
      shadowQuery.build();
      this.setCurrentTime();
      
      handlerPolygon = new dora.Cesium.DrawHandler(dora.viewer, dora.Cesium.DrawMode.Polygon,0);
        handlerPolygon.activeEvt.addEventListener(function(isActive){
            if(isActive == true){
                dora.viewer.enableCursorStyle = false;
                dora.viewer._element.style.cursor = '';
                    // $('body').removeClass('drawCur').addClass('drawCur');
            }
            else{
                dora.viewer.enableCursorStyle = true;
                // $('body').removeClass('drawCur');
            }
        });
            // handlerPolygon.movingEvt.addEventListener(function(windowPosition){
            //     if(handlerPolygon.isDrawing){
            //         // tooltip.showAt(windowPosition,'<p>绘制阴影分析区域(右键结束绘制)</p>');
            //     }
            // });
        var points = [];

        handlerPolygon.drawEvt.addEventListener(function(result){
            // tooltip.setVisible(false);
            points.length = 0 ;
            var polygon = result.object;
            if(!polygon){
                return ;
            }
            polygon.show = false;
            handlerPolygon.polyline.show = false;
            var positions = [].concat(polygon.positions);
            positions = dora.Cesium.arrayRemoveDuplicates(positions, dora.Cesium.Cartesian3.equalsEpsilon);

            //遍历多边形，取出所有点
            for(var i = 0, len = positions.length; i < len; i++) {
                //转化为经纬度，并加入至临时数组
                var cartographic = dora.Cesium.Cartographic.fromCartesian(polygon.positions[i]);
                var longitude = dora.Cesium.Math.toDegrees(cartographic.longitude);
                var latitude = dora.Cesium.Math.toDegrees(cartographic.latitude);
                points.push(longitude);
                points.push(latitude);
            }
            //设置分析对象的开始结束时间
            // var dateValue = this.selDate;
            var startTime = new Date(selectedDate);
            startTime.setHours(Number(StartTime));
            shadowQuery.startTime = dora.Cesium.JulianDate.fromDate(startTime);

            var endTime = new Date(selectedDate);
            endTime.setHours(Number(EndTime));
            shadowQuery.endTime = dora.Cesium.JulianDate.fromDate(endTime);

            //设置当前时间
            // this.setCurrentTime();
            let endTime1 = new Date(selectedDate);
            endTime1.setHours(Number(EndTime));
            dora.viewer.clock.currentTime = dora.Cesium.JulianDate.fromDate(endTime1);
            dora.viewer.clock.multiplier = 1;
            dora.viewer.clock.shouldAnimate = true;

            shadowQuery.spacing = 20;
            shadowQuery.timeInterval = 60;

            //设置分析区域、底部高程和拉伸高度
            var bh = Number(BottomHeight);
            var eh = Number(ExtrudeHeight);
            shadowQuery.qureyRegion({
                position : points,
                bottom : bh,
                extend : eh
            });
            shadowQuery.build()
        });
    },
    shadowAnalysis() {
      selectedDate = this.selDate;
      BottomHeight = this.bottomHeight;
      ExtrudeHeight = this.extrudeHeight;
      handlerPolygon.deactivate();
      handlerPolygon.activate();
    },
    sunLight() {
      let dateVal = this.selDate;
      let startTime = new Date(dateVal);
    //   let endTime = new Date(dateVal);
      let shour = Number(this.startTime);
      let ehour = Number(this.endTime);

        if(shour > ehour) {
            return;
        }
        var nTimer = 0.0;
        var nIntervId = setInterval(function() {
            if(shour < ehour) {
                startTime.setHours(shour);
                startTime.setMinutes(nTimer);
                dora.viewer.clock.currentTime = dora.Cesium.JulianDate.fromDate(startTime);
                nTimer += 10.0;
                if(nTimer > 60.0){
                    shour += 1.0;
                    nTimer = 0.0;
                }
            } else {
                clearInterval(nIntervId);
            }
        }, 20);
    },
    clearAll() {
      handlerPolygon.deactivate();
      if(handlerPolygon.polygon ) handlerPolygon.polygon.show = false;
      if(handlerPolygon.polyline ) handlerPolygon.polyline.show = false;
      // $('#shadowRadioBox').css('display','none');
      this.radioshow = false;
      shadowQuery.clear();
    },
    getShadowRatio() {
    this.radioshow = true;
    this.shadowRadioText = "";
    this.longitudeText = "";
    this.latitudeText = "";
    this.heightText = "";
        var handler = new dora.Cesium.ScreenSpaceEventHandler(dora.scene.canvas);
        handler.setInputAction(function(e){
            var position1= dora.viewer.scene.pickPosition(e.position);
            var cartographic = dora.Cesium.Cartographic.fromCartesian(position1);
            var shadowRadio=shadowQuery.getShadowRadio(cartographic);
            var longitude = dora.Cesium.Math.toDegrees(cartographic.longitude);
            var latitude = dora.Cesium.Math.toDegrees(cartographic.latitude);
            var height = cartographic.height;
            dora.viewer.entities.removeAll();
            if(shadowRadio !== -1) {
                this.shadowRadioText = shadowRadio.toString();
                this.longitudeText = longitude.toString();
                this.latitudeText = latitude.toString();
                this.heightText = height.toString();
                dora.viewer.entities.add(new dora.Cesium.Entity({
                    point: new dora.Cesium.PointGraphics({
                        color: new dora.Cesium.Color(1, 0, 0, 0.5),
                        pixelSize: 15

                    }),
                    position: dora.Cesium.Cartesian3.fromDegrees(longitude, latitude, height + 0.5)
                }));
            }
            else
            {
                this.shadowRadioText = "";
                this.longitudeText = "";
                this.latitudeText = "";
                this.heightText = "";
            }
        }, dora.Cesium.ScreenSpaceEventType.LEFT_CLICK);
    },
    setCurrentTime() {
      let endTime = new Date(this.selDate);
      endTime.setHours(Number(this.endTime));
      dora.viewer.clock.currentTime = dora.Cesium.JulianDate.fromDate(endTime);
      dora.viewer.clock.multiplier = 1;
      dora.viewer.clock.shouldAnimate = true;
    }
  }
}
</script>

<style scoped lang="scss">
.ShadowAnalysis {
    background-color: rgba(255,255,255,0.5);
    .param-item {
        float: left;
    }
}
#shadowRadioBox
{
    position: fixed;
    right: 8px;
    bottom: 8px;
    background-color: #ffffe0;
}
#shadowRadioBox caption
{
    background-color: #ffffe0;
}
#shadowRadioBox td
{
    padding-left: 8px;
    padding-right: 8px;
    height:20px;
}
#shadowRadioBox tr
{
    height:20px;
}
</style>

