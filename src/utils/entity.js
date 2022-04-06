/*
 * @Author: chenxiaoxuan
 * @Date: 2022-03-29 15:14:39
 * @LastEditTime: 2022-04-06 16:26:23
 * @LastEditors: chenxiaoxuan
 * @Description: 
 */
export const creatPoint = (dora, position, style) => {
  const { color = '#DC143C', pixelSize } = style;
  let ren = dora.viewer.entities.add({
    name: 'top',
    position: position,
    point: {
      color: dora.Cesium.Color.fromCssColorString(color),
      pixelSize: pixelSize
    }
  });
  return ren;
};
export const creatLabel = (dora, position, style) => {
  const { color = '#DC143C', pixelSize, text } = style;
  let ren = dora.viewer.entities.add({
    name: 'top',
    position: position,
    point: {
      color: dora.Cesium.Color.fromCssColorString(color),
      pixelSize: pixelSize
    },
    label: {
      text: text,
      scale: 0.5,
      fillColor: dora.Cesium.Color.BLACK,
      outlineColor: dora.Cesium.Color.BLACK,
      outlineWidth: 10,
      verticalOrigin: dora.Cesium.VerticalOrigin.TOP,
      eyeOffset: new dora.Cesium.Cartesian3(0, 0, -30),
      distanceDisplayCondition: 10,
      pixelOffset: new dora.Cesium.Cartesian2(0, 0)
    }
  });
  return ren;
};
export const creatBillboard = (dora, position, style) => {
  const { color = '#DC143C', pixelSize, url, scale = 1 } = style;
  let ren = dora.viewer.entities.add({
    name: 'top',
    position: position,
    point: {
      color: dora.Cesium.Color.fromCssColorString(color),
      pixelSize: pixelSize
    },
    label: {
      text: "1",  scale: 0.5,
    },
    billboard: {
      image: url,
      scale: scale,
      pixelOffset: new dora.Cesium.Cartesian2(0, -35),
      color: dora.Cesium.Color.fromCssColorString("rgba(255,0,0,1)"),
      show:false
    }
  });
  return ren;
};
export const creatModel = (dora, position, style) => {
  const { color = '#DC143C', pixelSize, uri, scale = 1 } = style;
  let ren = dora.viewer.entities.add({
    name: 'top',
    position: position,
    point: {
      color: dora.Cesium.Color.fromCssColorString(color),
      pixelSize: pixelSize
    },
    model: {
      uri: uri,
      scale: scale
    }
  });
  return ren;
};
export const creatPolyline = (dora, position) => {
  // const { color = '#DC143C', pixelSize, scale } = style;
  let ren = dora.viewer.entities.add({
    polyline: {
      positions: position,
      width: 6,
      material: dora.Cesium.Color.fromCssColorString('rgba(220,20,60, 1)'),
      // material: new dora.Cesium.PolylineTrailMaterialProperty({
      //   color: dora.Cesium.Color.RED.withAlpha(0.9),
      //   trailLength: 0.4,
      //   period: 1.0
      // }),   尾迹线效果
      // material: new dora.Cesium.PolylineGlowMaterialProperty({
      //   glowPower: 0.5,
      //   color: dora.Cesium.Color.BLUE
      // }),  发光线效果
      // material: new dora.Cesium.PolylineOutlineMaterialProperty({
      //   color: dora.Cesium.Color.BLUE,
      //   outlineWidth: 10,
      //   outlineColor: dora.Cesium.Color.RED
      // }),   带轮廓的线
      // material: new dora.Cesium.PolylineArrowMaterialProperty(dora.Cesium.Color.RED),  带箭头的线
      // material: new dora.Cesium.PolylineDashMaterialProperty({
      //   color:dora.Cesium.Color.RED,
      //   gapColor:dora.Cesium.Color.TRANSPARENT,
      //   dashLength:20,
      //   dashPattern:255
      // }),    虚线
      // material: new dora.Cesium.PolylineDashMaterialProperty({
      //   color:dora.Cesium.Color.RED,
      //   gapColor:dora.Cesium.Color.BLUE,
      //   dashLength:100,
      //   dashPattern:2
      // }),    间隔线
      clampToGround: true
    }
  });
  return ren;
};
export const creatPolygon = (dora, position) => {
  // const { color = '#DC143C', pixelSize, scale } = style;
  let ren = dora.viewer.entities.add({
    polygon: {
      hierarchy: position,
      material: dora.Cesium.Color.fromCssColorString('rgba(220,20,60, 1)'),
      clampToGround: true
    }
  });
  return ren;
};
export const createBoxWithImageMaterial = (dora, imageMaterial) => {
  dora.viewer.entities.add({
    id: "test0",
    wall:{
      positions:dora.Cesium.Cartesian3.fromDegreesArrayHeights([112, 40,90, 112.001, 40,90]),
      material:new dora.Cesium.ImageMaterialProperty({image:imageMaterial,transparent:false,repeat: new dora.Cesium.Cartesian2(4, 4)})
    }
    
  });
  dora.viewer.entities.add({
    id: "test1",
    wall:{
      positions:dora.Cesium.Cartesian3.fromDegreesArrayHeights([112.001, 40,90, 112.001, 40.001,90]),
      material:new dora.Cesium.ImageMaterialProperty({image:imageMaterial,color: dora.Cesium.Color.BLUE,transparent:false,repeat: new dora.Cesium.Cartesian2(4, 4)})
    }
  });
  dora.viewer.entities.add({
    id: "test2",
    wall:{
      positions:dora.Cesium.Cartesian3.fromDegreesArrayHeights([112.001, 40.001,90, 112, 40.001,90]),
      material:new dora.Cesium.ImageMaterialProperty({image:imageMaterial,transparent:false,repeat: new dora.Cesium.Cartesian2(4, 4)})
    }
  });
  dora.viewer.entities.add({
    id: "test3",
    wall:{
      positions:dora.Cesium.Cartesian3.fromDegreesArrayHeights([112, 40.001,90, 112, 40,90]),
      material:new dora.Cesium.ImageMaterialProperty({image:imageMaterial,transparent:false,repeat: new dora.Cesium.Cartesian2(4, 4)})
    }
  });
  
  let ren = dora.viewer.entities.add({
    id: "top",
    polygon:{
      hierarchy:dora.Cesium.Cartesian3.fromDegreesArrayHeights([112, 40,90, 112.001, 40,90,112.001, 40.001,90,112, 40.001,90]),
      material:new dora.Cesium.ImageMaterialProperty({image:imageMaterial,transparent:false,repeat: new dora.Cesium.Cartesian2(4, 4)}),
      perPositionHeight:true
    }
  });

  return ren;
}
