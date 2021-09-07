<template>
  <div class="hello">
    <div id="cesiumContainer"></div>
    <div class="scene-tool-item">
      <div>
        <button @click="zoomTo(1)">放大</button>
        <button @click="zoomTo(0)">缩小</button>
        <button @click="changeSceneMode">二三维切换</button>
        <button @click="flyToLocation">指定视图位置</button>
        <button @click="hideEarth">隐藏地球</button>
        <button @click="changeSceneColor">改变背景颜色</button>
        <button @click="customDefineEarthPic">自定义地球图片</button>
        <button @click="changeSceneBackgroundToOrigin">背景恢复</button>
        <button @click="addSceneRain">雨</button>
        <button @click="addSceneSnow">雪</button>
        <button @click="addSceneFog">雾</button>
        <button @click="removeSceneWeather">去除天气效果</button>
      </div>
    </div>

  </div>
</template>

<script>
const Cesium = window.Cesium
let viewer = null
export default {
  name: 'SceneViewer',
  props: {
    msg: String
  },
  data() {
    return {
      viewType: '三维视图',
      snow: null,
      rain: null,
      fog: null
    }
  },
  mounted () {
    /* eslint-disable */
    this.initCesium()
    /* eslint-enable */
  },
  methods: {
    initCesium() {
      viewer = new Cesium.Viewer('cesiumContainer', {})
      Object.freeze(viewer)
      viewer.scene.backgroundColor = Cesium.Color.TRANSPARENT
      viewer._cesiumWidget._creditContainer.style.display = 'none' //去掉logo
    },
    zoomTo(num) {
      if (num) {
        viewer.camera.zoomIn(100000)
      } else {
        viewer.camera.zoomOut(100000)
      }
    },
    flyToLocation() {
      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(-117.16, 32.71, 15000.0),
        orientation: {
          heading: Cesium.Math.toRadians(175.0),
          pitch: Cesium.Math.toRadians(-35.0),
          roll: 0.0
        }
      })
    },
    changeSceneMode() {
      if (this.viewType === '三维视图') {
        viewer.scene.morphTo2D(0)
        this.viewType = '二维视图'
      } else {
        if (this.viewType === '二维视图') {
          viewer.scene.morphToColumbusView(0)
          this.viewType = '哥伦布视图'
        } else {
          viewer.scene.morphTo3D(0)
          this.viewType = '三维视图'
        }
      }
    },
    changeSceneColor() {
      viewer.scene.sun.show = false
      viewer.scene.moon.show = false
      viewer.scene.skyBox.show = false
      viewer.scene.backgroundColor = Cesium.Color.fromRandom()
    },
    changeSceneBackgroundToOrigin() {
      viewer.scene.sun.show = true
      viewer.scene.moon.show = true
      viewer.scene.skyBox.show = true
      viewer.scene.globe.show = true
      viewer.scene.skyAtmosphere.show = true
      viewer.scene.backgroundColor = new Cesium.Color(0.0, 0.0, 0.0, 0.0)
    },
    hideEarth() {
      viewer.scene.skyBox.show = false
      viewer.scene.backgroundColor = Cesium.Color.fromRandom()
      viewer.scene.sun.show = false
      viewer.scene.moon.show = false
      viewer.scene.globe.show = false
      viewer.scene.skyAtmosphere.show = false //隐藏大气圈
    },
    customDefineEarthPic() {
      // viewer.imageryLayers.addImageryProvider(
      //   new Cesium.SingleTileImageryProvider({
      //     url: './Resources/sky.jpg'
      //   })
      // )
    },
    addSceneRain() {
      if (this.rain) viewer.scene.postProcessStages.remove(this.rain)
      this.rain = new Cesium.PostProcessStage({
        name: 'czm_rain',
        fragmentShader:
          '\n\
          uniform sampler2D colorTexture;\n\
            varying vec2 v_textureCoordinates;\n\
            float hash(float x)\n\
            {\n\
              return fract(sin(x*133.3)*13.13);\n\
            }\n\
            void main(void){\n\
              float time = czm_frameNumber / 60.0;\n\
              vec2 resolution = czm_viewport.zw;\n\
              vec2 uv=(gl_FragCoord.xy*2.-resolution.xy)/min(resolution.x,resolution.y);\n\
              vec3 c=vec3(.6,.7,.8);\n\
              float a=-.4;\n\
            float si=sin(a),co=cos(a);\n\
            uv*=mat2(co,-si,si,co);\n\
            uv*=length(uv+vec2(0,4.9))*.3+1.;\n\
              float v=1.-sin(hash(floor(uv.x*100.))*2.);\n\
            float b=clamp(abs(sin(20.*time*v+uv.y*(5./(2.+v))))-.95,0.,1.)*20.;\n\
            c*=v*b;\n\
            gl_FragColor = mix(texture2D(colorTexture, v_textureCoordinates), vec4(c,1), 0.5);\n\
          }'
      })
      viewer.scene.postProcessStages.add(this.rain)
    },
    addSceneFog() {
      if (this.fog) viewer.scene.postProcessStages.remove(this.fog)
      this.fog = new Cesium.PostProcessStage({
        name: 'czm_fog',
        fragmentShader:
          '\n\
        uniform sampler2D colorTexture;\n\
              uniform sampler2D depthTexture;\n\
              varying vec2 v_textureCoordinates;\n\
              void main(void)\n\
              {\n\
                vec4 origcolor=texture2D(colorTexture, v_textureCoordinates);\n\
                  vec4 fogcolor=vec4(0.8,0.8,0.8,0.5);\n\
                  float depth = czm_readDepth(depthTexture, v_textureCoordinates);\n\
                  vec4 depthcolor=texture2D(depthTexture, v_textureCoordinates);\n\
                  float f=(depthcolor.r-0.7)/0.2;\n\
                  if(f<0.0) f=0.0;\n\
                  else if(f>1.0) f=1.0;\n\
                  gl_FragColor = mix(origcolor,fogcolor,f);\n\
          }'
      })
      viewer.scene.postProcessStages.add(this.fog)
    },
    addSceneSnow() {
      if (this.snow) viewer.scene.postProcessStages.remove(this.snow)
      this.snow = new Cesium.PostProcessStage({
        name: 'czm_snow',
        fragmentShader:
          '\n\
          uniform sampler2D colorTexture;\n\
          varying vec2 v_textureCoordinates;\n\
          float snow(vec2 uv,float scale)\n\
          {\n\
          float time = czm_frameNumber / 60.0;\n\
           float w=smoothstep(1.,0.,-uv.y*(scale/10.));if(w<.1)return 0.;\n\
           uv+=time/scale;uv.y+=time*2./scale;uv.x+=sin(uv.y+time*.5)/scale;\n\
            uv*=scale;vec2 s=floor(uv),f=fract(uv),p;float k=3.,d;\n\
            p=.5+.35*sin(11.*fract(sin((s+p+scale)*mat2(7,3,6,5))*5.))-f;d=length(p);k=min(d,k);\n\
           k=smoothstep(0.,k,sin(f.x+f.y)*0.01);\n\
          return k*w;\n\
          }\n\
          void main(void){\n\
           vec2 resolution = czm_viewport.zw;\n\
           vec2 uv=(gl_FragCoord.xy*2.-resolution.xy)/min(resolution.x,resolution.y);\n\
           vec3 finalColor=vec3(0);\n\
             float c = 0.0;\n\
            c+=snow(uv,30.)*.0;\n\
            c+=snow(uv,20.)*.0;\n\
           c+=snow(uv,15.)*.0;\n\
           c+=snow(uv,10.);\n\
           c+=snow(uv,8.);\n\
            c+=snow(uv,6.);\n\
           c+=snow(uv,5.);\n\
            finalColor=(vec3(c)); \n\
          gl_FragColor = mix(texture2D(colorTexture, v_textureCoordinates), vec4(finalColor,1), 0.5); \n\
          }'
      })
      viewer.scene.postProcessStages.add(this.snow)
    },
    removeSceneWeather() {
      if (this.snow) viewer.scene.postProcessStages.remove(this.snow)
      if (this.fog) viewer.scene.postProcessStages.remove(this.fog)
      if (this.rain) viewer.scene.postProcessStages.remove(this.rain)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
#cesiumContainer {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  margin: 0;
  overflow: hidden;
  padding: 0;
  font-family: sans-serif;
}
.scene-tool-item {
  position: absolute;
  z-index: 100;
  top: 0;
  display: inline-block;
}
</style>
