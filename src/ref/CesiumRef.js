Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2OGI2NGQ3ZC1lYmQzLTQxNDYtYjIxYy0zN2NkZjdiMDNhNTQiLCJpZCI6ODU5Niwic2NvcGVzIjpbImFzciIsImdjIl0sImlhdCI6MTU1MjM1OTM3Mn0.MMU5lQiXOBZcqphgON3S4AIUmH3c7By1fzjlIzrjHqc';
var clock = new Cesium.Clock({
  startTime: Cesium.JulianDate.fromIso8601('2020-07-05T00:00:00Z'),
  currentTime: Cesium.JulianDate.fromIso8601('2020-07-05T03:00:00Z'),
  stopTime: Cesium.JulianDate.fromIso8601('2020-07-06T00:00:00Z'),
  clockRange: Cesium.ClockRange.LOOP_STOP, // loop when we hit the end time
  clockStep: Cesium.ClockStep.SYSTEM_CLOCK_MULTIPLIER,
  multiplier: 1, // how much time to advance each tick
  shouldAnimate: true // Animation on by default
});
var viewer = new Cesium.Viewer('cesiumContainer', {
  animation: false,
  timeline: false,
  baseLayerPicker: false,
  fullscreenButton: false,
  clockViewModel: new Cesium.ClockViewModel(clock),
  geocoder: false,
  homeButton: false,
  sceneModePicker: false,
  selectionIndicator: false,
  navigationHelpButton: false,
  shadows: true,
  imageryProvider: false,
  // imageryProvider: new Cesium.IonImageryProvider({ assetId: 3954 }),//哨兵数据，免费量比较多，可以商业使用
  terrainProvider: new Cesium.CesiumTerrainProvider({
    url: './CesiumLab/dem/',
    requestVertexNormals: true,//是否请求法线（用于光照效果）
    requestWaterMask: true//是否请求水面标志位（用于水面特效）
  })
});

/* -------------------------------- inspector ------------------------------- */
// viewer.extend(Cesium.viewerCesiumInspectorMixin);//针对于非3dtiles的inspector
// viewer.extend(Cesium.viewerCesium3DTilesInspectorMixin);
/* --------------------------------- 场景光影配置 --------------------------------- */
var scene = viewer.scene;
//##阴影
viewer.shadowMap.enabled = false;
// // 阴影模式
// viewer.shadowMap.darkness = 0.5
// viewer.shadowMap.softShadows = false;
// viewer.shadowMap.maximumDistance = 1000;
// //调节阴影
// $('#shadow').click(function (evt) {
//   viewer.shadowMap.enabled = this.checked;
// });
// $("#darkness").on("input change", function () {
//   viewer.shadowMap.darkness = parseFloat(this.value);
// }); 
//##大气层
viewer.scene.globe.enableLighting = true;
viewer.scene.globe.dynamicAtmosphereLighting = true;
viewer.scene.globe.dynamicAtmosphereLightingFromSun = true;
//##太阳光
// viewer.scene.light = new Cesium.SunLight({
//   intensity: 1,
// });
//##射向维港的光线
// var flashlight = new Cesium.DirectionalLight({
//   direction: new Cesium.Cartesian3(0.8331365527725131, 0.11837158037156814, -0.5402514723669627),
//   // color: Cesium.Color.fromCssColorString('#deca7c'),
//   intensity: 1
// });
// $("#lightIntensity").on("input change", function () {
//   flashlight.intensity = parseFloat(this.value);
// });
// viewer.scene.light = flashlight;
// ##自定义光源
var flashlight = new Cesium.DirectionalLight({
  direction: viewer.scene.camera.directionWC,// Updated every frame
  // color: Cesium.Color.fromCssColorString('#deca7c'),
  intensity: 1
});
$("#lightIntensity").on("input change", function () {
  flashlight.intensity = parseFloat(this.value);
});
viewer.scene.light = flashlight;
scene.preRender.addEventListener(function (scene, time) {
  scene.light.direction = Cesium.Cartesian3.clone(scene.camera.directionWC, scene.light.direction);
})
//##深度检测
viewer.scene.globe.depthTestAgainstTerrain = true;
//##提高分辨率
viewer.scene.postProcessStages.fxaa.enabled = true;
$('#HR').click(function (evt) {
  if (this.checked) {
    viewer.resolutionScale = 2;
  } else {
    viewer.resolutionScale = 1;
  }
});
//##调节HDR
viewer.scene.highDynamicRange = false;
$('#HDR').click(function (evt) {
  viewer.scene.highDynamicRange = this.checked;
});
//##bloom
var bloom = viewer.scene.postProcessStages.bloom;
bloom.enabled = true;
bloom.uniforms.glowOnly = false;
bloom.uniforms.brightness = -0.4;
bloom.uniforms.contrast = 117;
bloom.uniforms.delta = 1.3;
bloom.uniforms.sigma = 3.1;
bloom.uniforms.stepSize = -0.1;
// bloom.uniforms.brightness = parseFloat($("#valueOne").val());
// bloom.uniforms.contrast = parseFloat($("#valueTwo").val());
// bloom.uniforms.delta = parseFloat($("#valueThree").val());
// bloom.uniforms.sigma = parseFloat($("#valueFour").val());
// bloom.uniforms.stepSize = parseFloat($("#valueFive").val());
$('#checkOne').click(function (evt) {
  bloom.enabled = this.checked;
});
$('#checkTwo').click(function (evt) {
  bloom.uniforms.glowOnly = this.checked;
});
$("#valueOne").on("input change", function () {
  bloom.uniforms.brightness = parseFloat(this.value);
});
$("#valueTwo").on("input change", function () {
  bloom.uniforms.contrast = parseFloat(this.value);
});
$("#valueThree").on("input change", function () {
  bloom.uniforms.delta = parseFloat(this.value);
});
$("#valueFour").on("input change", function () {
  bloom.uniforms.sigma = parseFloat(this.value);
});
$("#valueFive").on("input change", function () {
  bloom.uniforms.stepSize = parseFloat(this.value);
});
/* ---------------------------------- 底图切换 ---------------------------------- */
viewer.imageryLayers.remove(viewer.imageryLayers.get(0));
viewer.imageryLayers.add(new Cesium.ImageryLayer(new Cesium.MapboxImageryProvider({
  mapId: 'mapbox.satellite',
  accessToken: 'pk.eyJ1IjoibGluc2hpeW91eGlhbmciLCJhIjoiY2sweWxnN2p6MGd1djNncDh0NGJjMXVyMSJ9.oaIz3c43CUJjckoXdc_vfg'
}), {
  brightness: 1.2,
  // contrast: 1,
  // hue: 2.7,
  // saturation: 10,
}));

// viewer.imageryLayers.add(new Cesium.ImageryLayer(new Cesium.MapboxImageryProvider({
//   mapId: 'mapbox.dark',
//   accessToken: 'pk.eyJ1IjoibGluc2hpeW91eGlhbmciLCJhIjoiY2sweWxnN2p6MGd1djNncDh0NGJjMXVyMSJ9.oaIz3c43CUJjckoXdc_vfg'
// }), {
//   brightness: 0.8,
//   contrast: 1,
//   hue: 2.7,
//   saturation: 10,
// }));
var apikey = '584b2fa686f14ba283874318b3b8d6b0'
$('#basemapSelect').change(function () {
  bloom.enabled = false;
  var value = $(this).val();
  var baseLayer = viewer.imageryLayers.get(0);
  console.log(value);
  switch (value) {
    case 'carto.light':
      bloom.enabled = false;
      viewer.shadowMap.enabled = true;
      if (viewer.dataSources.contains(buildingDayDatasource)) {
      } else {
        viewer.dataSources.remove(buildingNightDatasource)
        viewer.dataSources.remove(nightOnlyDatasource);
        // viewer.dataSources.add(buildingDayDatasource)
        // viewer.dataSources.add(treeEntities);
      }
      viewer.imageryLayers.add(new Cesium.ImageryLayer(new Cesium.UrlTemplateImageryProvider({
        url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
        maximumLevel: 19,
        credit: 'Map from Lands Department'
      }), {
        brightness: 1,
        contrast: 2.1,
        hue: 0,
        saturation: 2.7,
        gamma: 0.09
      }));
      break;
    case 'mapbox.streets':
      bloom.enabled = false;
      // viewer.shadowMap.enabled = true;
      // if (viewer.dataSources.contains(buildingDayDatasource)) {
      // } else {
      //   viewer.dataSources.remove(buildingNightDatasource)
      //   viewer.dataSources.remove(nightOnlyDatasource);
      //   viewer.dataSources.add(buildingDayDatasource)
      //   viewer.dataSources.add(treeEntities);
      // }
      viewer.imageryLayers.add(new Cesium.ImageryLayer(new Cesium.MapboxImageryProvider({
        mapId: 'mapbox.streets',
        accessToken: 'pk.eyJ1IjoibGluc2hpeW91eGlhbmciLCJhIjoiY2sweWxnN2p6MGd1djNncDh0NGJjMXVyMSJ9.oaIz3c43CUJjckoXdc_vfg'
      })));
      break;
    case 'mapbox.dark':
      //增加bloom效果
      bloom.enabled = true;
      viewer.shadowMap.enabled = false;
      if (viewer.dataSources.contains(buildingNightDatasource)) {
        console.log('contain night')
      } else {
        viewer.dataSources.remove(buildingDayDatasource)
        viewer.dataSources.add(buildingNightDatasource)
        viewer.dataSources.add(nightOnlyDatasource);
        viewer.dataSources.remove(treeEntities);
      }
      bloom.uniforms.brightness = -0.3;
      //增加光源
      viewer.imageryLayers.add(new Cesium.ImageryLayer(new Cesium.MapboxImageryProvider({
        mapId: 'mapbox.dark',
        accessToken: 'pk.eyJ1IjoibGluc2hpeW91eGlhbmciLCJhIjoiY2sweWxnN2p6MGd1djNncDh0NGJjMXVyMSJ9.oaIz3c43CUJjckoXdc_vfg'
      }), {
        brightness: 0.8,
        contrast: 1,
        hue: 2.7,
        saturation: 10,
      }));
      break;
    case 'mapbox.outdoors':
      bloom.enabled = false;
      viewer.shadowMap.enabled = true;
      if (viewer.dataSources.contains(buildingDayDatasource)) {
      } else {
        viewer.dataSources.remove(buildingNightDatasource)
        viewer.dataSources.remove(nightOnlyDatasource);
        viewer.dataSources.add(buildingDayDatasource)
        viewer.dataSources.add(treeEntities);
      }
      viewer.imageryLayers.add(new Cesium.ImageryLayer(new Cesium.MapboxImageryProvider({
        mapId: 'mapbox.outdoors',
        accessToken: 'pk.eyJ1IjoibGluc2hpeW91eGlhbmciLCJhIjoiY2sweWxnN2p6MGd1djNncDh0NGJjMXVyMSJ9.oaIz3c43CUJjckoXdc_vfg'
      })));
      break;
    case 'LandsD.light':
      bloom.enabled = false;
      viewer.shadowMap.enabled = true;
      if (viewer.dataSources.contains(buildingDayDatasource)) {
      } else {
        viewer.dataSources.remove(buildingNightDatasource)
        viewer.dataSources.remove(nightOnlyDatasource);
        viewer.dataSources.add(buildingDayDatasource)
        viewer.dataSources.add(treeEntities);
      }
      viewer.imageryLayers.add(new Cesium.ImageryLayer(new Cesium.UrlTemplateImageryProvider({
        url: 'https://api.hkmapservice.gov.hk/osm/xyz/basemap/WGS84/tile/{z}/{x}/{y}.png?key=' + apikey,
        maximumLevel: 19,
        credit: 'Map from Lands Department'
      }), {
        brightness: 1,
        contrast: 1,
        hue: 0,
        saturation: 2.4,
        gamma: 0.7
      }));
      break;
    case 'LandsD.dark':
      //增加bloom效果
      bloom.enabled = true;
      viewer.shadowMap.enabled = false;
      if (viewer.dataSources.contains(buildingNightDatasource)) {
        console.log('contain night')
      } else {
        viewer.dataSources.remove(buildingDayDatasource)
        viewer.dataSources.add(buildingNightDatasource)
        viewer.dataSources.add(nightOnlyDatasource);
        viewer.dataSources.remove(treeEntities);
      }
      bloom.uniforms.brightness = -0.1;
      viewer.imageryLayers.add(new Cesium.ImageryLayer(new Cesium.UrlTemplateImageryProvider({
        url: 'https://api.hkmapservice.gov.hk/osm/xyz/basemap/GS/WGS84/tile/{z}/{x}/{y}.png?key=' + apikey,
        maximumLevel: 19,
        credit: 'Map from Lands Department'
      }), {
        brightness: 1,
        contrast: 1,
        saturation: 2.2,
        gamma: 0.02,
        hue: 1,
      }));
      break;
    default:
      break;
  }
  viewer.imageryLayers.remove(baseLayer);
});
//##底图参数修改ui
$("#saturation").on("input change", function () {
  viewer.imageryLayers.get(0).saturation = parseFloat(this.value);
});
$("#brightness").on("input change", function () {
  viewer.imageryLayers.get(0).brightness = parseFloat(this.value);
});
$("#contrast").on("input change", function () {
  viewer.imageryLayers.get(0).contrast = parseFloat(this.value);
});
$("#gamma").on("input change", function () {
  viewer.imageryLayers.get(0).gamma = parseFloat(this.value);
});
$("#hue").on("input change", function () {
  viewer.imageryLayers.get(0).hue = parseFloat(this.value);
});

/* ----------------------------- 增加各种 entity 数据 ----------------------------- */
//##添加 geojson 建筑数据
var buildingDayDatasource = new Cesium.CustomDataSource('buildingDay')
var buildingNightDatasource = new Cesium.CustomDataSource('buildingNight')
var nightOnlyDatasource = new Cesium.CustomDataSource('nightOnlyDatasource')
var buildingWallPromise = $.getJSON('./source/HongKongBuilding3D.json');
buildingWallPromise.then(function (geojson) {
  geojson.features.forEach(function (feature) {
    function recursion(obj) {//获取多维数组下的所有元素，我在网上搜索的，看的不是太懂
      if (typeof obj === 'object') {
        for (var j in obj) {
          if (typeof obj[j] !== 'object') {
            arrGoup.push(obj[j]);
            continue;
          }
          recursion(obj[j]);
        }
      } else {
        arrGoup.push(obj);
      }
      return arrGoup;
    }
    var arrGoup = [];
    var coordinatesAll = [];
    recursion(feature.geometry.coordinates);
    for (let index = 0; index < arrGoup.length; index = index + 2) {//这一串是为了将上述获得的坐标中插入高度值
      let longitude = arrGoup[index];
      let latitude = arrGoup[index + 1];
      var height = feature.properties.Z;
      coordinatesAll.push(longitude);
      coordinatesAll.push(latitude);
      coordinatesAll.push(height);
    }
    buildingNightDatasource.entities.add({
      name: parseInt(feature.properties.height).toFixed(0) + ' meter',
      wall: {
        positions: Cesium.Cartesian3.fromDegreesArrayHeights(coordinatesAll),
        material: new Cesium.ImageMaterialProperty({
          transparent: false,
          image: "./images/darkLiMianTest.jpg"
        }),
        shadows: Cesium.ShadowMode.ENABLED,
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 4000)
      },
      polygon: {
        hierarchy: Cesium.Cartesian3.fromDegreesArrayHeights(coordinatesAll),
        perPositionHeight: true,
        material: new Cesium.ImageMaterialProperty({
          transparent: true,
          color: Cesium.Color.fromRandom({
            red: 0.5,
            green: 0.5,
            blue: 0.5,
            alpha: 1
          }),
          image: "./images/limian2.jpg"
        }),
        shadows: Cesium.ShadowMode.ENABLED,
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 4000)
      }
    });
    buildingDayDatasource.entities.add({
      name: parseInt(feature.properties.height).toFixed(0) + ' meter',
      wall: {
        positions: Cesium.Cartesian3.fromDegreesArrayHeights(coordinatesAll),
        material: Cesium.Color.LIGHTSTEELBLUE,
        shadows: Cesium.ShadowMode.ENABLED,
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 4000)
      },
      polygon: {
        hierarchy: Cesium.Cartesian3.fromDegreesArrayHeights(coordinatesAll),
        perPositionHeight: true,
        material: new Cesium.ImageMaterialProperty({
          transparent: true,
          color: Cesium.Color.LIGHTSTEELBLUE,
        }),
        shadows: Cesium.ShadowMode.ENABLED,
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 4000)
      }
    })
  })
});
// viewer.dataSourceDisplay.dataSources.add(buildingNightDatasource)
//##五栋建筑
var buildingPoint = $.getJSON('./source/buildingPoint.json');
buildingPoint.then(function (geojson) {
  geojson.features.forEach(function (feature) {
    //增加 OD 曲线
    function generateCurve(startPoint, endPoint) {
      let addPointCartesian = new Cesium.Cartesian3();
      Cesium.Cartesian3.add(startPoint, endPoint, addPointCartesian);
      let midPointCartesian = new Cesium.Cartesian3();
      Cesium.Cartesian3.divideByScalar(addPointCartesian, 2, midPointCartesian);
      let midPointCartographic = Cesium.Cartographic.fromCartesian(midPointCartesian);
      midPointCartographic.height = Cesium.Cartesian3.distance(startPoint, endPoint) / 15;
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
    }
    let startPt = Cesium.Cartesian3.fromDegrees(114.203069, 22.325014, 0);
    let endPt = Cesium.Cartesian3.fromDegrees(feature.geometry.coordinates[0], feature.geometry.coordinates[1], 0);
    let curLinePointsArr = generateCurve(startPt, endPt);
    nightOnlyDatasource.entities.add({ // 背景线
      description: 'background-line',
      polyline: {
        width: 25,
        positions: curLinePointsArr,
        material: new Cesium.PolylineGlowMaterialProperty({
          color: Cesium.Color.fromRandom(),
          glowPower: 0.25,
          taperPower: 0.5
        }),
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 3900)
      }
    });
    //白天黑夜都要显示的建筑模型与建筑label
    nightOnlyDatasource.entities.add({
      position: Cesium.Cartesian3.fromDegrees(feature.geometry.coordinates[0], feature.geometry.coordinates[1], 0),
      name: feature.properties.Name,
      label: {
        text: "[" + feature.properties.Name + "]",
        font: '20px Georgia',
        scale: 1,
        style: 'FILL',
        showBackground: false,
        eyeOffset: new Cesium.Cartesian3(15, 300, 15),
        fillColor: Cesium.Color.fromRandom({
          red: 0,
          green: 1,
          blue: 1,
          alpha: 1
        }),
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 6000),
      },
      model: {
        uri: './gltf/3/scene.gltf',
        scale: 0.02,
        // lightColor: new Cesium.Cartesian3(30, 30, 30),
        // imageBasedLightingFactor: new Cesium.Cartesian2(0, 1)
      }
    });
    //动态旋转参数
    var rotation = Cesium.Math.toRadians(30);
    function getRotationValue() {
      rotation += 0.05;
      return rotation;
    }
    var rotationReverse = Cesium.Math.toRadians(30);
    function getRotationReverseValue() {
      rotationReverse += -0.05;
      return rotationReverse;
    }
    //ellipse半径参数
    var ellipseR = 1;
    function getEllipseRValue() {
      if (ellipseR > 300) {
        ellipseR = 1;
      } else {
        ellipseR += 2;
      }
      return ellipseR
    }
    nightOnlyDatasource.entities.add({
      position: Cesium.Cartesian3.fromDegrees(feature.geometry.coordinates[0], feature.geometry.coordinates[1], 100),
      name: feature.properties.Name,
      ellipse: {
        semiMinorAxis: new Cesium.CallbackProperty(getEllipseRValue, false),
        semiMajorAxis: new Cesium.CallbackProperty(getEllipseRValue, false),
        material: new Cesium.ImageMaterialProperty({
          image: "./images/11 (1).jpg",
          transparent: false,
          color: Cesium.Color.fromRandom({
            alpha: 0.6
          })
        }),
        rotation: new Cesium.CallbackProperty(getRotationValue, false),
        stRotation: new Cesium.CallbackProperty(getRotationValue, false),
      },
    })
    //ellipsoid默认值
    var ellipsoidH = 100;
    var radii = new Cesium.Cartesian3(100, 100, 100);
    nightOnlyDatasource.entities.add({
      position: Cesium.Cartesian3.fromDegrees(feature.geometry.coordinates[0], feature.geometry.coordinates[1], 100),
      name: feature.properties.Name,
      ellipsoid: {
        radii: new Cesium.CallbackProperty(function () {
          if (ellipsoidH > 1000) {
            radii = new Cesium.Cartesian3(100, 100, 100);
            ellipsoidH = 100
          } else {
            Cesium.Cartesian3.add(radii, new Cesium.Cartesian3(0, 0, 10), radii)
            ellipsoidH += 10
          }
          return radii
        }, false),
        fill: false,
        outline: true,
        outlineColor: Cesium.Color.fromRandom({
          red: 0,
          green: 1,
          blue: 1,
          alpha: 1
        }),
        slicePartitions: 4,
        stackPartitions: 18,
        outlineWidth: 130,
        shadows: Cesium.ShadowMode.ENABLED,
        // distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 6000),
      },
      ellipse: {
        semiMinorAxis: 300,
        semiMajorAxis: 300,
        material: new Cesium.ImageMaterialProperty({
          image: "./images/11 (1).jpg",
          transparent: false,
          color: Cesium.Color.fromRandom({
            alpha: 0.6
          })
        }),
        rotation: new Cesium.CallbackProperty(getRotationReverseValue, false),
        stRotation: new Cesium.CallbackProperty(getRotationReverseValue, false),
      },
    })
    //billboard 默认值
    var billboardH = 0;
    var billboardPosition = Cesium.Cartesian3.fromDegrees(feature.geometry.coordinates[0], feature.geometry.coordinates[1], 0);
    nightOnlyDatasource.entities.add({
      position: new Cesium.CallbackProperty(function () {
        if (billboardH > 1000) {
          billboardPosition = Cesium.Cartesian3.fromDegrees(feature.geometry.coordinates[0], feature.geometry.coordinates[1], 0);
          billboardH = 0
        } else {
          billboardPosition = Cesium.Cartesian3.fromDegrees(feature.geometry.coordinates[0], feature.geometry.coordinates[1], billboardH);
          billboardH += 100
        }
        return billboardPosition
      }, false),
      billboard: {
        image: './images/fly.png',
        show: true,
        eyeOffset: new Cesium.Cartesian3(0.0, 500.0, 0.0),
        scale: 1,
        color: Cesium.Color.fromRandom({
          alpha: 0.6
        }),
        // rotation: new Cesium.CallbackProperty(getRotationValue, false),
        // scaleByDistance: new Cesium.NearFarScalar(1000, 1, 5000, 0.1),
        // distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 6000),
      },
    })

  });
})
//##tree
var treeEntities = new Cesium.CustomDataSource('treeEntities')
var treePoint = $.getJSON('./source/Tree.json');
treePoint.then(function (geojson) {
  geojson.features.forEach(function (feature) {
    treeEntities.entities.add({
      name: 'flower',
      position: Cesium.Cartesian3.fromDegrees(feature.geometry.coordinates[0], feature.geometry.coordinates[1], 0),
      model: {
        uri: './gltf/set_5_023/scene.gltf',
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 4000),
        scale: 0.5,
        lightColor: new Cesium.Cartesian3(10, 10, 10),
        // imageBasedLightingFactor: new Cesium.Cartesian2(199.0, 19.0)
      }
    });
  })
})
//##添加building缓冲区周围线
var buildingBufferLine = $.getJSON('./source/BuildingBuffer.json');
buildingBufferLine.then(function (geojson) {
  geojson.features.forEach(function (feature) {
    nightOnlyDatasource.entities.add({
      polyline: {
        positions: Cesium.Cartesian3.fromDegreesArrayHeights([feature.geometry.coordinates[0], feature.geometry.coordinates[1], 1000, feature.geometry.coordinates[0], feature.geometry.coordinates[1], -50]),
        width: 55,
        material: new Cesium.PolylineGlowMaterialProperty({
          glowPower: 0.8,
          taperPower: 0.01,
          color: Cesium.Color.fromRandom({
            // minimumBlue: 0.5,
            alpha: 0.8
          })
        })
      }
    });
  })
})
//##添加路网底网
var roadPromise = $.getJSON('./source/railways.json');
roadPromise.then(function (geojson) {
  geojson.features.forEach(function (feature) {
    function recursion(obj) {//获取多维数组下的所有元素，我在网上搜索的，看的不是太懂
      if (typeof obj === 'object') {
        for (var j in obj) {
          if (typeof obj[j] !== 'object') {
            arrGoup.push(obj[j]);
            continue;
          }
          recursion(obj[j]);
        }
      } else {
        arrGoup.push(obj);
      }
      return arrGoup;
    }
    var arrGoup = [];
    var coordinatesAll = [];
    recursion(feature.geometry.coordinates);
    for (let index = 0; index < arrGoup.length; index = index + 2) {//这一串是为了将上述获得的坐标中插入高度值
      let longitude = arrGoup[index];
      let latitude = arrGoup[index + 1];
      coordinatesAll.push(longitude);
      coordinatesAll.push(latitude);
      coordinatesAll.push(3);
    }
    nightOnlyDatasource.entities.add({
      polyline: {
        positions: Cesium.Cartesian3.fromDegreesArrayHeights(coordinatesAll),
        width: 33,
        material: new Cesium.ImageMaterialProperty({
          image: "./images/line3.png",
          transparent: false,
          color: Cesium.Color.fromRandom({
            alpha: 0.6
          })
        }),
        // clampToGround: true,//开启之后会很卡
        classificationType: Cesium.ClassificationType.TERRAIN,
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 4000)
      }
    });
  })
})
//##添加动态路网
var dynamicRailways = $.getJSON('./source/railways.json');
dynamicRailways.then(function (geojson) {
  geojson.features.forEach(function (feature) {
    var coordinatesAll = [];
    feature.geometry.coordinates.forEach(function (coordinate) {
      var longitude = coordinate[0];
      var latitude = coordinate[1];
      var height = 25;
      coordinatesAll.push(longitude);
      coordinatesAll.push(latitude);
      coordinatesAll.push(height);
      return coordinatesAll;
    });
    var i = 0;
    var nextPoint = [coordinatesAll[0], coordinatesAll[1], coordinatesAll[2]];
    nightOnlyDatasource.entities.add({
      polyline: {
        positions: new Cesium.CallbackProperty(function (time, result) {//属性变更回调
          i += 3;
          if (i == coordinatesAll.length) {
            i = 0;
            nextPoint = [coordinatesAll[0], coordinatesAll[1], coordinatesAll[2]];
          }
          nextPoint.push(coordinatesAll[i], coordinatesAll[i + 1], coordinatesAll[i + 2]);
          return Cesium.Cartesian3.fromDegreesArrayHeights(nextPoint, Cesium.Ellipsoid.WGS84);
        }, false),
        width: 23,
        material: new Cesium.ImageMaterialProperty({
          image: "./images/line3.png",
          transparent: false,
          color: Cesium.Color.fromRandom({
            alpha: 0.6
          })
        }),
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 4000),
        // clampToGround: true,
        classificationType: Cesium.ClassificationType.TERRAIN
      }
    });
  })
});
// viewer.dataSources.add(nightOnlyDatasource);
//##Taikoo entity

var TaikooNightOnlyDatasource = new Cesium.CustomDataSource('TaikooNightOnlyDatasource')
var TaikooBuildingPoint = $.getJSON('./source/TaiKooBuilding_Point.json');
TaikooBuildingPoint.then(function (geojson) {
  geojson.features.forEach(function (feature) {
    //billboard 默认值
    var billboardH = 0;
    var billboardPosition = Cesium.Cartesian3.fromDegrees(feature.geometry.coordinates[0], feature.geometry.coordinates[1], 0);
    TaikooNightOnlyDatasource.entities.add({
      position: new Cesium.CallbackProperty(function () {
        if (billboardH > 500) {
          billboardPosition = Cesium.Cartesian3.fromDegrees(feature.geometry.coordinates[0], feature.geometry.coordinates[1], 20);
          billboardH = 0
        } else {
          // Cesium.Cartesian3.add(billboardPosition, new Cesium.Cartesian3(0.0, 10.0, 0.0), billboardPosition)
          billboardPosition = Cesium.Cartesian3.fromDegrees(feature.geometry.coordinates[0], feature.geometry.coordinates[1], billboardH);
          billboardH += feature.properties.Z_Average / 2
        }
        return billboardPosition
      }, false),
      billboard: {
        image: './images/fly.png',
        show: true,
        eyeOffset: new Cesium.Cartesian3(0.0, 10.0, 0.0),
        scale: 1,
        color: Cesium.Color.fromRandom({
          alpha: 0.6
        }),
        // rotation: new Cesium.CallbackProperty(getRotationValue, false),
        // scaleByDistance: new Cesium.NearFarScalar(1000, 1, 5000, 0.1),
        // distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 6000),
      },
    })

  });
})
//##添加TaiKoo路网底网
var TaikooRoadPromise = $.getJSON('./source/TaikooRoadEasy.json');
TaikooRoadPromise.then(function (geojson) {
  geojson.features.forEach(function (feature) {
    function recursion(obj) {//获取多维数组下的所有元素，我在网上搜索的，看的不是太懂
      if (typeof obj === 'object') {
        for (var j in obj) {
          if (typeof obj[j] !== 'object') {
            arrGoup.push(obj[j]);
            continue;
          }
          recursion(obj[j]);
        }
      } else {
        arrGoup.push(obj);
      }
      return arrGoup;
    }
    var arrGoup = [];
    var coordinatesAll = [];
    recursion(feature.geometry.coordinates);
    for (let index = 0; index < arrGoup.length; index = index + 2) {//这一串是为了将上述获得的坐标中插入高度值
      let longitude = arrGoup[index];
      let latitude = arrGoup[index + 1];
      coordinatesAll.push(longitude);
      coordinatesAll.push(latitude);
      coordinatesAll.push(3);
    }
    TaikooNightOnlyDatasource.entities.add({
      polyline: {
        positions: Cesium.Cartesian3.fromDegreesArrayHeights(coordinatesAll),
        width: 33,
        material: new Cesium.ImageMaterialProperty({
          image: "./images/line3.png",
          transparent: false,
          color: Cesium.Color.fromRandom({
            alpha: 0.6
          })
        }),
        // clampToGround: true,//开启之后会很卡
        classificationType: Cesium.ClassificationType.TERRAIN,
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 4000)
      }
    });
  })
})
//##添加Taikoo动态路网
var TaikooDynamicRailways = $.getJSON('./source/TaikooRoadEasy.json');//此时路网要矢量重采样，减少线的总结点数，否则动画效果不明显
TaikooDynamicRailways.then(function (geojson) {
  geojson.features.forEach(function (feature) {
    var coordinatesAll = [];
    feature.geometry.coordinates.forEach(function (coordinate) {
      var longitude = coordinate[0];
      var latitude = coordinate[1];
      var height = 5;
      coordinatesAll.push(longitude);
      coordinatesAll.push(latitude);
      coordinatesAll.push(height);
      return coordinatesAll;
    });
    var i = 0;
    var nextPoint = [coordinatesAll[0], coordinatesAll[1], coordinatesAll[2]];
    TaikooNightOnlyDatasource.entities.add({
      polyline: {
        positions: new Cesium.CallbackProperty(function (time, result) {//属性变更回调
          i += 3;
          if (i == coordinatesAll.length) {
            i = 0;
            nextPoint = [coordinatesAll[0], coordinatesAll[1], coordinatesAll[2]];
          }
          nextPoint.push(coordinatesAll[i], coordinatesAll[i + 1], coordinatesAll[i + 2]);
          return Cesium.Cartesian3.fromDegreesArrayHeights(nextPoint, Cesium.Ellipsoid.WGS84);
        }, false),
        width: 23,
        material: new Cesium.ImageMaterialProperty({
          image: "./images/line3.png",
          transparent: false,
          color: Cesium.Color.fromRandom({
            alpha: 0.6
          })
        }),
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 4000),
        // clampToGround: true,
        classificationType: Cesium.ClassificationType.TERRAIN
      }
    });
  })
});
//##Taikoo车模
var TaikooCar = $.getJSON('./source/TaikooRoad.json');//此时的道路网要做平滑处理，保证车模运行轨迹的平滑
TaikooCar.then(function (res) {
  res.features.forEach(function (feature) {
    var coordinatesAll = [];
    feature.geometry.coordinates.forEach(function (coordinate) {
      var longitude = coordinate[0];
      var latitude = coordinate[1];
      var height = 0;
      coordinatesAll.push(longitude);
      coordinatesAll.push(latitude);
      coordinatesAll.push(height);
      return coordinatesAll;
    });
    var i = 0;
    var nextPoint = [coordinatesAll[0], coordinatesAll[1], coordinatesAll[2]];

    var position = new Cesium.CallbackProperty(function (time, result) {//属性变更回调
      i += 3;
      if (i == coordinatesAll.length) {
        i = 0;
        nextPoint = [coordinatesAll[0], coordinatesAll[1], coordinatesAll[2]];
      }
      nextPoint = [coordinatesAll[i], coordinatesAll[i + 1], coordinatesAll[2]];
      return Cesium.Cartesian3.fromDegrees(nextPoint[0], nextPoint[1], nextPoint[2]);
    }, false);
    var orientation = new Cesium.VelocityOrientationProperty(position)
    TaikooNightOnlyDatasource.entities.add({
      orientation: orientation,
      position: position,
      model: {
        uri: "./gltf/paz_bus/scene.gltf",
        scale: 4,
      },
      // heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND//好像不起作用
    });
  });
})
/* --------------------------------- 3dtiles -------------------------------- */
//模型
// var HKTileset = viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
//   url: './CesiumLab/HKBuildingAll2/tileset.json',
//   luminanceAtZenith: 0.1,
//   // lightColor: new Cesium.Cartesian3(1.0, 1.0, 1),
// }));
// //模型中心点
// var tempHKLongitude = 114.13934;
// var tempHKLatitude = 22.51484;
// var tempHKHeight = 910;
// HKTileset.readyPromise.then(function (tileset) {
//   var center = Cesium.Cartesian3.fromDegrees(tempHKLongitude, tempHKLatitude, tempHKHeight);
//   var modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(center);
//   tileset._root.transform = modelMatrix;
//   /* // 模型配准UI
//   var viewModel = {
//     height: tempHKHeight,
//     longitude: tempHKLongitude,
//     latitude: tempHKLatitude,
//   };
//   Cesium.knockout.track(viewModel);
//   var toolbar = document.getElementById('toolbar');
//   Cesium.knockout.applyBindings(viewModel, toolbar);
//   Cesium.knockout.getObservable(viewModel, 'longitude').subscribe(tilesMatrix);
//   Cesium.knockout.getObservable(viewModel, 'latitude').subscribe(tilesMatrix)
//   Cesium.knockout.getObservable(viewModel, 'height').subscribe(tilesMatrix)
//   function tilesMatrix(v) {//这个函数要放在3dtiles 的 readyPromise 函数里面，放在外面的话，无法访问readyPromise的参数tileset
//     console.log(v);
//     v = Number(v);
//     if (isNaN(v)) {
//       return;
//     }
//     if (v < 30) {
//       tempHKLatitude = v;
//       console.log('tempTaikooLatitude,', tempHKLatitude)
//     }
//     if (v > 890) {
//       tempHKHeight = v;
//       console.log('tempHeight,', tempHKHeight)
//     }
//     if (v > 30 && v < 890) {
//       tempHKLongitude = v
//       console.log('tempTaikooLongitude,', tempHKLongitude)
//     }
//     var center = Cesium.Cartesian3.fromDegrees(tempHKLongitude, tempHKLatitude, tempHKHeight);
//     var modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(center);
//     tileset._root.transform = modelMatrix;
//   } */
// })

//##skp模型
var Airport = viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
  url: './CesiumLab/skp/tileset.json',
  luminanceAtZenith: 0.1,
  // lightColor: new Cesium.Cartesian3(1.0, 1.0, 1),
}));
Airport.readyPromise.then(function (tileset) {
  var center = Cesium.Cartesian3.fromDegrees(113.93072, 22.31373, 8);
  var modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(center);
  tileset._root.transform = modelMatrix;
})


var hkIsland = viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
  url: './CesiumLab/hkIslandnullTerrain/tileset.json',
  luminanceAtZenith: 0.1,
  // lightColor: new Cesium.Cartesian3(1.0, 1.0, 1),
}));
// var hkIsland = viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
//   url: './CesiumLab/hkisland2/tileset.json',
//   luminanceAtZenith: 0.1,
//   // lightColor: new Cesium.Cartesian3(1.0, 1.0, 1),
// }));
//viewer.flyTo(hkIsland)
//##全港模型中心点
/*hkIsland.readyPromise.then(function (tileset) {
  var center = Cesium.Cartesian3.fromDegrees(114.16807, 22.28182, 138);
  var modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(center);
  tileset._root.transform = modelMatrix;
})*/
// var hkIslandStyle = new Cesium.Cesium3DTileStyle({
//   'color': {
//     'conditions': [
//       // ['${id} === "对象058"', "color('#82B1ED')"],
//       ['true', "color('#FFFFFF',0.6)"]
//     ]
//   }
// });
// hkIsland.style = hkIslandStyle;
/* var hkIsland = viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
  url: './CesiumLab/hkIslandnullTerrain/tileset.json',
  luminanceAtZenith: 0.1,
  // lightColor: new Cesium.Cartesian3(1.0, 1.0, 1),
}));
viewer.flyTo(hkIsland)
//模型中心点
var tempHKLongitude = 114.17327265407718;
var tempHKLatitude = 22.28351876737916;
var tempHKHeight = 138;
hkIsland.readyPromise.then(function (tileset) {
  var center = Cesium.Cartesian3.fromDegrees(114.16807, 22.28182, 138);
  var modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(center);
  tileset._root.transform = modelMatrix;
  // 模型配准UI
  var viewModel = {
    height: tempHKHeight,
    longitude: tempHKLongitude,
    latitude: tempHKLatitude,
  };
  Cesium.knockout.track(viewModel);
  var toolbar = document.getElementById('toolbar');
  Cesium.knockout.applyBindings(viewModel, toolbar);
  Cesium.knockout.getObservable(viewModel, 'longitude').subscribe(tilesMatrix);
  Cesium.knockout.getObservable(viewModel, 'latitude').subscribe(tilesMatrix)
  Cesium.knockout.getObservable(viewModel, 'height').subscribe(tilesMatrix)
  function tilesMatrix(v) {//这个函数要放在3dtiles 的 readyPromise 函数里面，放在外面的话，无法访问readyPromise的参数tileset
    console.log(v);
    v = Number(v);
    if (isNaN(v)) {
      return;
    }
    if (v < 30) {
      tempHKLatitude = v;
      console.log('tempTaikooLatitude,', tempHKLatitude)
    }
    if (v > 890) {
      tempHKHeight = v;
      console.log('tempHeight,', tempHKHeight)
    }
    if (v > 30 && v < 890) {
      tempHKLongitude = v
      console.log('tempTaikooLongitude,', tempHKLongitude)
    }
    var center = Cesium.Cartesian3.fromDegrees(tempHKLongitude, tempHKLatitude, tempHKHeight);
    var modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(center);
    tileset._root.transform = modelMatrix;
  }
}) */


//##Taikoo模型
var TaiKooTileset = viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
  url: './CesiumLab/taikoo 04171/tileset.json',
  // modelMatrix: resultMatrix4,
  // lightColor: new Cesium.Cartesian3(1.0, 2.0, 1),
  // luminanceAtZenith: 0.2//默认即可
}));
var tempTaikooLongitude = 114.21508;
var tempTaikooLatitude = 22.28777;
var tempTaikooScale = 1500;
TaiKooTileset.readyPromise.then(function (tileset) {
  // console.log('第一种模型中心点坐标，', tileset.boundingSphere.center)
  //获取3dtiles坐标中心点
  var a = Cesium.Matrix4.fromArray(tileset._root.transform);//从生成的3dtiles根文件'tileset.json.root.transform'中的16个元素种获取一个转换矩阵
  var s = Cesium.Matrix4.getTranslation(a, new Cesium.Cartesian3);//获取转换矩阵所对应的平移量，猜测可能就是模型中心点所对应的实际坐标
  // console.log('第二种模型中心点坐标，', s)
  var ellipsoid = viewer.scene.globe.ellipsoid;
  var cartographic = ellipsoid.cartesianToCartographic(s);
  var lat = Cesium.Math.toDegrees(cartographic.latitude);
  var lng = Cesium.Math.toDegrees(cartographic.longitude);
  var alt = cartographic.height;
  // console.log('模型中心点,', lng, lat, alt);
  // //增加中心点entity
  // viewer.entities.add({
  //   position: s,
  //   point: {
  //     pixelSize: 5
  //   }
  // })
  //##对3dtiles进行配准
  var hpRoll = new Cesium.HeadingPitchRoll();
  var destination = Cesium.Cartesian3.fromDegrees(114.21508, 22.28777, 35)//对模型进行定位
  var fixedFrameTransform = Cesium.Transforms.localFrameToFixedFrameGenerator('west', 'south');//对模型坐标轴进行旋转
  var modelMatrix = Cesium.Transforms.headingPitchRollToFixedFrame(destination, hpRoll, Cesium.Ellipsoid.WGS84, fixedFrameTransform)
  var scale = Cesium.Matrix4.fromUniformScale(1500);//对模型进行放大
  Cesium.Matrix4.multiply(modelMatrix, scale, modelMatrix);
  tileset._root.transform = modelMatrix;
  // tileset.modelMatrix = modelMatrix;//不能用这个，奇怪
  /* // ##对模型进行配准UI
  var viewModel = {
    scale: 1500,
    longitude: tempTaikooLongitude,
    latitude: tempTaikooLatitude,
  };
  Cesium.knockout.track(viewModel);
  var toolbar = document.getElementById('toolbar');
  Cesium.knockout.applyBindings(viewModel, toolbar);
  Cesium.knockout.getObservable(viewModel, 'scale').subscribe(tilesMatrix);
  Cesium.knockout.getObservable(viewModel, 'longitude').subscribe(tilesMatrix);
  Cesium.knockout.getObservable(viewModel, 'latitude').subscribe(tilesMatrix)
  function tilesMatrix(v) {//这个函数要放在3dtiles 的 readyPromise 函数里面，放在外面的话，无法访问readyPromise的参数tileset
    console.log(v);
    v = Number(v);
    if (isNaN(v)) {
      return;
    }
    if (v < 30) {
      tempTaikooLatitude = v;
      console.log('tempTaikooLatitude,', tempTaikooLatitude)
    }
    if (v > 180) {
      tempTaikooScale = v;
      console.log('tempTaikooScale', tempTaikooScale)
    } else {
      tempTaikooLongitude = v
      console.log('tempTaikooLongitude,', tempTaikooLongitude)
    }
    var hpRoll = new Cesium.HeadingPitchRoll();
    var destination = Cesium.Cartesian3.fromDegrees(tempTaikooLongitude, tempTaikooLatitude, 35)
    var fixedFrameTransform = Cesium.Transforms.localFrameToFixedFrameGenerator('west', 'south');
    var modelMatrix = Cesium.Transforms.headingPitchRollToFixedFrame(destination, hpRoll, Cesium.Ellipsoid.WGS84, fixedFrameTransform)
    var scaleMatrix = Cesium.Matrix4.fromUniformScale(tempTaikooScale);
    Cesium.Matrix4.multiply(modelMatrix, scaleMatrix, modelMatrix);
    tileset._root.transform = modelMatrix;
  } */
})
//##3dtileset样式切换
var TaiKooTilesetStyle = new Cesium.Cesium3DTileStyle({
  'color': {
    'conditions': [
      // ['${id} === "对象058"', "color('#82B1ED')"],
      ['true', "color('#FFFFFF')"]
    ]
  }
});
var TaiKooTilesetStyle1 = new Cesium.Cesium3DTileStyle({
  'color': {
    'conditions': [
      ['${id} === "对象058"', "color('#82B1ED',0.4)"],
      ['true', "color('#FFFFFF',0.4)"]
    ]
  }
});
var HKTilesetStyle = new Cesium.Cesium3DTileStyle({
  'color': {
    'conditions': [
      ['${Z} >= 100', "color('#7108E3')"],
      ['${Z} >= 60', "color('#1B98E0')"],
      ['${Z} >= 15', "color('#05A7DE',0.6)"],
      ['true', "color('#05DEC6',0.6)"]
    ]
  }
});
var HKTilesetStyle1 = new Cesium.Cesium3DTileStyle({
  'color': {
    'conditions': [
      ['true', "color('#F4FFFF')"]
    ]
  }
});
// HKTileset.style = HKTilesetStyle1;
// TaiKooTileset.style = TaiKooTilesetStyle;
// viewer.flyTo(TaiKooTileset)
$('#TR').click(function (evt) {
  if (this.checked) {
    TaiKooTileset.style = TaiKooTilesetStyle1;
    bloom.uniforms.brightness = -0.1;
    bloom.uniforms.contrast = 117;
    bloom.uniforms.delta = 1;
    bloom.uniforms.sigma = 4.3;
    bloom.uniforms.stepSize = 0.2;
    viewer.imageryLayers.get(0).hue = 2.9;
    viewer.imageryLayers.get(0).brightness = 0.3;
    viewer.dataSources.add(TaikooNightOnlyDatasource);
    viewer.dataSources.add(nightOnlyDatasource);
  } else {
    TaiKooTileset.style = TaiKooTilesetStyle;
    bloom.uniforms.brightness = -0.4;
    bloom.uniforms.contrast = 117;
    bloom.uniforms.delta = 1.3;
    bloom.uniforms.sigma = 3.1;
    bloom.uniforms.stepSize = -0.1;
    viewer.imageryLayers.get(0).hue = 0;
    viewer.imageryLayers.get(0).gamma = 0.32;
    viewer.imageryLayers.get(0).brightness = 1.2;
    viewer.dataSources.remove(TaikooNightOnlyDatasource);
    viewer.dataSources.remove(nightOnlyDatasource);

  }
});

/* ---------------------------------- 添加水面 ---------------------------------- */
function applydjk_WaterMaterial(primitive, scene) {
  primitive.appearance.material = new Cesium.Material({
    fabric: {
      type: 'Water',
      uniforms: {
        normalMap: 'images/waterNormals.jpg',
        frequency: 10000.0,
        animationSpeed: 0.01,
        amplitude: 50
      }
    }
  });
}

var djk_Polygon = viewer.scene.primitives.add(new Cesium.Primitive({
  geometryInstances: new Cesium.GeometryInstance({
    geometry: new Cesium.PolygonGeometry({
      polygonHierarchy: new Cesium.PolygonHierarchy(
        Cesium.Cartesian3.fromDegreesArray([114.2032296821750, 22.2954247495470, 114.2238504964960, 22.2954247495470, 114.2238504964960, 22.28668124718828, 114.2222109568081, 22.28821882024971, 114.2196221263238, 22.28933850836762, 114.2153975518408, 22.29009759793601, 114.2112108607410, 22.29199171900305, 114.2101972976249, 22.29227071494149, 114.2098735803139, 22.29235981409304, 114.2097289243561, 22.29221118135607, 114.2097042516014, 22.29218582836440, 114.2088105736463, 22.29248690730827, 114.2088037278064, 22.29246737541867, 114.2077610405504, 22.29277879986787, 114.2078112429837, 22.29292436393585, 114.2079950270461, 22.29286879041507, 114.2080215379608, 22.29294834511051, 114.2079559714417, 22.29296801736532, 114.2078426538734, 22.29300154267071, 114.2079729465971, 22.29337831142099, 114.2080386643542, 22.29355814364096, 114.2082240209553, 22.29350133236685, 114.2082512116545, 22.29358197056153, 114.2080053618808, 22.29365591555818, 114.2079116205914, 22.29339797381259, 114.2077772972221, 22.29300939372778, 114.2077036939123, 22.29279605927789, 114.2072852493834, 22.29291909027717, 114.2072660514522, 22.29303899345994, 114.2072947547163, 22.29312113965031, 114.2074203649208, 22.29348068832195, 114.2073213040042, 22.29351782282264, 114.2073392105378, 22.29339441600163, 114.2072475065094, 22.29313167821922, 114.2072199975994, 22.29305285506611, 114.2071284892154, 22.29296634074733, 114.2067882639491, 22.29307103270747, 114.2067356060214, 22.29323377424263, 114.2067371990602, 22.29324108875345, 114.2067559562348, 22.29332768896693, 114.2067633192364, 22.29336169693368, 114.2068040868025, 22.29354989661178, 114.2068219771239, 22.29357118751390, 114.2068422446110, 22.29359531358980, 114.2069075500280, 22.29367301903440, 114.2068084888419, 22.29371016225210, 114.2067770571154, 22.29361980764938, 114.2067658118049, 22.29358745300445, 114.2067576455879, 22.29356398392319, 114.2067173051939, 22.29337639823736, 114.2067090387781, 22.29333798349109, 114.2066903582402, 22.29325113040074, 114.2066596832086, 22.29310856056960, 114.2062601983481, 22.29322961676103, 114.2054182082754, 22.29337794172844, 114.2052905156555, 22.29340043236187, 114.2051608715548, 22.29342326639915, 114.2050651636515, 22.29344012519040, 114.2048987526193, 22.29346944036741, 114.2049302548275, 22.29362729922695, 114.2048714403376, 22.29364027737415, 114.2048392680895, 22.2934798358610, 114.2043540177423, 22.29356529439277, 114.2042564746455, 22.29358246909001, 114.2042243733348, 22.29358811865116, 114.2041184567503, 22.29360676667017, 114.2034273767698, 22.29372846970707, 114.2034040951570, 22.29382449612796, 114.2034134133076, 22.29404089539948, 114.2033959501912, 22.29411588854390, 114.2034042283109, 22.29422074173884, 114.2034105668344, 22.29433214245043, 114.2034117926803, 22.29435372543539, 114.2033393688313, 22.29434776804165, 114.2033379270905, 22.29436998360641, 114.2033320536705, 22.29446040817962, 114.2033264124775, 22.29454729271010, 114.2032783863285, 22.29459985876126, 114.203250000880, 22.29511334450067, 114.2032394639426, 22.29512356887862, 114.2032296821750, 22.29512337742489, 114.2032296821750, 22.2954247495470, 114.2032296821750, 22.29456020446821, 114.2032296821750, 22.29489767801066, 114.2032516312029, 22.29459206066283, 114.2032296821750, 22.29456020446821])
      ),
      vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT
    })
  }),
  appearance: new Cesium.EllipsoidSurfaceAppearance({
    aboveGround: true
  }),
  show: true
}));
applydjk_WaterMaterial(djk_Polygon, scene);
/* ---------------------------------- 各种交互 ---------------------------------- */
//摄像头朝向坐标拾取
$("#postprocessing").on("click", function () {
  console.log(viewer.camera.heading + ',' + viewer.camera.pitch + ',' + viewer.camera.position);
});
var handler = new Cesium.ScreenSpaceEventHandler(scene.canvas)
function PickFeature(e) {
  var position = viewer.scene.camera.pickEllipsoid(e.position);
  var ellipsoid = viewer.scene.globe.ellipsoid;
  var cartographic = ellipsoid.cartesianToCartographic(position);
  var lat = Cesium.Math.toDegrees(cartographic.latitude);
  var lng = Cesium.Math.toDegrees(cartographic.longitude);
  var alt = cartographic.height;
  console.log('click,', lng, ',', lat, ',', alt)
  var feature = viewer.scene.pick(e.position);
  if (feature instanceof Cesium.Cesium3DTileFeature) {
    var propertyNames = feature.getPropertyNames();
    var length = propertyNames.length;
    for (var i = 0; i < length; ++i) {
      var propertyName = propertyNames[i];
      console.log(propertyName + ': ' + feature.getProperty(propertyName));
    }
  }
}
handler.setInputAction(PickFeature, Cesium.ScreenSpaceEventType.LEFT_CLICK)

//鼠标移动，显示geojson属性
// var labelEntity = viewer.entities.add({
//   label: {
//     show: false,
//     showBackground: true,
//     font: '14px monospace',
//     horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
//     verticalOrigin: Cesium.VerticalOrigin.TOP,
//     pixelOffset: new Cesium.Cartesian2(15, 0)
//   }
// });
// var handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
// handler.setInputAction(function (movement) {
//   var foundPosition = false;
//   var scene = viewer.scene;
//   var pickedObject = scene.pick(movement.endPosition);
//   if (scene.pickPositionSupported && Cesium.defined(pickedObject) && Object.keys(pickedObject.id).length != 0) {
//     var cartesian = viewer.scene.pickPosition(movement.endPosition);
//     if (Cesium.defined(cartesian)) {
//       labelEntity.position = cartesian;
//       labelEntity.label.show = true;
//       labelEntity.label.text = 'Heihgt:' + (' ' + pickedObject.id.name);
//       labelEntity.label.eyeOffset = new Cesium.Cartesian3(0.0, 0.0, -100);
//       foundPosition = true;
//       // pickedObject.id.polygon.material.color = new Cesium.Color(0, 0, 1, 0.5);//针对于滑过的entity进行颜色变化，反应不够明显，并且没法回复原状，所以暂且放弃
//     }
//   }
//   if (!foundPosition) {
//     labelEntity.label.show = false;
//   }
// }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

/* ---------------------------------- 摄像机移动 --------------------------------- */
/*viewer.camera.flyTo({
  // destination: Cesium.Cartesian3.fromDegrees(114.175790928744, 22.3046430766713, 11110),
  destination: new Cesium.Cartesian3(-2422586.237106382, 5385236.799779413, 2403497.8217039346),
  orientation: {
    heading: 5.179351920032166,
    pitch: -0.29428521944755115,
    roll: 0.0
  }
});*/
//避免相机进入地下
var minPitch = -Cesium.Math.PI_OVER_TWO;
var maxPitch = 0;
var minHeight = 200;
viewer.camera.changed.addEventListener(//避免相机陷入地下
  function () {
    if (viewer.camera._suspendTerrainAdjustment && viewer.scene.mode === Cesium.SceneMode.SCENE3D) {
      viewer.camera._suspendTerrainAdjustment = false;
      viewer.camera._adjustHeightForTerrain();
    }

    // Keep camera in a reasonable pitch range
    var pitch = viewer.camera.pitch;

    if (pitch > maxPitch || pitch < minPitch) {
      viewer.scene.screenSpaceCameraController.enableTilt = false;

      // clamp the pitch
      if (pitch > maxPitch) {
        pitch = maxPitch;
      } else if (pitch < minPitch) {
        pitch = minPitch;
      }

      var destination = Cesium.Cartesian3.fromRadians(
        viewer.camera.positionCartographic.longitude,
        viewer.camera.positionCartographic.latitude,
        Math.max(viewer.camera.positionCartographic.height, minHeight));

      viewer.camera.setView({
        destination: destination,
        orientation: { pitch: pitch }
      });
      viewer.scene.screenSpaceCameraController.enableTilt = true;
    }
  }
);