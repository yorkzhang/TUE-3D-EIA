import axios from 'axios'
import proj4 from 'proj4'
import myTools from './tools'
let map = {};
var nowQueryData = '';
var nowStatus = '';
var plotAnalysisParameter = {};
var operationalPlots = [];
var singlePlotAnalysisFeatures;
var plotSearchGlobal = false;
map.cesium = {
  viewer: null
};
var roadInfo = [];
var landInfo = [];
var interfaceInfo = [];
var metroLandInfo = [];
var metroRoadInfo = [];
/* -------------------------------- cesium初始化 ------------------------------- */
map.initCesium = function () {
  var clock = new Cesium.Clock({
    startTime: Cesium.JulianDate.fromIso8601('2019-05-24T06:00:00Z'),
    currentTime: Cesium.JulianDate.fromIso8601('2019-05-24T06:00:00Z'),
    stopTime: Cesium.JulianDate.fromIso8601('2019-05-24T20:00:00Z'),
    clockRange: Cesium.ClockRange.LOOP_STOP, // loop when we hit the end time
    clockStep: Cesium.ClockStep.SYSTEM_CLOCK_MULTIPLIER,
    multiplier: 9700, // how much time to advance each tick
    shouldAnimate: true // Animation on by default
  });
  let viewer = new Cesium.Viewer("cesiumContainer", {
    navigation: false,
    animation: false,
    timeline: false,
    clockViewModel: new Cesium.ClockViewModel(clock),
    baseLayerPicker: false,
    navigationHelpButton: false,
    geocoder: false,
    fullscreenButton: false,
    vrButton: false,
    sceneModePicker: false,
    infoBox: false,
    scene3DOnly: false,
    homeButton: false,
    selectionIndicator: false,
    terrainShadows: Cesium.ShadowMode.ENABLED,
    contextOptions: {
      webgl: {
        alpha: true,
        //preserveDrawingBuffer: false
        preserveDrawingBuffer: true
      }
    }
  });
  viewer.customInfobox = document.getElementById("bubble");
  viewer._cesiumWidget._creditContainer.style.display = "none";
  map.cesium.viewer = viewer;
  //添加地图底图，并配置渲染参数
  viewer.imageryLayers.add(new Cesium.ImageryLayer(new Cesium.MapboxImageryProvider({
    mapId: 'mapbox.dark',
    accessToken: 'pk.eyJ1IjoibGluc2hpeW91eGlhbmciLCJhIjoiY2sweWxnN2p6MGd1djNncDh0NGJjMXVyMSJ9.oaIz3c43CUJjckoXdc_vfg'
  }), {
    brightness: 0.5,
    contrast: 1,
    hue: 2.7,
    saturation: 10,
  }));
  Cesium.GeoJsonDataSource.clampToGround = true;
  viewer.scene.postProcessStages.fxaa.enabled = true;
  //修改场景效果
  viewer.scene.colorCorrection.show = true;
  viewer.scene.colorCorrection.saturation = 1.5;
  viewer.scene.colorCorrection.brightness = 0.5;
  viewer.scene.colorCorrection.contrast = 1.15;
  // viewer.scene.colorCorrection.hue = 2.7;
  viewer.scene.colorCorrection.hue = 0;

  //关闭/开启泛光
  viewer.scene.bloomEffect.show = true;
  viewer.scene.bloomEffect.threshold = 0.1;
  viewer.scene.bloomEffect.bloomIntensity = 2;
  // viewer.scene.bloomEffect._bloomColor = Cesium.Color.BLUE;
  //相机转圈
  // map.flyCircle();
  //相机视角
  viewer.camera.flyTo({
    destination: new Cesium.Cartesian3(-2386085.596076898, 5388250.714216139, 2441177.5000786586),
    orientation: {
      heading: 6.28317861432646,
      pitch: -0.7870396776018023,
      roll: 0.0
    }
  });
  //点击事件，抛出属性
  viewer.pickEvent.addEventListener(function (feature) {
    let route = ParkVue.$route.name;
    switch (route) {
      case 'layer': // 图层 界面点击
        ParkVue.$emit('on-seartchinfo-click', { feature: feature, type: 'seartchInfo' });
        document.getElementById('bubble').style.display = 'block';
        break;
      case 'seartchInfo': // 查询 界面点击
        ParkVue.$emit('on-seartchinfo-click', { feature: feature, type: 'seartchInfo' });
        document.getElementById('bubble').style.display = 'block';
        break;
      case 'plotAnalysis': // 地块实施性分析 界面点击
        ParkVue.$emit('on-plot-click', { feature: feature, type: 'plotInfo' });
        break;
      case 'metroImpactAnalysis': // 地铁影响分析 界面点击
        ParkVue.$emit('on-metro-click', { feature: feature, type: 'metroInfo' });
        break;
      case 'interfaceAnalysis': // 地铁影响分析 界面点击
        ParkVue.$emit('on-interfaceAnalysis-click', { feature: feature, type: 'interfaceInfo' });
        break;
    }
  });
};

/* --------------------------------- 增加各种图层 --------------------------------- */
//基于本地geojson线文件，添加动态线
map.addDynamicLineByGeojson = function (url, width, height) {
  var viewer = map.cesium.viewer;
  viewer.scene.bloomEffect.show = false;
  axios.get(url).then((res) => {
    res.data.features.forEach(function (feature) {
      var coordinatesAll = [];
      feature.geometry.coordinates.forEach(function (coordinate) {
        coordinatesAll.push([coordinate[0], coordinate[1], height]);
      });
      //数组降维，并倒序，生成 polyline position 坐标
      var coordinatesAllResult = [];
      var coordinatesAllReverseResult = [];
      coordinatesAll.forEach(function (coordinate) {
        coordinatesAllResult.push(coordinate[0], coordinate[1], coordinate[2]);
      });
      coordinatesAll.reverse().forEach(function (coordinate) {
        coordinatesAllReverseResult.push(coordinate[0], coordinate[1], coordinate[2]);
      });
      viewer.entities.add({
        polyline: {
          positions: Cesium.Cartesian3.fromDegreesArrayHeights(coordinatesAllResult),
          width: width,
          hMax: 2,
          material: new Cesium.PolylineDynamicMaterialProperty({
            color: Cesium.Color.fromRandom({
              blue: 0,
              alpha: 1
            }),
          })
        }
      });
      viewer.entities.add({
        polyline: {
          positions: Cesium.Cartesian3.fromDegreesArrayHeights(coordinatesAllReverseResult),
          width: width,
          hMax: 10000,
          material: new Cesium.PolylineDynamicMaterialProperty({
            color: Cesium.Color.fromRandom({
              blue: 0,
              alpha: 1
            }),
          })
        }
      });
    });
  });
};
//基于sql查询后返回的线，添加动态线
map.addDynamicLineByRest = function (options) {
  /* {
    sqlQueryEventArgs: sqlQueryEventArgs,
    edgeFeatures: edgeFeatures,
  } */
  var viewer = map.cesium.viewer;
  viewer.scene.bloomEffect.show = false;
  if (options.singleFeature) {//如下操作仅仅针对于地块分析中添加可运行地块边界线
    var feature = options.singleFeature;
    var coordinatesAll = [];
    var points = feature.geometry.points;
    points.forEach(function (coordinate) {
      if (coordinate.x < 200) {
        //处理4326坐标
        coordinatesAll.push([coordinate.x, coordinate.y, options.height]);
      } else {
        //处理3857坐标
        var latlongitude = proj4('EPSG:3857', 'EPSG:4326', [coordinate.x, coordinate.y])
        coordinatesAll.push([latlongitude[0], latlongitude[1], options.height]);
      }
    })
    var coordinatesAllResult = [];
    coordinatesAll.forEach(function (coordinate) {
      coordinatesAllResult.push(coordinate[0], coordinate[1], coordinate[2]);
    });
    viewer.entities.add({
      polyline: {
        positions: Cesium.Cartesian3.fromDegreesArrayHeights(coordinatesAllResult),
        width: options.width,
        // hMax: 2,
        material: new Cesium.PolylineDashMaterialProperty({
          color: Cesium.Color.fromCssColorString(options.color),
        }),
        clampToGround: true,
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 900)
      }
    });
    viewer.entities.add({
      polyline: {
        positions: Cesium.Cartesian3.fromDegreesArrayHeights(coordinatesAllResult),
        width: options.width,
        hMax: 5000,
        material: new Cesium.PolylineDynamicMaterialProperty({
          color: Cesium.Color.fromCssColorString(options.color),
        }),
        // clampToGround: true,
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 1800)
      }
    });
  } else {
    if (options.sqlQueryEventArgs) {
      var selectedFeatures = options.sqlQueryEventArgs.originResult.features;
    } else if (options.edgeFeatures) {
      var selectedFeatures = options.edgeFeatures;
    }
    selectedFeatures.forEach(function (feature) {
      var coordinatesAll = [];
      var points = feature.geometry.points;
      points.forEach(function (coordinate) {
        if (coordinate.x < 200) {
          //处理4326坐标
          coordinatesAll.push([coordinate.x, coordinate.y, options.height]);
        } else {
          //处理3857坐标
          var latlongitude = proj4('EPSG:3857', 'EPSG:4326', [coordinate.x, coordinate.y])
          coordinatesAll.push([latlongitude[0], latlongitude[1], options.height]);
        }
      })
      var coordinatesAllResult = [];
      coordinatesAll.forEach(function (coordinate) {
        coordinatesAllResult.push(coordinate[0], coordinate[1], coordinate[2]);
      });
      viewer.entities.add({
        polyline: {
          positions: Cesium.Cartesian3.fromDegreesArrayHeights(coordinatesAllResult),
          width: options.width,
          // hMax: 2,
          material: new Cesium.PolylineGlowMaterialProperty({
            glowPower: 0.2,
            color: Cesium.Color.fromCssColorString(options.color),
          }),
          clampToGround: true,
          distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 900)
        }
      });
      viewer.entities.add({
        polyline: {
          positions: Cesium.Cartesian3.fromDegreesArrayHeights(coordinatesAllResult),
          width: options.width,
          hMax: 5000,
          material: new Cesium.PolylineDynamicMaterialProperty({
            color: Cesium.Color.fromCssColorString(options.color),
          }),
          // clampToGround: true,
          distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 1800)
        }
      });
    });
  }

}
//基于sql查询后返回的值，添加点
map.addPointRest = function (feature, height) {
  var viewer = map.cesium.viewer;
  var point = feature.geometry.center;
  var position;
  if (point.x < 200) {
    //处理4326坐标
    position = new Cesium.Cartesian3.fromDegrees(point.x, point.y, height);
  } else {
    //处理3857坐标
    var latlongitude = proj4('EPSG:3857', 'EPSG:4326', [point.x, point.y]);
    position = Cesium.Cartesian3.fromDegrees(latlongitude[0], latlongitude[1], height);
  }
  viewer.entities.add({
    position: position,
    label: {
      scale: 1,
      text: '可运营',
      fillColor: Cesium.Color.fromRandom({
        red: 0,
        alpha: 0.5
      }),
      eyeOffset: new Cesium.Cartesian3(0, 30, 0),
      distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 1700)
    },
    billboard: {
      image: "static/images/icons8-visit-64.png",
      scale: 1,
      distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 1700)
    },
  });
}
//添加s3m图层
map.add3DModel = function (url, options) {
  var viewer = map.cesium.viewer;
  var scene = viewer.scene;
  var Model = scene.open(url);
  Model.then(function (layers) {
    layers.forEach(function (layer) {
      // 设置 layer 渲染效果
      layer.hasLight = false;
      layer.saturation = options.saturation;
      layer.brightness = options.brightness;
      layer.contrast = options.contrast;
      layer.gamma = options.gamma;
      layer.hue = options.hue;
      if (options.queryUrl) {
        if (options.isMerge) {
          layer.setQueryParameter({
            url: options.queryUrl,
            dataSourceName: options.dataSourceName,
            isMerge: true,
            keyword: 'SmID'
          });
        } else {
          layer.setQueryParameter({
            url: options.queryUrl,
            dataSourceName: options.dataSourceName,
            dataSetName: options.dataSetName,
            keyword: 'SmID'
          });
        }
      }
    });
  });
};
map.addPointGeojson = function () {
  var viewer = map.cesium.viewer;
  //增加动态点
  axios.get('source/RarefyResult_1.json').then((res) => {
    res.data.features.forEach(function (feature) {
      var longitude = feature.geometry.coordinates[0];
      var latitude = feature.geometry.coordinates[1];
      var h = feature.properties.TopAltitude_Average;
      //变化率需要结合某个字段进行修改
      var changeRatio = feature.properties.TopAltitude_Average + 50;
      //要显示的文本,需要结合某个字段进行修改
      var text = feature.properties.TopAltitude_Average.toString() + 'kWh';
      //动态位置设置
      var positionProperty = new Cesium.SampledPositionProperty();
      positionProperty.addSample(Cesium.JulianDate.fromIso8601('2019-05-24T06:00:00Z'),
        new Cesium.Cartesian3.fromDegrees(longitude, latitude, h));
      positionProperty.addSample(Cesium.JulianDate.fromIso8601('2019-05-24T20:00:00Z'),
        new Cesium.Cartesian3.fromDegrees(longitude, latitude, h + changeRatio));
      viewer.entities.add({
        position: positionProperty,
        // point: {
        //   pixelSize: 3,
        //   color: Cesium.Color.fromRandom({
        //     red: 0,
        //     alpha: 0.5
        //   }),
        //   outline: false,
        //   // outlineColor: Cesium.Color.AQUA
        // },
        label: {
          scale: 0.3,
          text: text,
          fillColor: Cesium.Color.fromRandom({
            red: 0,
            alpha: 0.5
          }),
        },
        // ellipsoid: {
        //   radii: new Cesium.Cartesian3(10, 10, 10),
        //   fill: false,
        //   outline: true,
        //   outlineColor: new Cesium.Color(feature.properties.PolygonID_Average / 21, 0.5, 1, feature.properties.PolygonID_Average / 21),
        //   slicePartitions: 4,
        //   stackPartitions: 18,
        //   outlineWidth: 3
        // },
        billboard: {
          image: "static/images/icons8-visit-64.png",
          scale: 0.6,
        },
      });
    });
  });
};
map.addPolygon = function (options) {
  var viewer = map.cesium.viewer;
  viewer.scene.bloomEffect.show = false;
  var selectedFeatures = options.edgeFeatures;
  selectedFeatures.forEach(function (feature) {
    var coordinatesAll = [];
    var points = feature.geometry.points;
    points.forEach(function (coordinate) {
      if (coordinate.x < 200) {
        //处理4326坐标
        coordinatesAll.push([coordinate.x, coordinate.y, options.height]);
      } else {
        //处理3857坐标
        var latlongitude = proj4('EPSG:3857', 'EPSG:4326', [coordinate.x, coordinate.y])
        coordinatesAll.push([latlongitude[0], latlongitude[1], options.height]);
      }
    })
    var coordinatesAllResult = [];
    coordinatesAll.forEach(function (coordinate) {
      coordinatesAllResult.push(coordinate[0], coordinate[1], coordinate[2]);
    });
    viewer.entities.add({
      polygon: {
        hierarchy: Cesium.Cartesian3.fromDegreesArrayHeights(coordinatesAllResult),
        material: Cesium.Color.fromRandom({
          red: 1,
          green: 1,
          blue: 0,
          alpha: 0.6
        }),

        perPositionHeight: true,
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 1800)
      }
    });
  });
}

/* --------------------------------- 移除各种图层 --------------------------------- */
//移除s3m图层
map.removeLayer = function (layer) {
  var viewer = map.cesium.viewer;
  var scene = viewer.scene;
  //关闭场景泛光
  viewer.scene.bloomEffect.show = false;
  if (scene.layers.find(layer)) {
    scene.layers.remove(layer)
  }
};
map.removeDataSource = function (datasource) {
  var viewer = map.cesium.viewer;
  viewer.dataSources.remove(viewer.dataSources.get(0), true);
}
map.removeEntity = function () {
  var viewer = map.cesium.viewer;
  viewer.scene.bloomEffect.show = true;
  if (viewer.entities) {
    viewer.entities.removeAll();
  }
};

/* ---------------------------------- sql查询 --------------------------------- */

map.doSqlQuery = function (options) {
  /* {
      name:'查询操作的标识符'
      queryForm:'通过表达式传递过来的查询参数' 
      dataSetName:'要查询的数据集'
    } */
  switch (options.name) {
    case 'informationScreening':
      nowStatus = options.queryForm.STATUS;
      var viewer = map.cesium.viewer;
      map.removeEntity();
      var queryFormTexts = [];
      nowQueryData = options.queryForm.queryDate || '';
      for (let key in options.queryForm) {
        if (options.queryForm[key] && key != 'queryDate' && key != 'STATUS') {
          var queryFormText = key + "='" + options.queryForm[key] + "'";
          queryFormTexts.push(queryFormText);
        }
      }
      var sqlParam = queryFormTexts.join(' AND ');
      sqlParameters(options, sqlParam, map.informationScreening);
      break;
    case 'getPlotSurroundingRoadsIDs':
      singlePlotAnalysisFeatures = options.query.features;
      plotSearchGlobal = false;
      nowQueryData = options.query.queryDate;
      nowStatus = 'finished';
      var sqlParam = "ID=" + options.query.features.ID;//获取地块周围道路的id
      sqlParameters(options, sqlParam, map.getRoadsDetailedInfo);
      break;
    case 'getRoadsDetailedInfo':
      var sqlParam = options.singlePlotAnalysisCallbackQueryArry.join(' OR ');//获取地块周围道路的所有信息
      sqlParameters(options, sqlParam, map.getFinishedRoadCenter);
      break;
    case 'getAllRoadCenter':
      var sqlParam = options.getAllRoadCenter;//获取所有道路要素
      sqlParameters(options, sqlParam, map.getBarrierIds);
      break;
    //执行全局地块网络分析的入口：获取当前时间下所有已完工的道路信息
    case 'getAllRoadCenterByGlobal':
      var sqlParam = 'SMID>0';//获取所有道路要素
      nowQueryData = options.queryData;
      nowStatus = 'finished';
      plotSearchGlobal = true;
      singlePlotAnalysisFeatures = {};
      sqlParameters(options, sqlParam, map.netWorkAnalysisGlobal);
      break;
    case 'getRoadSurroundingsPlotsIds':
      var sqlParamArry = [];
      options.query.forEach(element => {
        var sqlParamArryItem = "road_center_line_ID=" + element;
        sqlParamArry.push(sqlParamArryItem)
      })
      var sqlParam = sqlParamArry.join(' OR ');//获取道路周围地块的ID
      sqlParameters(options, sqlParam, map.getRoadSurroundingsPlotsDetails);
      break;
    case 'getRoadSurroundingsPlotsDetails':
      var sqlParam = options.getRoadSurroundingPlotsDetailedInfoQueryArry.join(' OR ');//获取地块周围道路的所有信息
      sqlParameters(options, sqlParam, map.getPlotsDetailedInfo);
      break;
    //接口分析
    case 'interfaseAnalysis':
      var sqlParam = 'ROAD_NAME=' + "'" + options.queryForm.ROAD_NAME + "'";//获取点击道路对应的接口信息
      sqlParameters(options, sqlParam, map.getInterfaseAnalysisInfo);
      break;
  }
};

/* ------------------------------ 地块分析重构的相关函数----------------------------- */

//获取所有包含全部管网的道路中线、点坐标、id
function filterNullPipe(features) {
  var netAnalyCenters = []; //获取所有满足条件的道路中心线中点坐标
  var featuresIncloudePipe = []; //获取所有满足条件的道路中心线
  var finishedIds = [];//获取所有满足条件的道路中心线id
  features.forEach(element => {
    //所获道路的所有管网信息都不为空
    if (element.fieldValues[15].replace(/(^s*)|(s*$)/g, "").length !== 0 && element.fieldValues[16].replace(/(^s*)|(s*$)/g, "").length !== 0 && element.fieldValues[17].replace(/(^s*)|(s*$)/g, "").length !== 0 && element.fieldValues[18].replace(/(^s*)|(s*$)/g, "").length !== 0 && element.fieldValues[19].replace(/(^s*)|(s*$)/g, "").length !== 0) {
      netAnalyCenters.push({
        [parseInt(element.fieldValues[0])]: element.geometry.center
      });
      featuresIncloudePipe.push(element);
      finishedIds.push(parseInt(element.fieldValues[0]));
    }
  });
  return { netAnalyCenters: netAnalyCenters, featuresIncloudePipe: featuresIncloudePipe, finishedIds: finishedIds };
}
//获取所有道路中线id、已完工id、已完工道路中心点坐标、未完工id
function getAllRoadParameters(queryEventArgs) {
  let allIds = [];//获取所有道路中心线id
  queryEventArgs.originResult.features.forEach(element => {
    allIds.push(parseInt(element.fieldValues[0]));
  });
  //获取已完工且具备所有官网的道路中心线id、全要素和中心点坐标
  let features = checkStatus(queryEventArgs.originResult.features);
  if (features.length != 0) {
    var filterNullPipeResults = filterNullPipe(features);
  } else {
    ParkVue.$Message.error("指定日期内，不存在满足条件的道路");
    return;
  }
  //获取未完工道路中线id
  let unfinishedIds = allIds.filter(function (v) { return filterNullPipeResults.finishedIds.indexOf(v) == -1; });
  return {
    allIds: allIds,
    finishedIds: filterNullPipeResults.finishedIds,
    netAnalyCenters: filterNullPipeResults.netAnalyCenters,
    featuresIncloudePipe: filterNullPipeResults.featuresIncloudePipe,
    unfinishedIds: unfinishedIds
  };
}
function closestFacilityAnalysis(options) {
  operationalPlots = [];
  roadInfo = [];
  landInfo = [];
  options.netAnalyCenters.forEach(element => {
    let finishedId = [];
    finishedId.push(Object.keys(element)[0]);
    let center = Object.values(element)[0]
    let params = {
      event: center,
      facilities: "[{ x: 12677276.6743101, y: 2572237.48947154 },{x:12677349.1383754,y:2572111.59226895},{x:12677443.8095116,y:2571947.11887276},{x:12677605.2060134,y:2571666.0526903},{x:12677883.5369751,y:2571901.55501425},{x:12678030.3120428,y:2572139.00111635},{x:12678136.3245694,y:2572316.12105226},{x:12678245.5274347,y:2572498.57320086}]",
      fromEvent: false,
      maxWeight: 0,
      expectFacilityCount: 1,
      parameter: {
        resultSetting: {
          returnEdgeIDs: true,
          returnNodeIDs: true,
          returnPathGuides: false,
          returnRoutes: false,
          returnEdgeFeatures: true,
          returnEdgeGeometry: true,
          returnNodeFeatures: true,
          returnNodeGeometry: true
        },
        barrierEdgeIDs: options.unfinishedIds,
        weightFieldName: "SmLength"
      }
    };
    axios
      .get(options.netWorkAnalysisAPI, {
        params: params
      })
      .then(res => {

        //打印出地块周边完工的道路id和其详细信息
        // console.log(finishedId[0]);
        options.featuresIncloudePipe.forEach(element => {
          if (element.fieldValues[0] == finishedId[0]) {
            //  地块实施性分析路网表格详情显示内容
            let configObj = {
              'ROAD_NAME': 'ROAD_NAME', // 名称
              'DESIGN_ORG': 'DESIGN_ORG', // 设计院
              'OWNER': 'OWNER' // 运营商
            };
            let indexObj = myTools.getDataIndex(element, configObj);
            let landRow = myTools.pushValue(indexObj, element);
            roadInfo = roadInfo.concat(landRow);
            ParkVue.$emit('get-road-info', roadInfo);
            // console.log(roadInfo);
          }
        });
        //如果不是全局搜索的时候，不需要将那么多的地块加上icon，只需要将单点的地块加上icon
        //获取通往主管路途的道路id，并追加到finishedId
        res.data.facilityPathList[0].edgeFeatures.forEach(element => {
          finishedId.push(element.fieldValues[0])
        });
        //回找可连通到主管的道路边地块，用以统计可运营地块的信息
        map.doSqlQuery({
          name: 'getRoadSurroundingsPlotsIds',
          query: finishedId,
          dataSetName: "PlotJoinRoad"
        })
        map.addDynamicLineByRest({
          edgeFeatures: res.data.facilityPathList[0].edgeFeatures,
          color: "#7CFC00",
          width: 28,
          height: 15
        });
      });
  });
}
//sql查询参数
function sqlParameters(options, sqlParam, callback) {
  var datasetNames = "DataSource:" + options.dataSetName;
  var getFeatureParam, getFeatureBySQLService, getFeatureBySQLParams;
  getFeatureParam = new SuperMap.REST.FilterParameter({
    //后续再考虑需要过滤的字段
    // fields: ["SMID"],
    attributeFilter: sqlParam
  });
  getFeatureBySQLParams = new SuperMap.REST.GetFeaturesBySQLParameters({
    queryParameter: getFeatureParam,
    toIndex: -1,
    datasetNames: [datasetNames]
  });
  var url = 'http://10.209.8.7:8090/iserver/services/data-Scene2-27/rest/data';
  getFeatureBySQLService = new SuperMap.REST.GetFeaturesBySQLService(url, {
    eventListeners: {
      "processCompleted": callback,
      "processFailed": map.processFailed
    }
  });
  getFeatureBySQLService.processAsync(getFeatureBySQLParams);
  return { datasetNames, getFeatureParam, getFeatureBySQLService, getFeatureBySQLParams, url };
}
// 判断当前状态方法
function checkStatus(arr) {
  let temp = [];
  // console.log(arr);
  for (let i = 0; i < arr.length; i++) {
    let row = arr[i];
    let DESIGNIndex = getIndex(row, 'DESIGN');
    let CONSTRUCTIndex = getIndex(row, 'CONSTRUCT');
    let FINISHIndex = getIndex(row, 'FINISH');
    let fieldValuesArr = row.fieldValues;
    if (DESIGNIndex && CONSTRUCTIndex && FINISHIndex) {
      let queryData = formatTime(nowQueryData);
      let designData = formatTime(fieldValuesArr[DESIGNIndex]);
      let constructData = formatTime(fieldValuesArr[CONSTRUCTIndex]);
      let finishData = formatTime(fieldValuesArr[FINISHIndex]);
      if (queryData < designData && nowStatus === 'plan') {
        row.title = '规划阶段';
        temp.push(row);
        continue;
        // } else if (queryData === designData && nowStatus === 'plan') {
        //   row.title = '开始设计';
        //   continue;
      } else if (queryData >= designData && queryData < constructData && nowStatus === 'design') {
        row.title = '设计阶段';
        temp.push(row);
        continue;
        // } else if (queryData === constructData && nowStatus === 'design') {
        //   row.title = '开始施工';
        //   continue;
      } else if (queryData >= constructData && queryData < finishData && nowStatus === 'construction') {
        row.title = '施工阶段';
        temp.push(row);
        continue;
        // } else if (queryData === finishData && nowStatus === 'finished')) {
        //   row.title = '施工完成';
        //   continue;
      } else if (queryData >= finishData && nowStatus === 'finished') {
        row.title = '完工阶段';
        temp.push(row);
        continue;
      }
    }
  }
  if (temp.lenth) {
  } else {
  }
  return temp;
}
// 格式化时间
function formatTime(str) {
  return new Date(str).getTime();
}
// 查找字段的索引值 
function getIndex(row, str) {
  let fieldNames = row.fieldNames || [];
  let fieldValues = row.fieldValues || [];
  for (let m = 0; m < fieldNames.length; m++) {
    if (fieldNames[m] === str) {
      return m;
    }
  }
  return null;
}

/* ------------------------------ 信息筛选板块的sql操作 ------------------------------ */

// 信息筛选版块sql 查询成功之后的操作
map.informationScreening = function (queryEventArgs) {
  var viewer = map.cesium.viewer;
  var scene = viewer.scene;
  if (nowQueryData && nowStatus) {
    var features = checkStatus(queryEventArgs.originResult.features);
    if (features.length === 0) {
      ParkVue.$Message.error("暂无符合条件数据，请修改后重试");
      return;
    }
    queryEventArgs.originResult.features = features;
  }
  map.addDynamicLineByRest({ sqlQueryEventArgs: queryEventArgs, color: '#4169E1', width: 38, height: 15 });
}

/* ------------------------------- 地块分析的sql操作 ------------------------------- */

//获取具体的道路信息
map.getRoadsDetailedInfo = function (queryEventArgs) {
  var plotSurroundingRoadsIds = [];
  queryEventArgs.originResult.features.forEach(element => {
    var roadCenterLineQueryArryItem = 'SMID=' + element.fieldValues[4];
    plotSurroundingRoadsIds.push(roadCenterLineQueryArryItem)
  })
  //基于获取到的道路ID，获取对应的所有道路属性
  map.doSqlQuery({
    name: 'getRoadsDetailedInfo',
    dataSetName: 'road_center_line',
    singlePlotAnalysisCallbackQueryArry: plotSurroundingRoadsIds
  });
}
//对道路信息进行过滤，获取满足条件的道路中心点
map.getFinishedRoadCenter = function (queryEventArgs) {
  let features = checkStatus(queryEventArgs.originResult.features);
  if (features.length != 0) {
    //获取包含所有管线的路网信息
    var filterNullPipeResults = filterNullPipe(features);
    plotAnalysisParameter.netAnalyCenters = filterNullPipeResults.netAnalyCenters;//道路中心线
    if (filterNullPipeResults.featuresIncloudePipe.length != 0) {
      map.addDynamicLineByRest({ edgeFeatures: filterNullPipeResults.featuresIncloudePipe, color: '#4169E1', width: 28, heithg: 15 });
      //查询场景中所有的道路要素
      map.doSqlQuery({
        name: 'getAllRoadCenter',
        dataSetName: 'road_center_line',
        getAllRoadCenter: 'SMID>0'
      });
    } else {
      ParkVue.$Message.error("指定日期内，不存在满足条件的道路");
      return;
    }
  } else {
    ParkVue.$Message.error("指定日期内，不存在满足条件的道路");
    return;
  }
}
//获取道路周围地块
map.getRoadSurroundingsPlotsDetails = function (queryEventArgs) {
  var RoadSurroundingPlotsIds = [];
  queryEventArgs.originResult.features.forEach(element => {
    var RoadSurroundingPlotsIdsItem = 'SMID=' + element.fieldValues[2];
    RoadSurroundingPlotsIds.push(RoadSurroundingPlotsIdsItem)
  })
  //基于获取到的地块ID，获取对应的所有地块属性
  map.doSqlQuery({
    name: 'getRoadSurroundingsPlotsDetails',
    dataSetName: 'plots',
    getRoadSurroundingPlotsDetailedInfoQueryArry: RoadSurroundingPlotsIds
  });
}
map.getPlotsDetailedInfo = function (queryEventArgs) {
  queryEventArgs.originResult.features.forEach(newElement => {
    let oldIds = [];
    operationalPlots.forEach(oldElement => {
      oldIds.push(oldElement.ID);
    });
    if (!oldIds.includes(newElement.ID)) {
      operationalPlots.push(newElement);
      //  地块实施性分析地块表格详情显示内容
      let configObj = {
        "SMAREA": 'SMAREA', // 面积
        'OWNER': 'OWNER' // 地块名
      };
      let indexObj = myTools.getDataIndex(newElement, configObj);
      let landRow = myTools.pushValue(indexObj, newElement);
      landInfo = landInfo.concat(landRow);
      ParkVue.$emit('get-land-info', landInfo)
      if (JSON.stringify(singlePlotAnalysisFeatures) === '{}') {
        map.addDynamicLineByRest({
          singleFeature: newElement,
          color: "#FFFFFF",
          width: 5,
          height: 15
        });
      } else {
        if (newElement.fieldValues[0] == singlePlotAnalysisFeatures.SMID) {
          map.addDynamicLineByRest({
            singleFeature: newElement,
            color: "#FFFFFF",
            width: 5,
            height: 15
          });
        }
      }
    }
  })
}
map.onQueryComplete = function (queryEventArgs) {
  //基于查询的id，对图元的展示样式进行调整
  /* var selectedFeatures = queryEventArgs.originResult.features;
  var Prjids = [];
  selectedFeatures.forEach(function (feature) {
    var SMID = feature.fieldValues[0];
    Prjids.push(parseInt(SMID));
  }); */
};
//获取整个场景中未完工的道路id,并执行路网分析
map.getBarrierIds = function (queryEventArgs) {
  //获取所有已完工的道路中线，取其中心点坐标作为路网分析的起点；获取所有未完工的道路中线，取其道路id作为路障
  let getAllRoadParametersResults = getAllRoadParameters(queryEventArgs);
  //执行网络分析
  closestFacilityAnalysis({
    netWorkAnalysisAPI: 'http://10.209.8.7:8090/iserver/services/transportationAnalyst-Scene2-27/rest/networkanalyst/RoadNetwork@DataSource/closestfacility.rjson',
    netAnalyCenters: plotAnalysisParameter.netAnalyCenters,
    unfinishedIds: getAllRoadParametersResults.unfinishedIds,
    featuresIncloudePipe: getAllRoadParametersResults.featuresIncloudePipe
  });
}
//执行全局地块网络分析
map.netWorkAnalysisGlobal = function (queryEventArgs) {
  //获取所有已完工的道路中线，取其中心点坐标作为路网分析的起点；获取所有未完工的道路中线，取其道路id作为路障
  let getAllRoadParametersResults = getAllRoadParameters(queryEventArgs);
  closestFacilityAnalysis({
    netWorkAnalysisAPI: 'http://10.209.8.7:8090/iserver/services/transportationAnalyst-Scene2-27/rest/networkanalyst/RoadNetwork@DataSource/closestfacility.rjson',
    netAnalyCenters: getAllRoadParametersResults.netAnalyCenters,
    unfinishedIds: getAllRoadParametersResults.unfinishedIds,
    featuresIncloudePipe: getAllRoadParametersResults.featuresIncloudePipe
  });
}
//sql 查询失败之后的操作
map.processFailed = function (queryEventArgs) {
  console.log('失败');
}

//移除查询动作
map.removeQuery = function () {
  var viewer = map.cesium.viewer;
  var scene = viewer.scene;
  viewer.scene.bloomEffect.show = true;
  scene.layers.find("road_center_line@RawData10.18#1").removeAllObjectsOperation();
  scene.layers.find("road_center_line@RawData10.18#1").setSelection([]);
  map.removeEntity();
}

/* --------------------------------- 图层样式控制 --------------------------------- */
//控制是否开启深度拾取
map.swithDepth = function (v) {
  var viewer = map.cesium.viewer;
  viewer.scene.globe.depthTestAgainstTerrain = v;
}
//控制图层显/隐
map.layerVisible = function (layer, visible) {
  var viewer = map.cesium.viewer;
  var scene = viewer.scene;
  if (scene.layers.find(layer)) {
    scene.layers.find(layer).visible = visible;
  }
};
map.layerStyleChange = function (color, alpha) {
  var viewer = map.cesium.viewer;
  var scene = viewer.scene;
  scene.layers.layerQueue.forEach(function (layer) {
    //透明模式
    layer.style3D.fillForeColor = Cesium.Color.fromAlpha(color, alpha);
    //线稿模式，思考在某种场景下使用，Cesium.Color.FORESTGREEN，这种颜色会比较好
    // layer.style3D.fillStyle = Cesium.FillStyle.WireFrame;
    // layer.wireFrameMode = Cesium.WireFrameType.Sketch;
    // layer.style3D.lineWidth = 0.5;
    // layer.style3D.lineColor = Cesium.Color.fromAlpha(color, alpha);
    //页面菜单 tab 切换两次后会报错，后续再优化，待办
    // if (alpha < 1) {
    //   var hyp = new Cesium.HypsometricSetting();
    //   hyp.emissionTextureUrl = "static/images/speedline.jpg";
    //   hyp.emissionTexCoordUSpeed = 1.25;
    //   layer.hypsometricSetting = {
    //     hypsometricSetting: hyp,
    //   };
    // }
  });
};
// 图层操作控制，数据部份还需修改完善
map.layerCtrl = function (layerArr) {
  var viewer = map.cesium.viewer;
  //首先排查场景中已有的 s3m 图层，将该关掉的关掉
  for (var j = viewer.scene.layers._layers._array.length - 1; j >= 0; j--) {
    var s3mLayer = viewer.scene.layers._layers._array[j];
    var shouldLayerOpen = false;
    for (var i = 0; i < layerArr.length; i++) {
      var layerItem = layerArr[i];
      if (layerItem.type == 'S3M' && s3mLayer.name == layerItem.k) {
        shouldLayerOpen = true;
        break;
      }
    }
    if (!shouldLayerOpen) {
      s3mLayer.visible = false;
      s3mLayer.setSelection([]);
    }
  }
  //添加 layerlist.json 中的图层
  layerArr.forEach(layerItem => {
    var isItemChecked = layerItem.checked;
    switch (layerItem.type) {
      case 'S3M':
        //查看新增的图层场景中是否有存在
        var layerOpened = viewer.scene.layers.find(layerItem.k);
        //如果新增的图层已经存在，且可见，则 isLayerOpened 为 true，否则为 false
        var isLayerOpened = layerOpened ?
          (layerOpened.visible ? true : false) :
          false;
        if (isItemChecked != isLayerOpened) {
          if (isItemChecked) {
            if (layerOpened) {
              layerOpened.visible = true;
            } else {
              var promise = viewer.scene.addS3MTilesLayerByScp(layerItem.url, {
                name: layerItem.k
              });
              Cesium.when(promise, function (layer) {
                layer.hasLight = false;
                layer.cullEnabled = false;
                layer.shadowType = 2;
                layer.lodRangeScale = 0.8;
                layer.selectedColor = Cesium.Color.ALICEBLUE.withAlpha(0.9);
                switch (layer._name) {
                  case '前海路网_2d_clip@datasource#1':
                    layer.saturation = 1;
                    layer.brightness = 1;
                    layer.contrast = 1;
                    layer.gamma = 0.25;
                    layer.hue = 5.7;
                    break;
                  case 'plots@RawData10.18#1':
                    layer.saturation = 1;
                    layer.brightness = 1;
                    layer.contrast = 1;
                    layer.gamma = 1;
                    layer.hue = 0;
                    layer.setObjsColor([1, 2, 3, 4, 5, 6, 14], Cesium.Color.fromBytes(221, 0, 0, 255));//红色，综合发展用地（1）
                    layer.setObjsColor([13], Cesium.Color.fromBytes(117, 192, 67, 255));//绿色，公共开放空间（2）
                    layer.setObjsColor([7, 8, 9, 10, 11, 12], Cesium.Color.HONEYDEW);//综合发展用地（5）
                    break;
                  case 'RoadBuffer@RawData10.18':
                    layer.saturation = 0.6;
                    layer.brightness = 0.9;
                    layer.contrast = 1.1;
                    layer.gamma = 0.2;
                    layer.hue = 2.4;
                    break;
                  default:
                    layer.saturation = 1;
                    layer.brightness = 1.5;
                    layer.contrast = 1;
                    layer.gamma = 0.8;
                    layer.hue = 0;
                    break;
                }
                if (layerItem.queryDataset) {
                  if (layerItem.queryDataset.isMerge) {
                    layer.setQueryParameter({
                      url: layerItem.queryDataset.url,
                      dataSourceName: layerItem.queryDataset.dataSourceName,
                      isMerge: true
                    });
                  } else {
                    layer.setQueryParameter({
                      url: layerItem.queryDataset.url,
                      dataSourceName: layerItem.queryDataset.dataSourceName,
                      dataSetName: layerItem.queryDataset.dataSetName,
                      keyWord: layerItem.queryDataset.keyWord
                    });
                  }
                  layer.queryService = {
                    workspace: layerItem.queryDataset.workspace,
                    datasource: layerItem.queryDataset.dataSourceName,
                    dataset: layerItem.queryDataset.dataSetName
                  };
                }
              }, function (e) {
                console.warn(e);
              });
            }
          } else {
            if (layerOpened) {
              layerOpened.visible = false;
              s3mLayer.setSelection([]);
            }
          }
        }
        break;
      default:
        ; /// ???
        break;
    }
  });
}
//切换底图
map.baseMapSwitch = function (v) {
  var viewer = map.cesium.viewer;
  var baseLayer = viewer.imageryLayers.get(1);
  if (v == 'dark') {
    viewer.imageryLayers.add(new Cesium.ImageryLayer(new Cesium.MapboxImageryProvider({
      mapId: 'mapbox.dark',
      accessToken: 'pk.eyJ1IjoibGluc2hpeW91eGlhbmciLCJhIjoiY2sweWxnN2p6MGd1djNncDh0NGJjMXVyMSJ9.oaIz3c43CUJjckoXdc_vfg'
    }), {
      brightness: 0.5,
      contrast: 1,
      hue: 2.7,
      saturation: 10,
    }));
  } else {
    viewer.imageryLayers.addImageryProvider(new Cesium.MapboxImageryProvider({
      mapId: 'mapbox.satellite',
      accessToken: 'pk.eyJ1IjoibGluc2hpeW91eGlhbmciLCJhIjoiY2sweWxnN2p6MGd1djNncDh0NGJjMXVyMSJ9.oaIz3c43CUJjckoXdc_vfg'
    }), 1);
  }
  // 移除之前的图层
  viewer.imageryLayers.remove(baseLayer);
  // 
  // var value = $(this).val();
  // var baseLayer = viewer.imageryLayers.get(1);
  // //添加新的 Mapbox 底图
  // viewer.imageryLayers.addImageryProvider(new Cesium.MapboxImageryProvider({
  //   mapId: 'mapbox.' + value,
  //   accessToken: 'pk.eyJ1IjoibGluc2hpeW91eGlhbmciLCJhIjoiY2sweWxnN2p6MGd1djNncDh0NGJjMXVyMSJ9.oaIz3c43CUJjckoXdc_vfg'
  // }), 1);
  // // 移除之前的图层
  // viewer.imageryLayers.remove(baseLayer);
}
//提升画质
map.improveResolution = function (v) {
  var viewer = map.cesium.viewer;
  viewer.resolutionScale = v;
}
/* ---------------------------------- 各种动画 ---------------------------------- */

map.flyCircle = function () {
  var viewer = map.cesium.viewer;
  viewer.camera.flyCircle(Cesium.Cartesian3.fromDegrees(113.8867652376022, 22.50562771197648, 10));
  viewer.camera.flyCircleLoop = true;
};
map.viewerTrackedEntity = function () {
  var viewer = map.cesium.viewer;
  //不起作用，奇怪
  console.log(viewer.entities);
  console.log(viewer.entities.values);
  viewer.trackedEntity = viewer.entities.getById('3');
};
map.scanEffect = function () {
  var viewer = map.cesium.viewer;
  var scene = viewer.scene;
  console.log(viewer.camera.heading + ',' + viewer.camera.pitch + ',' + viewer.camera.position);
  //设置场景扫描效果
  scene.scanEffect.color = new Cesium.Color(0.0, 1.0, 1.0, 1);
  scene.scanEffect.period = 3.0;
  scene.scanEffect.centerPostion = new Cesium.Cartesian3(1106936.5154699301, -4341506.694622221, 4540918.7666527005);
  scene.scanEffect.show = true;
  scene.scanEffect.mode = Cesium.ScanEffectMode.CIRCLE;
};
map.switchCamera = function (x, y, z, h, p, x_1, y_1, z_1, h_1, p_1) {
  var viewer = map.cesium.viewer;
  viewer.scene.camera.flyTo({
    destination: new Cesium.Cartesian3(x, y, z),
    orientation: {
      heading: h,
      pitch: p,
    },
    duration: 1.5,
    complete: function () {
      setTimeout(function () {
        viewer.scene.camera.flyTo({
          destination: new Cesium.Cartesian3(x_1, y_1, z_1),
          orientation: {
            heading: h_1,
            pitch: p_1
          },
          duration: 1
        });
      }, 500);
    }
  });
};
map.generateCurve = function (startPoint, endPoint) {
  var viewer = map.cesium.viewer;
  let addPointCartesian = new Cesium.Cartesian3();
  Cesium.Cartesian3.add(startPoint, endPoint, addPointCartesian);
  let midPointCartesian = new Cesium.Cartesian3();
  Cesium.Cartesian3.divideByScalar(addPointCartesian, 2, midPointCartesian);
  let midPointCartographic = Cesium.Cartographic.fromCartesian(midPointCartesian);
  midPointCartographic.height = Cesium.Cartesian3.distance(startPoint, endPoint) / 10;
  let midPoint = new Cesium.Cartesian3();
  Cesium.Ellipsoid.WGS84.cartographicToCartesian(midPointCartographic, midPoint);
  let spline = new Cesium.CatmullRomSpline({
    times: [0.0, 0.5, 1.0],
    points: [startPoint, midPoint, endPoint]
  });
  let curvePointsArr = [];
  for (let i = 0, len = 300; i < len; i++) {
    curvePointsArr.push(spline.evaluate(i / len));
  }
  return curvePointsArr;
};
map.addCzml = function (url) {
  var viewer = map.cesium.viewer;
  axios.get(url).then((res) => {
    var czml = [
      {
        "id": "document",
        "name": "CZML Polygon - Interpolating References",
        "version": "1.0",
        "clock": {
          "interval": "2019-05-24T06:00:00Z/2019-05-24T20:00:00Z",
          "currentTime": "2019-05-24T06:00:00Z",
          "multiplier": 9700
        }
      },
      {
        "id": "Origin",
        "position": {
          "interpolationAlgorithm": "LINEAR",
          "interpolationDegree": 1,
          "interval": "2019-05-24T06:00:00Z/2019-05-24T20:00:00Z",
          "epoch": "2019-05-24T06:00:00Z",
          "cartographicDegrees": [
            -75.6930668530362,
            45.3840263267455,
            10,
          ]
        }
      }
    ];
    res.data.features.forEach(function (feature) {
      if (feature.properties.BusStationPeopleNum) {
        var busStation = {
          "id": "BusStation" + feature.properties.StatisticsObjNum,
          "name": "BusStation" + feature.properties.StatisticsObjNum,
          "description": "BusStation" + feature.properties.StatisticsObjNum,
          "availability": "2019-05-24T06:00:00Z/2019-05-24T20:00:00Z",
          label: {
            text: "待客人数: " + feature.properties.BusStationPeopleNum,
            font: '20px Georgia',
            scale: 0.8,
            style: 'FILL',
            showBackground: false,
            eyeOffset: { cartesian: [0, 20, 0] },
            fillColor: {
              rgbaf: [0, 1, 1, 1]
            },
            distanceDisplayCondition: { distanceDisplayCondition: [10, 1200] },
          },
          billboard: {
            image: "static/images/architecture-and-city.png",
            scale: 0.08,
            color: {
              rgbaf: [1, 1, 1, 1]
            },
            eyeOffset: { cartesian: [0, 10, 0] },
            distanceDisplayCondition: { distanceDisplayCondition: [10, 1200] },
          },
          ellipsoid: {
            radii: {
              epoch: "2019-05-24T00:00:00Z",
              cartesian: [0, 0.0, 0.0, 0.0, 50400, feature.properties.BusStationPeopleNum + 5, feature.properties.BusStationPeopleNum + 5, 0.0]
            },
            fill: false,
            outline: true,
            outlineColor: {
              rgbaf: [0, 1, 0, 0.8]
            },
            slicePartitions: 4,
            stackPartitions: 18,
            outlineWidth: 30
          },
          //飞起
          ellipse: {
            extrudedHeight: {
              epoch: "2019-05-24T06:00:00Z",
              number: [
                0,
                1,
                50400,
                10,
              ]
            },
            height: {
              epoch: "2019-05-24T06:00:00Z",
              number: [
                0,
                1,
                50400,
                10,
              ]
            },
            fill: false,
            semiMajorAxis: {
              epoch: "2019-05-24T06:00:00Z",
              number: [
                0,
                0,
                50400,
                20,
              ]
            },
            semiMinorAxis: {
              epoch: "2019-05-24T06:00:00Z",
              number: [
                0,
                0,
                50400,
                20,
              ]
            },
            fill: true,
            material: {
              image: {
                image: "static/images/circle2.jpg",
                transparent: true,
                color: {
                  epoch: "2019-05-24T06:00:00Z",
                  rgbaf: [
                    0,
                    0,
                    1,
                    0,
                    1,
                    50400,
                    0,
                    1,
                    0,
                    0
                  ]
                },
              }
            },
          },
          //动态柱
          cylinder: {
            length: {
              epoch: "2019-05-24T06:00:00Z",
              number: [
                0,
                1,
                50400,
                20,
              ]
            },
            topRadius: {
              epoch: "2019-05-24T06:00:00Z",
              number: [
                0,
                0,
                50400,
                0.2,
              ]
            },
            bottomRadius: 0,
            fill: true,
            material: {
              image: {
                image: "static/images/circle2.jpg",
                transparent: true,
                color: {
                  epoch: "2019-05-24T06:00:00Z",
                  rgbaf: [
                    0,
                    0,
                    1,
                    0,
                    1,
                    50400,
                    0,
                    1,
                    0,
                    0
                  ]
                },
              }
            },
            numberOfVerticalLines: 3,
            outline: false,
          },
          position: {
            cartographicDegrees: [feature.geometry.coordinates[0], feature.geometry.coordinates[1], 1,]
          }
        };
        czml.push(busStation);
      } else {
        var bikeStation = {
          "id": "bikeStation" + feature.properties.StatisticsObjNum,
          "name": "bikeStation" + feature.properties.StatisticsObjNum,
          "description": "bikeStation" + feature.properties.StatisticsObjNum,
          "availability": "2019-05-24T06:00:00Z/2019-05-24T20:00:00Z",
          label: {
            text: "空闲单车数量: " + feature.properties.BikeStationPeopleNum,
            font: '20px Georgia',
            scale: 0.8,
            style: 'FILL',
            showBackground: false,
            eyeOffset: { cartesian: [0, 20, 0] },
            fillColor: {
              rgbaf: [0, 1, 1, 1]
            },
            distanceDisplayCondition: { distanceDisplayCondition: [10, 1200] },
          },
          billboard: {
            image: "static/images/bike-parking.png",
            scale: 0.1,
            color: {
              rgbaf: [1, 1, 1, 1]
            },
            eyeOffset: { cartesian: [0, 10, 0] },
            distanceDisplayCondition: { distanceDisplayCondition: [10, 1200] },
          },
          ellipsoid: {
            radii: {
              epoch: "2019-05-24T00:00:00Z",
              cartesian: [0, 0.0, 0.0, 0.0, 50400, feature.properties.BikeStationPeopleNum + 5, feature.properties.BikeStationPeopleNum + 5, 0.0]
            },
            fill: false,
            outline: true,
            outlineColor: {
              rgbaf: [0, 1, 1, 1]
            },
            slicePartitions: 4,
            stackPartitions: 18,
            outlineWidth: 30
          },
          //飞起
          ellipse: {
            extrudedHeight: {
              epoch: "2019-05-24T06:00:00Z",
              number: [
                0,
                1,
                50400,
                10,
              ]
            },
            height: {
              epoch: "2019-05-24T06:00:00Z",
              number: [
                0,
                1,
                50400,
                10,
              ]
            },
            fill: false,
            semiMajorAxis: {
              epoch: "2019-05-24T06:00:00Z",
              number: [
                0,
                0,
                50400,
                20,
              ]
            },
            semiMinorAxis: {
              epoch: "2019-05-24T06:00:00Z",
              number: [
                0,
                0,
                50400,
                20,
              ]
            },
            fill: true,
            material: {
              image: {
                image: "static/images/circle2.jpg",
                transparent: true,
                color: {
                  epoch: "2019-05-24T06:00:00Z",
                  rgbaf: [
                    0,
                    0,
                    1,
                    1,
                    1,
                    50400,
                    0,
                    1,
                    1,
                    0
                  ]
                },
              }
            },
          },
          //动态柱
          cylinder: {
            length: {
              epoch: "2019-05-24T06:00:00Z",
              number: [
                0,
                1,
                50400,
                20,
              ]
            },
            topRadius: {
              epoch: "2019-05-24T06:00:00Z",
              number: [
                0,
                0,
                50400,
                0.5,
              ]
            },
            bottomRadius: 0,
            fill: true,
            material: {
              image: {
                image: "static/images/circle2.jpg",
                transparent: true,
                color: {
                  epoch: "2019-05-24T06:00:00Z",
                  rgbaf: [
                    0,
                    0,
                    1,
                    1,
                    1,
                    50400,
                    0,
                    1,
                    1,
                    0
                  ]
                },
              }
            },
            numberOfVerticalLines: 3,
            outline: false,
          },
          position: {
            cartographicDegrees: [feature.geometry.coordinates[0], feature.geometry.coordinates[1], 1,]
          }
        };
        czml.push(bikeStation);
      }
    });
    viewer.dataSources.add(Cesium.CzmlDataSource.load(czml));
  })
};
map.addPark = function () {
  var viewer = map.cesium.viewer;
  //开启场景泛光
  // viewer.scene.bloomEffect.show = true;
  //增加动态点
  map.addCzml('source/BusPark.json');
  //增加 OD 线
  map.addODLine('source/BusPark.json', Cesium.Cartesian3.fromDegrees(-75.6930668530362, 45.3840263267455, 0));
  map.addODLine('source/BusPark.json', Cesium.Cartesian3.fromDegrees(-75.6986071482575, 45.3824697334931, 0));
  map.addODLine('source/BusPark.json', Cesium.Cartesian3.fromDegrees(-75.6952458892499, 45.3874448014314, 0));
};
map.addODLine = function (url, startPt) {
  var viewer = map.cesium.viewer;
  axios.get(url).then((res) => {
    res.data.features.forEach(function (feature) {
      let endPt = Cesium.Cartesian3.fromDegrees(feature.geometry.coordinates[0], feature.geometry.coordinates[1], 0);
      let curLinePointsArr = map.generateCurve(startPt, endPt);
      viewer.entities.add({ // 背景线
        description: 'background-line',
        polyline: {
          width: 2,
          positions: curLinePointsArr,
          material: new Cesium.PolylineDynamicMaterialProperty({
            color: Cesium.Color.fromRandom(),
            glowPower: 0.25,
            taperPower: 0.3
          })
        }
      });
      // viewer.entities.add({ // 尾迹线
      //   description: 'trail-line',
      //   polyline: {
      //     width: 3,
      //     positions: curLinePointsArr,
      //     material: new Cesium.PolylineTrailMaterialProperty({ // 尾迹线材质
      //       color: Cesium.Color.fromCssColorString("rgba(118, 233, 241, 1.0)"),
      //       trailLength: 0.1,
      //       period: feature.properties.StatisticsObjNum
      //     })
      //   }
      // });
    });
  })
};
map.zoomToLayer = function (layerInfo) {
  var viewer = this.cesium.viewer;
  switch (layerInfo.type) {
    case 'S3M':
      // Find whether the primitive is there
      var layers = viewer.scene.layers._layers._array;
      for (var i = 0; i < layers.length; i++) {
        var layer = layers[i];
        if (layer.name == layerInfo.k) {
          viewer.flyTo(layer);
          break;
        }
      }
      break;
    case 'KML':
      var dataSources = viewer.dataSources._dataSources;
      for (var l = 0; l < dataSources.length; l++) {
        var dataSource = dataSources[l];
        if (dataSource.fileName == layerInfo.k) {
          viewer.flyTo(dataSource);
          break;
        }
      }
      break;
    case 'GEOJSON':
      var gLayer = map.geojsonLayers.getLayer(layerInfo.k);
      if (gLayer)
        gLayer.flyTo();
      break;
  }
}

/* --------------------------------- 地铁影响分析 --------------------------------- */
map.metroSingleBuffer = function (params) {
  //是否完工判断，并弹出指示信息
  nowQueryData = params.queryDate || '';
  let queryData = formatTime(nowQueryData);
  let features = params.features;
  let metroInfo = [];
  if (features.SMID) {//判断是单击查询还是全局查询，全局查询的params.features是空值
    metroInfo[0] = { status: 'UNFinish', features: features };
    if (features.FINISH) {//判断FINISH字段是否为空
      let finishData = formatTime(features.FINISH);
      if (queryData >= finishData) {
        metroInfo[0].status = 'Finish';
        //console.log('已建成');//将地铁已建成的指示信息在左侧栏展示；
      }
    }
    // 将数据发送至页面
    ParkVue.$emit('get-metro-info', metroInfo);
  } else {
    //遍历SuberwayBuffer的数据集，提取每一条地铁的完工时间，然后进行是否完工判断
    axios.get('http://10.209.8.7:8090/iserver/services/data-SuberwayBuffer/rest/data/datasources/DataSource/datasets/SuberwayBuffer/features.rjson').then((res) => {
      // metroInfo  
      let childUriList = res && res.data && res.data.childUriList ? res.data.childUriList : [];
      let num = 0;
      let childNum = childUriList.length;
      for (let index = 0; index < childUriList.length; index = index + 2) {
        const element = res.data.childUriList[index];
        axios.get(element + '.rjson').then((res) => {
          let itemObj = res && res.data ? res.data : {};
          num = num + 2;
          let fieldValues = itemObj.fieldValues || [];
          let FINISHIndex = getIndex(itemObj, 'FINISH');
          let subwayIndex = getIndex(itemObj, 'SUBWAY_ID');
          let features = { SUBWAY_ID: fieldValues[subwayIndex] };
          let row = { status: 'UNFinish', features: features }; // 默认为未建成
          if (fieldValues[FINISHIndex]) {//判断FINISH字段是否为空
            let finishData = formatTime(fieldValues[FINISHIndex]);
            if (queryData >= finishData) {
              //console.log(fieldValues[subwayIndex]);//地铁名
              console.log('已建成');//将地铁已建成的指示信息在左侧栏展示，并将地铁名标志出来，
              row.status = "Finish";
            }
          }
          metroInfo.push(row);
          if (num === childNum) {
            // 将数据发送至页面
            ParkVue.$emit('get-metro-info', metroInfo);
          }
        })
      }
    })
  }


  //对点击不同的要素进行不同距离的缓冲区分析
  switch (params.features.BUFFERRADIUSLEFT) {
    case '1.0':
      map.bufferAnalysis('http://10.209.8.7:8090/iserver/services/spatialAnalysis-SuberwayBuffer/restjsr/spatialanalyst/datasets/SuberwayBuffer%40DataSource/buffer', 9, params, '#FF1493');
      map.bufferAnalysis('http://10.209.8.7:8090/iserver/services/spatialAnalysis-SuberwayBuffer/restjsr/spatialanalyst/datasets/SuberwayBuffer%40DataSource/buffer', 56, params, '#00FFFF');
      break;
    case '7.0':
      map.bufferAnalysis('http://10.209.8.7:8090/iserver/services/spatialAnalysis-SuberwayBuffer/restjsr/spatialanalyst/datasets/SuberwayBuffer%40DataSource/buffer', 3, params, '#FF1493');
      map.bufferAnalysis('http://10.209.8.7:8090/iserver/services/spatialAnalysis-SuberwayBuffer/restjsr/spatialanalyst/datasets/SuberwayBuffer%40DataSource/buffer', 50, params, '#00FFFF');
      break;
    default:
      map.bufferAnalysis('http://10.209.8.7:8090/iserver/services/spatialAnalysis-SuberwayBuffer/restjsr/spatialanalyst/datasets/SuberwayBuffer%40DataSource/buffer', 9, params, '#FF1493');
      map.bufferAnalysis('http://10.209.8.7:8090/iserver/services/spatialAnalysis-SuberwayBuffer/restjsr/spatialanalyst/datasets/SuberwayBuffer%40DataSource/buffer', 56, params, '#00FFFF');
      break;
  }
}
//缓冲区分析
map.bufferAnalysis = function (url, distance, params, Color) {
  map.removeEntity();
  var filterQueryParameter, isUnionparameter;
  // 清空全局数据 
  // metroLandInfo.splice(0, metroLandInfo.length);
  // metroRoadInfo.splice(0, metroRoadInfo.length);

  //通过params.features.SMID条件判断是单击查询还是全局查询
  if (params.features.SMID) {
    filterQueryParameter = {
      "attributeFilter": "",
      "ids": [
        params.features.SMID
      ]
    };
    isUnionparameter = false;
  } else {
    filterQueryParameter = {
      "attributeFilter": "",
      "ids": [2, 4]
    };
    isUnionparameter = true;
  }
  axios.post(url + '.rjson', {
    isAttributeRetained: true,
    isUnion: isUnionparameter,
    bufferAnalystParameter: {
      endType: "ROUND",
      semicircleLineSegment: 4,
      leftDistance: {
        value: distance
      },
      rightDistance: {
        value: distance
      },
      radiusUnit: "METER"
    },
    filterQueryParameter: filterQueryParameter,
    dataReturnOption: {
      dataReturnMode: "RECORDSET_ONLY",
      expectCount: 100,
      deleteExistResultDataset: true
    }
  })
    .then(function (response) {
      axios.get(response.data.newResourceLocation + '.rjson').then((res) => {
        map.overlayAnalysis('http://10.209.8.7:8090/iserver/services/spatialAnalysis-Scene2-27/restjsr/spatialanalyst/datasets/plots%40DataSource/overlay', res.data.recordset.features, ["id", "Owner"], '#5225E8')
        map.overlayAnalysis('http://10.209.8.7:8090/iserver/services/spatialAnalysis-Scene2-27/restjsr/spatialanalyst/datasets/road_center_line%40DataSource/overlay', res.data.recordset.features, ["road_name", "Owner"], '#5225E8')
        map.addPolygon({ edgeFeatures: res.data.recordset.features, height: 10 });
      })

    })
    .catch(function (error) {
      console.log(error);
    });
};
//叠加分析
map.overlayAnalysis = function (url, operateRegions, sourceDatasetFields, lineColor) {
  var operateRegionsArry = [];
  var sourceDatasetFields = sourceDatasetFields;//要保留的原数据集中的字段
  operateRegions.forEach(element => {
    operateRegionsArry.push(element.geometry);
  });
  axios.post(url + '.rjson',
    {
      "operateRegions": operateRegionsArry,
      "operation": "INTERSECT",
      "tolerance": 0,
      "sourceDatasetFilter": {
        "attributeFilter": ""
      },
      "sourceDatasetFields": sourceDatasetFields,
      "dataReturnOption": {
        "dataReturnMode": "RECORDSET_ONLY",
        "expectCount": 1000,
        "deleteExistResultDataset": true
      }
    }
  )
    .then(function (response) {
      axios.get(response.data.newResourceLocation + '.rjson').then((res) => {
        //叠加分析的结果  @少帅 已添加数据展示
        let features = res.data.recordset.features;
        if (features && features[0] && features[0].fieldNames) {
          let fieldNames = features[0].fieldNames;
          let str = JSON.stringify(fieldNames);
          if (str.indexOf('road_name') != -1) {
            //  地铁影响分析 路网表格数据
            let configObj = {
              'road_name': 'road_name', // 名称
              //'DESIGN_ORG': 'DESIGN_ORG', // 设计院
              'Owner': 'Owner' // 运营商
            };
            let indexObj = myTools.getDataIndex(features[0], configObj);
            for (let i = 0; i < features.length; i++) {
              let landRow = myTools.pushValue(indexObj, features[i]);
              metroRoadInfo = metroRoadInfo.concat(landRow);
            }
            ParkVue.$emit('get-metro-road-info', metroRoadInfo);
            console.log('road')
          } else if (str.indexOf('SmArea') != -1) {
            //  地铁影响分析 地块表格数据
            let landConfigObj = {
              'SmArea': 'SmArea', // 名称
              'Owner': 'Owner' // 面积
            };
            let landIndexObj = myTools.getDataIndex(features[0], landConfigObj);
            for (let i = 0; i < features.length; i++) {
              let landRow = myTools.pushValue(landIndexObj, features[i]);
              metroLandInfo = metroLandInfo.concat(landRow);
            }
            ParkVue.$emit('get-metro-land-info', metroLandInfo);
            // console.log('land');
          }
        }
        // console.log(res.data.recordset.features);
        // map.addDynamicLineByRest({ edgeFeatures: res.data.recordset.features, color: lineColor, width: 13, height: 20 });
      })

    })
    .catch(function (error) {
      console.log(error);
    });
}

/* ---------------------------------- 接口管理 ---------------------------------- */
//查询到的接口信息
map.getInterfaseAnalysisInfo = function (queryEventArgs) {
  interfaceInfo = [];
  if (queryEventArgs.originResult.features.length != 0) {
    queryEventArgs.originResult.features.forEach(element => {
      //  这里目前只显示了一级目录要展示的数据，还有一些字段需要在二级目录实现，请xr完成，  xr已完成
      let configObj = {
        '对接项目': '对接项目',
        '接口类型': '接口类型',
        '重要性': '重要性',
        '接口闭合情况': '接口闭合情况',
        '接口事项描述': '接口事项描述',
        '相关专业': '相关专业',
        '设计牵头单位': '设计牵头单位',
        '主要配合单位': '主要配合单位',
        '协调情况': '协调情况',
        '落实情况': '落实情况',
        '相关资料': '相关资料'
      };
      let indexObj = myTools.getDataIndex(element, configObj);
      let interfaceRow = myTools.pushValue(indexObj, element);
      interfaceInfo = interfaceInfo.concat(interfaceRow);
    });
    ParkVue.$emit('get-interface-info', interfaceInfo);
  } else {
    ParkVue.$emit('get-interface-info', interfaceInfo);
  }

}
export default map;