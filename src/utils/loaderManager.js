import { dora } from './doraManager';
export const getExistedLayer = name => {
  let imgLayers = dora.viewer.imageryLayers._layers;
  const index = imgLayers.findIndex(it => it.name === name);
  if (index > -1) {
    return imgLayers[index];
  } else {
    return null;
  }
};
export const addBILProvider = params => {
  const url = params.url;
  const name = params.name;
  const extent = params.extent;
  if (dora.dora.viewer.terrainProvider !== undefined && dora.dora.viewer.terrainProvider.name === name) {
    return;
  }
  const rec = dora.Cesium.Rectangle.fromDegrees(extent.startX, extent.startY, extent.endX, extent.endY);
  const provider = new dora.Cesium.SCTTerrainProvider({
    urls: [url],
    useConfigFile: false,
    compressType: 'NONE',
    heightmapWidth: 65,
    heightmapHeight: 65,
    rectangles: [rec],
    levels: [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]],
    requestVertexNormals: true
  });
  provider.name = name;
  dora.dora.viewer.terrainProvider = provider;
  return provider;
};
export const addArcGisImageryProvider = params => {
  let layer;
  if (params.tiled) {
    const esri = new dora.Cesium.CGCS2000MapServerImageryProvider({
      url: params.url,
      maximumLevel: params.maximumLevel || 19
    });
    layer = dora.dora.viewer.imageryLayers.addImageryProvider(esri);
  } else {
    const esri = new dora.Cesium.ArcGisMapServerImageryProvider({
      url: params.url,
      layers: params.layers,
      maximumLevel: params.maximumLevel || 19
    });
    layer = dora.viewer.imageryLayers.addImageryProvider(esri);
  }
  layer.layerId = params.layers;
  return layer;
};
export const addWMTSProvider = async params => {
  let layer;
  params.tilesize = 256;
  const provider = new dora.Cesium.WebMapTileServiceImageryProvider({
    name: params.name,
    url: params.url,
    layer: params.layer,
    style: params.style,
    format: params.format,
    tilesize: params.tilesize || 256,
    tileMatrixSetID: params.tileMatrixSetID,
    tileMatrixLabels: params.tileMatrixLabels,
    tilingScheme: params.tilingScheme || new dora.Cesium.GeographicTilingScheme()
  });
  layer = dora.viewer.imageryLayers.addImageryProvider(provider);
  return layer;
};
export const addS3MLayer = async params => {
  let layer;
  const promise = dora.viewer.scene.addS3MTilesLayerByScp(params.url, {
    name: params.name
  });
  layer = await promise.then(function (layer) {
    return layer;
  });
  return layer;
};
export const addS3MLayers = async params => {
  let layers;
  var promise = dora.viewer.scene.open(params.url);
  layers = await promise.then(function (layers) {
    return layers;
  });
  return { layers: layers };
};
export const loadImageItem = async (dora, type, params) => {
  let layer = null;
  let provider = null;
  switch (type) {
    case 'esri-rest':
      layer = addArcGisImageryProvider(params);
      break;
    case 'wmts':
      layer = await addWMTSProvider(params);
      break;
    case 'supermap-rest':
      provider = new dora.Cesium.SuperMapImageryProvider({
        url: params.url
      });
      // 通过影像提供者创建影像图层
      layer = dora.viewer.imageryLayers.addImageryProvider(provider);
      break;
    case 'wmts-xyz':
      provider = new dora.Cesium.UrlTemplateImageryProvider(params);
      layer = dora.viewer.imageryLayers.addImageryProvider(provider);
      break;
    case 'wmts-swsm':
      provider = new dora.Cesium.UrlTemplateImageryProvider({
        url: params.url,
        tilingScheme: new dora.Cesium.WebMercatorTilingScheme()
      });
      layer = dora.viewer.imageryLayers.addImageryProvider(provider);
      break;
    case 'supermap-terrain':
      dora.viewer.terrainProvider;
      provider= new dora.Cesium.dora.CesiumTerrainProvider(params);
      dora.viewer.terrainProvider = provider;
      return provider;
    case 'wmts-bil':
      provider = addBILProvider(params);
      return provider;
    case 'wms':
      provider= new dora.Cesium.WebMapServiceImageryProvider({
        url: params.url,
        layers: params.name
      });
      layer = dora.viewer.imageryLayers.addImageryProvider(provider);
      break;
    case 's3m':
      provider = params.url.split('/')[params.url.split('/').length - 1];
      if (provider == 'realspace') layer = await addS3MLayers(params);
      else layer = await addS3MLayer(params);
      break;
    default:
      break;
  }

  //  else if (type == 'wmts-bil') {
  //     const provider = new  dora.Cesium.UrlTemplateImageryProvider(params);
  //     layer =  dora.viewer.imageryLayers.addImageryProvider(provider);
  // }
  // layer.gamma = 0.66;
  // layer.brightness = 0.95;
  if (type == 's3m') {
    if (layer.layers) {
      layer.layers.map(it => {
        it.visible = params.show;
        it.type = type;
        it.fields = params.fields;
        it.dataName = params.name;
      });
    } else {
      layer.visible = params.show;
    }
  } else {
    layer.show = params.show;
    layer.lodOffset = params.lodOffset || 0.0;
    params.alpha = params.alpha || 100;
    layer.alpha = params.alpha / 100;
    layer.additionParams = params.additionParams;
    layer.fields = params.fields;
    if (!layer.name) {
      layer.name = params.name;
    }
  }
  layer.type = type;
  return layer;
};
export const showLayerByName = layerCfg => {
  let name = layerCfg.name;
  const p = new Promise((resolve, reject) => {
    setTimeout(() => {
      const existed = getExistedLayer(name);
      if (existed) {
        existed.show = true;
        existed.alpha = 1;
        resolve(existed);
      } else {
        let node = layerCfg;
        if (!node) {
          reject(`未找到图层节点:---${name}`);
        }
        const url = node.url;
        const params = {
          url: url,
          tiled: node.metadata.tiled,
          name: name,
          additionParams: node.additionParams,
          show: layerCfg.show == undefined ? true : layerCfg.show,
          alpha: layerCfg.alpha == undefined ? 100 : layerCfg.alpha
        };
        Object.assign(params, node.metadata);
        params.url = url;
        const id = url.split('MapServer/')[1];
        if (id) {
          const temp = '/' + id;
          // 先分离协议,在切割,意外情况:http://10.80.xx..../MapServer/1,/1和/1重复
          const protocol = url.split('//')[0];
          const path = url.split('//')[1];
          const subUrl = path.split(temp)[0];
          params.layers = id;
          params.url = protocol + '//' + subUrl;
        } else {
          params.layers = 0;
        }
        const layer = loadImageItem(dora,node.type, params);
        if (layer && node.type !== 'supermap-terrain' && node.type !== 'sfs-terrain') {
          layer[name] = name;
          resolve(layer);
        }
      }
    }, 200);
  });
  return p;
};
