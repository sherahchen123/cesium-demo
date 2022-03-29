/*
 * @Author: chenxiaoxuan
 * @Date: 2022-03-29 15:14:39
 * @LastEditTime: 2022-03-29 15:17:18
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
