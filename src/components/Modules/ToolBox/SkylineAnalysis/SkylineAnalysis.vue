<!--
 * @Author: chenxiaoxuan
 * @Date: 2022-03-29 15:04:19
 * @LastEditTime: 2022-10-20 16:42:41
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
      silhouette: null,
    };
  },
  mounted() {
    this.positions = [];
  },
  methods: {
    add3DTiles() {
      dora.viewer.scene.primitives.add(
        new dora.Cesium.Cesium3DTileset({
          url: 'http://52.83.134.236:8090/testData/DYT/tileset.json',
          show: true,
          backFaceCulling: true,
        })
      ).readyPromise.then((tileset) => {
        dora.viewer.flyTo(tileset)
      })
    },
    openSkylineAnay() {
      if(this.skylineAnayStages){
        this.silhouette.enabled=true;
        return;
      }
      this.skylineAnayStages = this.viewer.scene.postProcessStages;
      let edgeDetection = dora.Cesium.PostProcessStageLibrary.createEdgeDetectionStage();
      let postProccessStage = new dora.Cesium.PostProcessStage({
        //此后处理阶段的唯一名称，供组合中其他阶段参考，如果未提供名称，将自动生成GUID
        // name:name,
        //unform着色器对象 textureScale
        fragmentShader: 'uniform sampler2D colorTexture;' +
            'uniform sampler2D depthTexture;' +
            'varying vec2 v_textureCoordinates;' +
            'void main(void)' +
            '{' +
            'float depth = czm_readDepth(depthTexture, v_textureCoordinates);' +
            'vec4 color = texture2D(colorTexture, v_textureCoordinates);' +
            'if(depth<1.0 - 0.000001){' +
            'gl_FragColor = color;' +
            '}' +
            'else{' +
            'gl_FragColor = vec4(1.0,0.0,0.0,1.0);' +
            '}' +
            '}'
      });
 
      //PostProcessStage:要使用的片段着色器。默认sampler2D制服是colorTexture和depthTexture。
      let postProccesStage_1 = new dora.Cesium.PostProcessStage({
        // name:obj.name+'_1',
        fragmentShader: 'uniform sampler2D colorTexture;' +
            'uniform sampler2D redTexture;' +
            'uniform sampler2D silhouetteTexture;' +
            'varying vec2 v_textureCoordinates;' +
            'void main(void)' +
            '{' +
            'vec4 redcolor=texture2D(redTexture, v_textureCoordinates);' +
            'vec4 silhouetteColor = texture2D(silhouetteTexture, v_textureCoordinates);' +
            'vec4 color = texture2D(colorTexture, v_textureCoordinates);' +
            'if(redcolor.r == 1.0){' +
            'gl_FragColor = mix(color, vec4(5.0,0.0,0.0,1.0), silhouetteColor.a);' +
            '}' +
            'else{' +
            'gl_FragColor = color;' +
            '}' +
            '}',
        //uniform着色器对象
        uniforms: {
          redTexture: postProccessStage.name,
          silhouetteTexture: edgeDetection.name
        }
      });
 
      //如果inputPreviousStageTexture 是 true，则每个阶段输入是场景渲染到的输出纹理或之前执行阶段的输出纹理
      //如果inputPreviousStageTexture是false，则合成中每个阶段的输入纹理都是相同的
      this.silhouette= new dora.Cesium.PostProcessStageComposite({
        //PostProcessStage要按顺序执行 的 s 或组合的数组。
        stages:[edgeDetection,postProccessStage,postProccesStage_1],
        //是否执行每个后处理阶段，其中一个阶段的输入是前一个阶段的输出。否则每个包含阶段的输入是组合之前执行的阶段的输出
        inputPreviousStageTexture:false,
        //后处理阶段制服的别名
        uniforms:edgeDetection.uniforms
      })
      this.skylineAnayStages.add(this.silhouette);
    },
    closeSkylineAnay() {
      this.silhouette.enabled=false;
    }
  }
};
</script>

<style>
</style>


