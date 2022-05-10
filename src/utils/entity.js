/*
 * @Author: chenxiaoxuan
 * @Date: 2022-03-29 15:14:39
 * @LastEditTime: 2022-05-10 16:30:39
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
//primitive贴地点，sampleTerrainMostDetailed方法实现点位置添加高程实现贴地
export const createPrimitivePoint = (dora) => {
  var cartesian=dora.Cesium.Cartesian3.fromDegrees(100,20)//这里没设置点的高度，也可以设置高度，但不知道该位置的高程，所以需要使用sampleTerrainMostDetailed方法在地形加载出来后，将该点位置赋予高程
	var points = dora.viewer.scene.primitives.add(new dora.Cesium.PointPrimitiveCollection())
	var ellipsoid = dora.viewer.scene.globe.ellipsoid
	let p = ellipsoid.cartesianToCartographic(cartesian)
  let promise = dora.Cesium.sampleTerrainMostDetailed(window.viewer.terrainProvider, [p])
  dora.Cesium.when(promise, function() {
    points.add({
      position: dora.Cesium.Cartographic.toCartesian(p),
      color: dora.Cesium.Color.WHITE,
      pixelSize: 10
    })
  })
};
//primitive贴地线, GroundPolylinePrimitive贴地线
export const createPrimitiveLine = (dora) => {
  let ren = dora.viewer.scene.primitive.add(
    new dora.Cesium.GroundPolylinePrimitive({//贴地primitive线
      geometryInstances: new dora.Cesium.GeometryInstance({
        geometry: new dora.Cesium.GroundPolylineGeometry({//贴地线几何
          positions:dora.Cesium.Cartesian3.fromDegreesArray([90, 28, 100, 28])
        })
      }),
      appearance: new dora.Cesium.PolylineMaterialAppearance({
        material: dora.Cesium.Material.fromType('Color', {
          color: dora.Cesium.Color.RED
        })
      })
    })
  )
  return ren;
};
//GroundPrimitive实现贴地几何形状, CircleGeometry，CorridorGeometry，EllipseGeometry，PolygonGeometry，和RectangleGeometry
export const createPrimitiveGround = (dora) => {
  var primitive = new dora.Cesium.GroundPrimitive({//贴地的primitive
    geometryInstances: new dora.Cesium.GeometryInstance({
      geometry: new dora.Cesium.PolygonGeometry({//支持CircleGeometry，CorridorGeometry，EllipseGeometry，RectangleGeometry
        polygonHierarchy: new dora.Cesium.PolygonHierarchy([
          dora.Cesium.Cartesian3.fromDegreesArray(100,25,100,30,110,30)
        ])
      }),
      attributes: {
        color: dora.Cesium.ColorGeometryInstanceAttribute.fromColor(dora.Cesium.Color.RED)
      }
    }),
    appearance: new dora.Cesium.PerInstanceColorAppearance()
  })
  let ren = dora.viewer.scene.primitives.add(primitive);
  return ren;
};
//ClassificationPrimitive可实现贴地或贴模型，包括BoxGeometry、CylinderGeometry、EllipsoidGeometry、PolylineVolumeGeometry、SphereGeometry几何形状。
export const createPrimitiveClassification = (dora) => {
  dora.viewer.scene.primitives.add(
    new dora.Cesium.ClassificationPrimitive({
      geometryInstances: new dora.Cesium.GeometryInstance({
        geometry: dora.Cesium.BoxGeometry.fromDimensions({
          vertexFormat: dora.Cesium.PerInstanceColorAppearance.VERTEX_FORMAT,
          dimensions: new dora.Cesium.Cartesian3(8.0, 5.0, 8.0),
        }),
        // modelMatrix: modelMatrix,
        attributes: {
          color: dora.Cesium.ColorGeometryInstanceAttribute.fromColor(
            new dora.Cesium.Color(1.0, 0.0, 0.0, 0.5)
          ),
          show: new dora.Cesium.ShowGeometryInstanceAttribute(true),
        },
        id: "volume",
      }),
      classificationType: dora.Cesium.ClassificationType.CESIUM_3D_TILE,
    })
  );
}
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
