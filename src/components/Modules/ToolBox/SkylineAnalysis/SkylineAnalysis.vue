<!--
 * @Author: chenxiaoxuan
 * @Date: 2022-03-29 15:04:19
 * @LastEditTime: 2022-10-26 17:53:59
 * @LastEditors: chenxiaoxuan
 * @Description: 
-->
<template>
  <div class="visibilityAnalysis">
    <div style="color: white">天际线分析</div>
    <button @click="add3DTiles">add3DTiles</button>
    <button @click="openSkylineAnay">打开天际线</button>
    <button @click="closeSkylineAnay">关闭天际线</button>
  </div>
</template>

<script>
import { dora } from "@/utils/doraManager";
export default {
  data() {
    return {
      skylineAnayStages: null,
      silhouette: null
    };
  },
  mounted() {
    this.positions = [];
  },
  methods: {
    add3DTiles() {
      // dora.viewer.scene.primitives.add(
      //   new dora.Cesium.Cesium3DTileset({
      //     url: 'http://52.83.134.236:8090/testData/DYT/tileset.json',
      //     show: true,
      //     // backFaceCulling: true,
      //   })
      // ).readyPromise.then((tileset) => {
      //   dora.viewer.flyTo(tileset)
      // })
      const test3dtileset = new dora.Cesium.Cesium3DTileset({
        //地址可以为本地地址，或者网络地址，网络地址可能出现跨域问题，建议用nginx服务做跨域处理
        // url: "../../static/3D/裁切数据转3dt/tileset.json",
        url: "http://52.83.134.236:8090/testData/DYT/tileset.json"
        // url: "http://earthsdk.com/v/last/Apps/assets/dayanta/tileset.json",
        // maximunScreenSpaceError: 2,  //最大的屏幕空间误差
        // maximumNumberOfLoadedTiles: 1000,  //最大加载瓦片个数
        // classificationType: dora.Cesium.ClassificationType.BOTH //需要2个tileset，一个设置这个值，一个不设置，设置了的话，有其他3dtileset的时候，这个tileset会贴。
      });
      dora.viewer.scene.primitives.add(test3dtileset);
      //根据地形设置高度
      let height = 6330;
      test3dtileset.readyPromise.then(function(test3dtileset) {
        //贴地
        const cartographic = dora.Cesium.Cartographic.fromCartesian(
          test3dtileset.boundingSphere.center
        );
        const surface = dora.Cesium.Cartesian3.fromRadians(
          cartographic.longitude,
          cartographic.latitude,
          cartographic.height
        );
        const offset = dora.Cesium.Cartesian3.fromRadians(
          cartographic.longitude,
          cartographic.latitude,
          cartographic.height + height
        );
        //平移矩阵必须相减，才能得到贴面的模型
        const translation = dora.Cesium.Cartesian3.subtract(
          offset,
          surface,
          new dora.Cesium.Cartesian3()
        );
        test3dtileset.modelMatrix = dora.Cesium.Matrix4.fromTranslation(
          translation
        );
        //定位到模型
        //const boundingSphereCenter = test3dtileset.boundingSphere.center;
        dora.viewer.zoomTo(
          test3dtileset,
          //cesium方位角，可以试着调节参数掌握api的使用
          new dora.Cesium.HeadingPitchRange(
            0.0,
            -0.5,
            test3dtileset.boundingSphere.radius * 4.0
          )
        );
      });
    },
    openSkylineAnay() {
      if (this.skylineAnayStages) {
        this.silhouette.enabled = true;
        return;
      }
      this.skylineAnayStages = dora.viewer.scene.postProcessStages;
      let edgeDetection = dora.Cesium.PostProcessStageLibrary.createEdgeDetectionStage();
      let postProccessStage = new dora.Cesium.PostProcessStage({
        //此后处理阶段的唯一名称，供组合中其他阶段参考，如果未提供名称，将自动生成GUID
        // name:name,
        //unform着色器对象 textureScale
        fragmentShader:
          "uniform sampler2D colorTexture;" +
          "uniform sampler2D depthTexture;" +
          "varying vec2 v_textureCoordinates;" +
          "void main(void)" +
          "{" +
          "float depth = czm_readDepth(depthTexture, v_textureCoordinates);" +
          "vec4 color = texture2D(colorTexture, v_textureCoordinates);" +
          "if(depth<1.0 - 0.000001){" +
          "gl_FragColor = color;" +
          "}" +
          "else{" +
          "gl_FragColor = vec4(1.0,0.0,0.0,1.0);" +
          "}" +
          "}"
      });

      //PostProcessStage:要使用的片段着色器。默认sampler2D制服是colorTexture和depthTexture。
      let postProccesStage_1 = new dora.Cesium.PostProcessStage({
        // name:obj.name+'_1',
        fragmentShader:
          "uniform sampler2D colorTexture;" +
          "uniform sampler2D redTexture;" +
          "uniform sampler2D silhouetteTexture;" +
          "varying vec2 v_textureCoordinates;" +
          "void main(void)" +
          "{" +
          "vec4 redcolor=texture2D(redTexture, v_textureCoordinates);" +
          "vec4 silhouetteColor = texture2D(silhouetteTexture, v_textureCoordinates);" +
          "vec4 color = texture2D(colorTexture, v_textureCoordinates);" +
          "if(redcolor.r == 1.0){" +
          "gl_FragColor = mix(color, vec4(5.0,0.0,0.0,1.0), silhouetteColor.a);" +
          "}" +
          "else{" +
          "gl_FragColor = color;" +
          "}" +
          "}",
        //uniform着色器对象
        uniforms: {
          redTexture: postProccessStage.name,
          silhouetteTexture: edgeDetection.name
        }
      });

      //如果inputPreviousStageTexture 是 true，则每个阶段输入是场景渲染到的输出纹理或之前执行阶段的输出纹理
      //如果inputPreviousStageTexture是false，则合成中每个阶段的输入纹理都是相同的
      this.silhouette = new dora.Cesium.PostProcessStageComposite({
        //PostProcessStage要按顺序执行 的 s 或组合的数组。
        stages: [edgeDetection, postProccessStage, postProccesStage_1],
        //是否执行每个后处理阶段，其中一个阶段的输入是前一个阶段的输出。否则每个包含阶段的输入是组合之前执行的阶段的输出
        inputPreviousStageTexture: false,
        //后处理阶段制服的别名
        uniforms: edgeDetection.uniforms
      });
      this.skylineAnayStages.add(this.silhouette);
    },
    closeSkylineAnay() {
      this.silhouette.enabled = false;
    }
  }
};
</script>

<style>
</style>


