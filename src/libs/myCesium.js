import axios from 'axios'
import landuseColorConfig from "@/config/landuseColor.json"
import ecologyColorConfig from "@/config/ecologyColor.json"
import pDescriptionColorConfig from "@/config/projectDescriptionColor.json"
import noiseColorConfig from "@/config/noiseColor.json"
import submenu1Config from "@/config/submenu1Details.json"
import submenuHabitatConfig from "@/config/submenuHabitatDetail.json"
import speciesImageListConfig from "@/config/speciesImageList.json"
import noPopUpLayersConfig from "@/config/noPopUpLayers.json"
import isMobile from "@/libs/isMobile.min.js"
import myMapBox from "./myMapBox";
let cesiumMap = {};
cesiumMap.cesium = {
  viewer: null
};

/* ---------------------------------- 全局变量 Global variable---------------------------------- */
//##绘制polygon Draw polygon
var activeShapePoints = []; // 所有点坐标 All point coordinates
var activePolygon;    // 记录动态面 Record dynamic surface
var activeLine;      //动态线 Dynamic line
var floatingPoint;  // 记录当前鼠标点 Record the current mouse point
var allDraw = [];	// 记录所有绘制元素 Record all drawing elements
var allPoint = [];	// 记录所有点 Record all points
var geoJsonPolygon = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          []
        ]
      },
      "properties": {}
    }
  ]
}; //绘制生成的polygon对应的geojson Draw the geojson corresponding to the generated polygon
var resultGeojsonPolygonDataSource = new Cesium.CustomDataSource();
var handler;//绘制完之后，需要使用cesium默认的鼠标事件，需要将其destroy After drawing, you need to use the default mouse event of cesium, and you need to destroy it
var leftClick;//鼠标默认点击事件 Default mouse click event
var HKBuilding;
var onlyOneCesium = false;
var mouseMoveHandler;
var leftClickHandler;
/* ---------------------------------- 全局函数 Global function---------------------------------- */

/* -------------------------------- viewer 配置 viewer configuration------------------------------- */

//## 初始化 cesium Initialize cesium
cesiumMap.initCesium = function () {
  /* ---------------------------------- 测试函数 Test function---------------------------------- */
  //避免出现多个 viewer dom 元素 Avoid multiple viewer dom elements
  var viewBContainer = document.getElementsByClassName('cesium-viewer');
  if (viewBContainer.length > 0) {
    console.log(viewBContainer, 'classboxRemove')
    viewBContainer.forEach(element => {
      element.remove()
    });
  }


  cesiumMap.cesium.viewer = new Cesium.Viewer("cesiumContainer", {
    navigation: false,
    animation: false,
    timeline: false,
    baseLayerPicker: false,
    navigationHelpButton: false,
    geocoder: false,
    fullscreenButton: false,
    vrButton: false,
    sceneModePicker: false,
    maximumScreenSpaceError: 64,  //for better visualisation from the mobile devices
   // maximumNumberOfLoadedTiles:  1000,  //added on 22/01/05 for iPhone tesing
   // maximumMemoryUsage:  50, //added on 22/01/05 for iPhone tesing
    maximumNumberOfLoadedTiles:  isMobile.any ? 1000 : 100000000, //added on 22/01/05 for iPhone tesing
    maximumMemoryUsage:  isMobile.any ? 50 : 200, //added on 22/01/05 for iPhone tesing
    infoBox: true,
    scene3DOnly: true,
    homeButton: false,
    selectionIndicator: false,
    terrainShadows: Cesium.ShadowMode.ENABLED,
    requestRenderMode: true,
    contextOptions: {
      webgl: {
        alpha: true,
        preserveDrawingBuffer: true,
       // preserveDrawingBuffer: false,
        powerPreference: "low-power",
      }
    },
    /*terrainProvider: new Cesium.CesiumTerrainProvider({
      url: 'terrain/',
      //requestVertexNormals: true,//是否请求法线（用于光照效果） Whether to request normals (for lighting effects)
      //requestWaterMask: true//是否请求水面标志位（用于水面特效） Whether to request the water surface flag (used for water surface special effects)
      requestVertexNormals: isMobile.any ? false:true,
      requestWaterMask: false
    })*/
  });
  let viewer = cesiumMap.cesium.viewer;
  viewer.scene.globe.depthTestAgainstTerrain = true;
  viewer.scene.globe.showGroundAtmosphere = false;
  viewer._cesiumWidget._creditContainer.style.display = "none";
  cesiumMap.cesium.viewer = viewer;
  //添加地图底图，并配置渲染参数 Add a base map of the map and configure the rendering parameters
  viewer.imageryLayers.remove(viewer.imageryLayers.get(0));
  //##增加暗黑色mapbox底图 Add dark black mapbox basemap
  // viewer.imageryLayers.add(new Cesium.ImageryLayer(new Cesium.MapboxStyleImageryProvider({
  //   styleId: 'dark-v10',
  //   accessToken: 'pk.eyJ1IjoibGluc2hpeW91eGlhbmciLCJhIjoiY2sweWxnN2p6MGd1djNncDh0NGJjMXVyMSJ9.oaIz3c43CUJjckoXdc_vfg'
  // }), {
  //   brightness: 0.8,
  //   contrast: 1,
  //   hue: 2.7,
  //   saturation: 10,
  // }));
  //##添加outdoormapbox地图 Add outdoormapbox map
  // viewer.imageryLayers.add(new Cesium.ImageryLayer(new Cesium.MapboxStyleImageryProvider({
  //   styleId: 'outdoors-v11',
  //   accessToken: 'pk.eyJ1IjoibGluc2hpeW91eGlhbmciLCJhIjoiY2sweWxnN2p6MGd1djNncDh0NGJjMXVyMSJ9.oaIz3c43CUJjckoXdc_vfg'
  // })));
  // //##添加mapbox 影像图 Add mapbox image
  // viewer.imageryLayers.add(new Cesium.ImageryLayer(new Cesium.MapboxImageryProvider({
  //   mapId: 'mapbox.satellite',
  //   accessToken: 'pk.eyJ1IjoibGluc2hpeW91eGlhbmciLCJhIjoiY2sweWxnN2p6MGd1djNncDh0NGJjMXVyMSJ9.oaIz3c43CUJjckoXdc_vfg'
  // }), {
  //   brightness: 1.2,
  //   // contrast: 1,
  //   // hue: 2.7,
  //   // saturation: 10,
  // }));
  viewer.imageryLayers.add(new Cesium.ImageryLayer(new Cesium.UrlTemplateImageryProvider({
    url: "https://mapapi.geodata.gov.hk/gs/api/v1.0.0/xyz/imagery/WGS84/{z}/{x}/{y}.png",
    fileExtension: "png"
  }) ));
  Cesium.GeoJsonDataSource.clampToGround = true;
  viewer.scene.postProcessStages.fxaa.enabled = true;
  var scene = viewer.scene;
  scene.screenSpaceCameraController.minimumZoomDistance = 350;
  if (!scene.pickPositionSupported) {
    window.alert("This browser does not support pickPosition.");
  }

  

  console.log("Load 3D model St")
  //load buildings and 3dtiles 
  add3dTiles(viewer, 'tiles/hk1/texture/tileset.json', 0.8, "#ffffff", 1, false);
  add3dTiles(viewer, 'tiles/hk1/notexture/tileset.json', 0.4, "#ffffff", 1, false);


  /* No Use - outdated 3dtiles
  add3dTiles(viewer, 'tiles/area58/tileset.json', 0.2, "#000000", 0.3, false);
  add3dTiles(viewer, 'tiles/3dtiles/Area 58_v5/tileset.json', 0.2, "#ffffff", 0.3, false);
  
  add3dTiles(viewer, 'tiles/3dtiles/TCE/tileset.json', 0.2, "", 1, true);
  add3dTiles(viewer, 'tiles/3dtiles/TCE_13/tileset.json', 0.2, "", 1, true);
  add3dTiles(viewer, 'tiles/3dtiles/TCW/tileset.json', 0.1, "", 1, false);
  add3dTiles(viewer, 'tiles/3dtiles/Test_fbx_02/tileset.json', 0.1, "", 1, false); 
  No Use - outdated 3dtiles */
 
  
  // Updated layout 2021-Dec

  
  add3dTiles(viewer, 'tiles/3dtiles/Area_58_v6/tileset.json', 0.2, "#ffffff", 0.5, false);
  
  add3dTiles(viewer, 'tiles/3dtiles/TCW_v2_1a_EEPEAP_SL/tileset.json', 0.15, "", 1, false);
  add3dTiles(viewer, 'tiles/3dtiles/TCW_02_T2_dae_SL/tileset.json', 0.15, "", 1, false);
  add3dTiles(viewer, 'tiles/3dtiles/TCW_02_T1_Obj_SL/tileset.json', 0.15, "", 1, false);

 
  add3dTiles(viewer, 'tiles/3dtiles/TCE_v2_NoBarrier_v2/tileset.json', 0.15, "", 1, false);
  
  add3dTiles(viewer, 'tiles/3dtiles/CEDD_TCNTE/tileset.json', 0.4, "#ffffff", 0.5, false);

  add3dTiles(viewer, 'tiles/3dtiles/TCE_v2_Barrier/tileset.json', 0.15, "", 1, true);



//add3dTiles(viewer, 'tiles/3dtiles/Area_58_v6/tileset.json', 0.2, "#00ffff", 0.3, true);

  console.log("Load 3D model Ed")
  


  //load glft
  //addglft(viewer, 113.9599695238, 22.2964514514, 'gltf/TCE.gltf', true);

  console.log("Load terrain")
  // add terrain data
  var cesiumTerrainProviderMeshes = new Cesium.CesiumTerrainProvider({
    url: 'terrain/',
    requestVertexNormals: false,
    requestWaterMask: false,
  })
  viewer.terrainProvider = cesiumTerrainProviderMeshes;
  
  
  console.log("Load OZP")
  


  /* ---------------- Cause iOS crush
  var neighborhoodsPromise = new Cesium.GeoJsonDataSource.load(
    "geojson/ozp_dev.geojson", {
      fill: Cesium.Color.GAINSBORO,
      clampToGround: !0
    }
  )
  

  neighborhoodsPromise.then(function(dataSource) {
    console.log("CEDD_TCNTE_PDA.geojson then start point");
    viewer.dataSources.add(dataSource);
    var neiborhoods = dataSource.entities;
    var neighborhoodsEntities = dataSource.entities.values;
    for(var i = 0; i < neighborhoodsEntities.length; i++)
    {
      var entity = neighborhoodsEntities[i];
      if(Cesium.defined(entity.polygon))
      {
        //entity.polygon.material = Cesium.Color.fromCssColorString("#94a08b");
        entity.polygon.material = "img/materials/materials_dev.PNG";
        entity.polygon.classificationType = Cesium.ClassificationType.TERRAIN;
      }
    }
  Cause iOS crush ---------------- */

    // ====================== Ecology Layers  ==> The fact that the ozp_dev, ozp_road and ozp_openspace layers took longer time to load  makes the Ecology Layers always loaded first and covered by the ozp_dev, ozp_road and ozp_openspace layers that finished loading the last.  These Ecology Layers have to be loaded after the ozp_dev, ozp_road and ozp_openspace loaded. To make sure ozp_dev, ozp_road and ozp_openspace layers are loaded first, these Ecology Layers geojson addition are located in the ".then" function of ozp_dev (ideally inside the .then function that have the longest loading time between ozp_dev, ozp_road and ozp_openspace). Otherwise, these Ecology Layers will be displayed under the ozp_dev, ozp_road and ozp_openspace layers (covered by them).


  var neighborhoodsPromise = new Cesium.GeoJsonDataSource.load(
    "geojson/ozp_dev.geojson", {
      fill: Cesium.Color.GAINSBORO,
      clampToGround: !0
    }
  )


  neighborhoodsPromise.then(function(dataSource) {
    console.log("CEDD_TCNTE_PDA.geojson then start point");
    viewer.dataSources.add(dataSource);
    var neiborhoods = dataSource.entities;
    var neighborhoodsEntities = dataSource.entities.values;
    for(var i = 0; i < neighborhoodsEntities.length; i++)
    {
      var entity = neighborhoodsEntities[i];
      if(Cesium.defined(entity.polygon))
      {
        //entity.polygon.material = Cesium.Color.fromCssColorString("#94a08b");
        entity.polygon.material = "img/materials/materials_dev.PNG";
        entity.polygon.classificationType = Cesium.ClassificationType.TERRAIN;
      }
    }
  
    console.log("Load 2D")
    
    cesiumMap.addGeojsonPolyline({
      url: "geojson/Sampling_Location_wgs84.geojson",
      menuId: 3
    })
    cesiumMap.addGeojsonPoint({
      url: "geojson/Stream_Sampling_Point_wgs84.geojson"
    })
    cesiumMap.addGeojsonPolygon({
      data: "geojson/Dive_survey_area_wgs84.geojson"
    })
    cesiumMap.addGeojsonPolygon({
      data: "geojson/Habitat_20210419_wgs84.geojson"
    })

    cesiumMap.addGeojsonPolygon({
      data: "geojson/rev1/CountryPark_500m_wgs84.geojson"
    })  

    cesiumMap.addGeojsonPolygon({
      data: "geojson/rev1/priority_clip_wgs84.geojson"
    })
    // cesiumMap.addGeojsonPolygon({
    //   data: "geojson/rev1/Marine_Park_wgs84.geojson"
    // })
    cesiumMap.addGeojsonPolyline({
      url: "geojson/rev1/EIS_500m_wgs84.geojson",
      menuId: 3
    })
    
    console.log("Load 2D B2")
  
    cesiumMap.addGeojsonPointBb({
      url: "geojson/rev1/species_20210730_wgs84.geojson"
    })

    cesiumMap.addGeojsonPolygon({
      data: "geojson/TaiHoWan_wgs84.geojson"
    })
    cesiumMap.addGeojsonPolygon({
      data: "geojson/TungChungRiver_wgs84.geojson"
    })
    cesiumMap.addGeojsonPolyline({
      url: "geojson/BargingFacilityEco_wgs84.geojson"
    })
    cesiumMap.addGeojsonPolygon({
      data: "geojson/WongLungHangNullah_wgs84.geojson"
    })
    cesiumMap.addGeojsonPolygon({
      data: "geojson/Habitat_20210419_ManMud_wgs84.geojson"
    })
    cesiumMap.addGeojsonPolygon({
      data: "geojson/Habitat_20210419_Mud_wgs84.geojson"
    })
    cesiumMap.addGeojsonPolygon({
      data: "geojson/Habitat_20210419_WooPla_wgs84.geojson"
    })
    cesiumMap.addGeojsonPolygon({
      data: "geojson/Habitat_20210419_Pla_wgs84.geojson"
    })
    cesiumMap.addGeojsonPolygon({
      data: "geojson/rev1/CountryPark_500m_wgs84_copy.geojson"
    })  
    cesiumMap.addGeojsonPolygon({
      data: "geojson/CoastalProtectionArea_Merge_wgs84.geojson"
    })
    cesiumMap.addGeojsonPolygon({
      data: "geojson/ConservationArea_Merge_wgs84.geojson"
    })
    /* Comment on 22/01/05 
    cesiumMap.addGeojsonPolyline({
      url: "geojson/SSSI_line_wgs84.geojson",
      menuId: 3
    })*/

    
    cesiumMap.addGeojsonPolyline({
      url: "geojson/SSSI_line_wgs84.geojson",
      menuId: 3
    })
    
    cesiumMap.addGeojsonPolyline({
      url: "geojson/TCETCW_works_site_wgs84.geojson",
      menuId: 3
    })
    // cesiumMap.addGeojsonPolyline({
    //   url: "geojson/TCW_alignment_tunnel2_wgs84.geojson",
    //   menuId: 3
    // })
    cesiumMap.addGeojsonPolyline({
      url: "geojson/ProjectAlignment_wgs84.geojson",
      menuId: 3
    })

    cesiumMap.addGeojsonPolyline({
      url: "geojson/500m_wgs84.geojson",
      menuId: 3
    })

    console.log("Load 2D B3")

    // ====================== Project Description Layers ==> The fact that the ozp_dev, ozp_road and ozp_openspace layers took longer time to load  makes the Project Description Layers always loaded first and covered by the ozp_dev, ozp_road and ozp_openspace layers that finished loading the last.  These Project Description Layers have to be loaded after the ozp_dev, ozp_road and ozp_openspace loaded. To make sure ozp_dev, ozp_road and ozp_openspace layers are loaded first, these Project Description Layers geojson addition are located in the ".then" function of ozp_dev (ideally inside the .then function that have the longest loading time between ozp_dev, ozp_road and ozp_openspace). Otherwise, these Project Description Layers will be displayed under the ozp_dev, ozp_road and ozp_openspace layers (covered by them).
    cesiumMap.addGeojsonPolyline({
      url: "geojson/BargingFacility_wgs84.geojson",
      menuId: 1
    })
    cesiumMap.addGeojsonPolyline({
      url: "geojson/EAPEEP_wgs84.geojson",
      menuId: 1
    })
    cesiumMap.addGeojsonPolyline({
      url: "geojson/TCE_Alignment_wgs84.geojson",
      menuId: 1
    })
    cesiumMap.addGeojsonPolyline({
      url: "geojson/TCE_works_site_wgs84.geojson",
      menuId: 1
    })
    cesiumMap.addGeojsonPolyline({
      url: "geojson/TCW_alignment_only_wgs84.geojson",
      menuId: 1
    })
    cesiumMap.addGeojsonPolyline({
      url: "geojson/TCW_underground_worksite_wgs84.geojson",
      menuId: 1
    })
    cesiumMap.addGeojsonPolyline({
      url: "geojson/TCW_alignment_tunnel_wgs84.geojson",
      menuId: 1
    })
    cesiumMap.addGeojsonPolyline({
      url: "geojson/TCW_Works_site_wgs84.geojson",
      menuId: 1
    })

    //========= Noise ==> for corridor || 411 = building 1 leq_day; 412 = building 1 leq_night; 413 = building 1 lmax_night ==> corridor replaced by points now
    // cesiumMap.addGeojsonPolyline({
    //   url: "geojson/NSRfacade_TC_4326_leqday.geojson",
    //   menuId: 41
    // })
    // cesiumMap.addGeojsonPolyline({
    //   url: "geojson/NSRfacade_TC_4326_leqnight.geojson",
    //   menuId: 42
    // })
    // cesiumMap.addGeojsonPolyline({
    //   url: "geojson/NSRfacade_TC_4326_lmaxnight.geojson",
    //   menuId: 43
    // })
    // cesiumMap.addGeojsonPoint({
    //   url: "geojson/T01_EIA_NSR_Unmit_B_leqday_wgs84.geojson",
    //   menuId: 411
    // })
    // cesiumMap.addGeojsonPoint({
    //   url: "geojson/T01_EIA_NSR_Unmit_B_leqnight_wgs84.geojson",
    //   menuId: 412
    // })
    // cesiumMap.addGeojsonPoint({
    //   url: "geojson/T01_EIA_NSR_Unmit_B_lmaxnight_wgs84.geojson",
    //   menuId: 413
    // })
    // cesiumMap.addGeojsonPoint({
    //   url: "geojson/T01_EIA_NSR_Unmit_C_leqday_wgs84.geojson",
    //   menuId: 411
    // })
    // cesiumMap.addGeojsonPoint({
    //   url: "geojson/T01_EIA_NSR_Unmit_C_leqnight_wgs84.geojson",
    //   menuId: 412
    // })
    // cesiumMap.addGeojsonPoint({
    //   url: "geojson/T01_EIA_NSR_Unmit_C_lmaxnight_wgs84.geojson",
    //   menuId: 413
    // })
    cesiumMap.addGeojsonPoint({
      url: "geojson/EIA_Unmit_Leqday_wgs84.geojson",
      menuId: 411
    })
    cesiumMap.addGeojsonPoint({
      url: "geojson/EIA_Unmit_Leqnight_wgs84.geojson",
      menuId: 412
    })
    cesiumMap.addGeojsonPoint({
      url: "geojson/EIA_Unmit_Lmax_wgs84.geojson",
      menuId: 413
    })
    cesiumMap.addGeojsonPoint({
      url: "geojson/EIA_Mit_Leqday_wgs84.geojson",
      menuId: 411
    })
    cesiumMap.addGeojsonPoint({
      url: "geojson/EIA_Mit_Leqnight_wgs84.geojson",
      menuId: 412
    })
    cesiumMap.addGeojsonPoint({
      url: "geojson/EIA_Mit_Lmax_wgs84.geojson",
      menuId: 413
    })
  })
  

  console.log("Not sure")

  var neighborhoodsPromise2 = new Cesium.GeoJsonDataSource.load(
    "geojson/ozp_road.geojson", {
      fill: Cesium.Color.GAINSBORO,
      clampToGround: !0
    }
  )
  neighborhoodsPromise2.then(function(dataSource) {
    viewer.dataSources.add(dataSource);
    var neiborhoods = dataSource.entities;
    var neighborhoodsEntities = dataSource.entities.values;
    for(var i = 0; i < neighborhoodsEntities.length; i++)
    {
      var entity = neighborhoodsEntities[i];
      if(Cesium.defined(entity.polygon))
      {
        //entity.polygon.material = Cesium.Color.fromCssColorString("#4d555b");
        entity.polygon.material = "img/materials/materials_road.PNG";
        entity.polygon.classificationType = Cesium.ClassificationType.TERRAIN;
      }
    }
  })
  
  var neighborhoodsPromise3 = new Cesium.GeoJsonDataSource.load(
    "geojson/ozp_openspace.geojson", {
      fill: Cesium.Color.GAINSBORO,
      clampToGround: !0
    }
  )
  neighborhoodsPromise3.then(function(dataSource) {
    viewer.dataSources.add(dataSource);
    var neiborhoods = dataSource.entities;
    var neighborhoodsEntities = dataSource.entities.values;
    for(var i = 0; i < neighborhoodsEntities.length; i++)
    {
      var entity = neighborhoodsEntities[i];
      if(Cesium.defined(entity.polygon))
      {
        //entity.polygon.material = Cesium.Color.fromCssColorString("#4d555b");
        entity.polygon.material = "img/materials/materials_openspace2.PNG";
        entity.polygon.classificationType = Cesium.ClassificationType.TERRAIN;
      }
    }
  })
  

  

  

  // cesiumMap.addGeojsonPolygon({
  //   data: "geojson/CEDD_TCNTE_PDA.geojson"
  // })
  // cesiumMap.addGeojsonPolygon({
  //   data: "geojson/CEDD_TCNTE_TCWRoad.geojson"
  // })

  //飞到香港 Fly to hong kong
/*   cesiumMap.cesium.viewer.camera.flyTo({
    destination: new Cesium.Cartesian3(-2396391.1086170613, 5397892.667522567, 2402415.201798005),
    orientation: {
      heading: 5.981130766574789,
      //heading: 10,
      pitch: -0.3731015881849742,
      roll: 0.0
    }
  }); */
  //console.log(Country_Park_for_TCLE_wgs84.geojson)
  //飞到九龙 Fly to Kowloon

  var moveStartPosition;
  var moveStartHeading;
  var moveStartPitch;
  var moveStartRoll;

  cesiumMap.cesium.viewer.camera.moveStart.addEventListener(function() {
    //moveStartPosition = cesiumMap.cesium.viewer.camera.position;
    moveStartHeading = cesiumMap.cesium.viewer.camera.heading;
    moveStartPitch = cesiumMap.cesium.viewer.camera.pitch;
    moveStartRoll = cesiumMap.cesium.viewer.camera.roll;
  });


  cesiumMap.cesium.viewer.camera.moveEnd.addEventListener(function() {
    // console.log("position");
    // console.log(cesiumMap.cesium.viewer.camera.position);
    // console.log("position lat-lon");
    // var cart = Cesium.Cartographic.fromCartesian(cesiumMap.cesium.viewer.camera.position);
    // console.log(Cesium.Math.toDegrees(cart.latitude) + "-" + Cesium.Math.toDegrees(cart.longitude));
    // console.log("direction");
    // console.log(cesiumMap.cesium.viewer.camera.direction);
    // console.log("heading");
    // console.log(cesiumMap.cesium.viewer.camera.heading);
    // console.log("pitch");
    // console.log(cesiumMap.cesium.viewer.camera.pitch);
    // console.log("roll");
    // console.log(cesiumMap.cesium.viewer.camera.roll);

    // console.log("moveStartPosition");
    // console.log(moveStartPosition);
    // console.log("moveStartHeading");
    // console.log(moveStartHeading);
    // console.log("moveStartPitch");
    // console.log(moveStartPitch);
    // console.log("moveStartRoll");
    // console.log(moveStartRoll);
    // console.log("position from left-bottom");
    // var cart = Cesium.Cartesian3.fromDegrees(113.832126, 22.184150,0);
    // console.log(cart.x + "-" + cart.y);
    // console.log("position from right-top");
    // cart = Cesium.Cartesian3.fromDegrees(114.069211, 22.355712,0);
    // console.log(cart.x + "-" + cart.y);

    // var currentX = cesiumMap.cesium.viewer.camera.position.x;
    // var currentY = cesiumMap.cesium.viewer.camera.position.y;
    // console.log("currentX");
    // console.log(currentX);
    // console.log("currentY");
    // console.log(currentY);
    // if (-2387505.999186705 < currentX || currentX < -2406914.606070674 || 5424990.756067731 < currentY || currentY < 5395383.0976586845 )
    // {
    //   if (-2387505.999186705 < currentX)
    //   {
    //     console.log("currentX > -2387505.999186705");
    //     currentX = -2387505.999186705;
    //   }
    //   else if(currentX < -2406914.606070674)
    //   {
    //     console.log("currentX < -2406914.606070674");
    //     currentX = -2406914.606070674;
    //   }

    //   if (5424990.756067731 < currentY)
    //   {
    //     console.log("currentY > 5424990.756067731");
    //     currentY = 5424990.756067731;
    //   }
    //   else if(currentY < 5395383.0976586845)
    //   {
    //     console.log("currentY < 5395383.0976586845");
    //     currentY = 5395383.0976586845;
    //   }

    //   zoomToPlace(currentX, currentY, cesiumMap.cesium.viewer.camera.position.z, moveStartHeading, moveStartPitch, moveStartRoll)
    // }
  });

  // --------------------------------------- try tooltip on entity -----------------------------
  var labelEntity = viewer.entities.add({
    label: {
      show: false,
      showBackground: true,
      font: "14px monospace",
      horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
      verticalOrigin: Cesium.VerticalOrigin.TOP,
      pixelOffset: new Cesium.Cartesian2(0, -30),
    },
  });

  // Mouse over the globe to see the cartographic position
  mouseMoveHandler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
  mouseMoveHandler.setInputAction(function (movement) {
    var foundPosition = false;

    var scene = viewer.scene;
    if (scene.mode !== Cesium.SceneMode.MORPHING) {
      var pickedObject = scene.pick(movement.endPosition);      
      if (
        scene.pickPositionSupported &&
        Cesium.defined(pickedObject) &&
        pickedObject.id
      ) {        
        var currentEntity = pickedObject.id;
        if (currentEntity.entityCollection.owner.name)
        {
          var cartesian = viewer.scene.pickPosition(movement.endPosition);

          if (Cesium.defined(cartesian)) {
            var cartographic = Cesium.Cartographic.fromCartesian(
              cartesian
            );
            var longitudeString = Cesium.Math.toDegrees(
              cartographic.longitude
            ).toFixed(2);
            var latitudeString = Cesium.Math.toDegrees(
              cartographic.latitude
            ).toFixed(2);
            var heightString = cartographic.height.toFixed(2);

            labelEntity.position = cartesian;
            labelEntity.label.show = true;

            if (currentEntity.entityCollection.owner.name == "Sampling_Location_wgs84.geojson" || 
            currentEntity.entityCollection.owner.name == "Stream_Sampling_Point_wgs84.geojson")
            {
              labelEntity.label.text = currentEntity.properties.Type._value;
            }
            else if (currentEntity.entityCollection.owner.name == "Dive_survey_area_wgs84.geojson" )
            {
              labelEntity.label.text = "Dive Survey";
            }
            else if ( currentEntity.entityCollection.owner.name =="TungChungRiver_wgs84.geojson")
            {
              labelEntity.label.text = "Tung Chung River";
            }
            else if ( currentEntity.entityCollection.owner.name =="TaiHoWan_wgs84.geojson")
            {
              labelEntity.label.text = "Tai Ho Wan";
            }
            else if (currentEntity.entityCollection.owner.name  == "WongLungHangNullah_wgs84.geojson")
            {
              labelEntity.label.text = "Wong Lung Hang Nullah";
            }
            else if (currentEntity.entityCollection.owner.name == "Habitat_20210419_wgs84.geojson" || 
            currentEntity.entityCollection.owner.name == "Habitat_20210419_ManMud_wgs84.geojson" || 
            currentEntity.entityCollection.owner.name == "Habitat_20210419_WooPla_wgs84.geojson" || 
            currentEntity.entityCollection.owner.name == "Habitat_20210419_Mud_wgs84.geojson")
            {
              labelEntity.label.text = currentEntity.properties.Habitat._value;
            }
            else if (currentEntity.entityCollection.owner.name == "CountryPark_500m_wgs84.geojson" || 
            currentEntity.entityCollection.owner.name == "EIS_500m_wgs84.geojson" || 
            currentEntity.entityCollection.owner.name == "priority_clip_wgs84.geojson" || 
            currentEntity.entityCollection.owner.name == "Marine_Park_wgs84.geojson")
            {
              labelEntity.label.text = currentEntity.properties.RefName._value;
            }
            else if (currentEntity.entityCollection.owner.name == "species_20210730_wgs84.geojson" )
            {
              labelEntity.label.text = currentEntity.properties.Species._value;
            }
            else if (currentEntity.entityCollection.owner.name == "CoastalProtectionArea_Merge_wgs84.geojson" ||  
            currentEntity.entityCollection.owner.name == "ConservationArea_Merge_wgs84.geojson")
            {
              labelEntity.label.text = currentEntity.properties.DESC_ENG._value;
            }
            else
            {
              labelEntity.label.show = false;
            }

            labelEntity.label.eyeOffset = new Cesium.Cartesian3(
              0.0,
              0.0,
              -cartographic.height *
                (scene.mode === Cesium.SceneMode.SCENE2D ? 1.5 : 1.0)
            );

            foundPosition = true;
          }
        }

        
        
      }
    }

    if (!foundPosition) {
      labelEntity.label.show = false;
    }
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

  // ---------------------------------------- disable infobox pop up for certain layers ----------------------
  leftClickHandler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
  leftClickHandler.setInputAction(function(movement) {
    // console.log("viewer.selectedEntity",viewer.selectedEntity)
    if(viewer.selectedEntity)
    {
      // console.log(typeof(viewer.selectedEntity.id) !== "string")
      // console.log("viewer.selectedEntity.point", viewer.selectedEntity.point)
      // console.log("viewer.selectedEntity.polygon", viewer.selectedEntity.polygon)
      // console.log("viewer.selectedEntity.polyline", viewer.selectedEntity.polyline)
      // console.log("type of viewer.selectedEntity.point === 'undefined'", typeof viewer.selectedEntity.point !== 'undefined')
      // console.log("type of viewer.selectedEntity.polygon === 'undefined'", typeof viewer.selectedEntity.polygon !== 'undefined')
      // console.log("type of viewer.selectedEntity.polyline === 'undefined'", typeof viewer.selectedEntity.polyline !== 'undefined')
      if (( typeof viewer.selectedEntity.point !== 'undefined') || (typeof viewer.selectedEntity.polygon !== 'undefined') || (typeof viewer.selectedEntity.polyline !== 'undefined')) // non 3d layer 
      {
        //console.log("viewer.selectedEntity.entityCollection.owner.name",viewer.selectedEntity.entityCollection.owner.name)
        if (noPopUpLayersConfig.includes(viewer.selectedEntity.entityCollection.owner.name))
        viewer.selectedEntity = undefined;
      }
      else 
      {
        if(noPopUpLayersConfig.includes(viewer.selectedEntity.feature.primitive._basePath)) //for 3d layers
        {
          //console.log("viewer.selectedEntity.feature.primitive._basePath",viewer.selectedEntity.feature.primitive._basePath)
          viewer.selectedEntity = undefined;
        }
      }
      
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  
  
}




/* --------------------------------- 各种 entity 图层的添加 Adding various entity layers-------------------------------- */
//##图层初始化 Layer initialization
cesiumMap.clearDraw = function () {
  let viewer = cesiumMap.cesium.viewer;
  if (allDraw.length > 0) {
    allDraw.forEach(element => {
      viewer.entities.remove(element);
    });
  }

 


  if (resultGeojsonPolygonDataSource) {
    console.log('clear')
    viewer.dataSources.remove(resultGeojsonPolygonDataSource);
    var resultGeojsonPolygonDataSource = new Cesium.CustomDataSource();

  }
  if (speciesGeojsonDataSource) {
    console.log('speciesGeojsonDataSource clear')
    viewer.dataSources.remove(speciesGeojsonDataSource);
    var speciesGeojsonDataSource = new Cesium.CustomDataSource();
  }

  allDraw = [];
  //## 一般不要使用 removeAll，但是我还没有发现影响浏览器卡死的原因，所以只能暂时用该方法试一下。不过，好像也不起作用 Generally do not use removeAll, but I haven't found the cause that affects the browser to freeze, so I can only try this method temporarily. However, it doesn’t seem to work
  // viewer.dataSources.removeAll()
  // cesiumMap.addGeojsonPolyline({
  //   url: 'geojson/SR_trained_4326_region_line.json'
  // })
  cesiumMap.intersectDatabase(geoJsonPolygon);//同时清空数据库，让dashboard 显示为0  At the same time clear the database, so that the dashboard shows 0
}
//## 增加 geojson polygon Add geojson polygon

cesiumMap.addGeojsonPolygon = function ({
  data: data
}) {
  let viewer = cesiumMap.cesium.viewer;
  Cesium.GeoJsonDataSource.load(data, { clampToGround: !0 }).then(dataSource => {
    // cesiumMap.clearDraw()//这是当时放在这里的代码，不知道为什么要放在这里，后续出错的时候再恢复 This is the code that was placed here at the time. I don’t know why it is placed here, and I will restore it when there is a subsequent error.
    //如下代码是用于将 entity 放在单独的 datasource 种进行管理的，但是我用的不熟练，暂且不使用了。 The following code is used to manage the entity in a separate datasource, but I am not familiar with it, so I won't use it for the time being.
    resultGeojsonPolygonDataSource = dataSource;
    //console.log(resultGeojsonPolygonDataSource)
    viewer.dataSources.add(resultGeojsonPolygonDataSource);
    var entities = resultGeojsonPolygonDataSource.entities.values;
    dataSource.show = false;
    // viewer.dataSources.add(dataSource);
    // var entities = dataSource.entities.values;
    /*viewer.flyTo(entities, {
      maximumHeight: 100
    });*/
    viewer.selectedEntity = undefined;
    //console.log("viewer.infoBox.frame.height", viewer.infoBox.frame.height);
    //console.log("viewer.infoBox.frame.width", viewer.infoBox.frame.width)
    console.log("resultGeojsonPolygonDataSource", resultGeojsonPolygonDataSource._name);

    for (var j = 0; j < entities.length; j++)
    {
      var entity = entities[j];
      //console.log("test");
      
      for (var i = 0; i < ecologyColorConfig.length; i++)
      {
        var currentItemConfig =  ecologyColorConfig[i];
        //if (currentItemConfig.source == resultGeojsonPolygonDataSource._name && lowerTypProperty == currentItemConfig.name)
        if (currentItemConfig.source == resultGeojsonPolygonDataSource._name)
        {
          //console.log("resultGeojsonPolygonDataSource._name", resultGeojsonPolygonDataSource._name);
          if (resultGeojsonPolygonDataSource._name == "Dive_survey_area_wgs84.geojson") {
            var colorString = currentItemConfig.color;
            var stripeMaterial = new Cesium.StripeMaterialProperty({
              evenColor: Cesium.Color.fromCssColorString(colorString).withAlpha(0.5),
              oddColor: Cesium.Color.WHITE.withAlpha(0.2),
              repeat: 10
            })
            //entity.polygon.material = Cesium.Color.fromCssColorString(colorString);
            entity.polygon.material = stripeMaterial;
            entity.polygon.outline = false;
            
          }
          else if ((resultGeojsonPolygonDataSource._name == "CountryPark_500m_wgs84.geojson"  || resultGeojsonPolygonDataSource._name == "priority_clip_wgs84.geojson" || resultGeojsonPolygonDataSource._name == "Marine_Park_wgs84.geojson" || resultGeojsonPolygonDataSource._name == "CountryPark_500m_wgs84_copy.geojson" )&& resultGeojsonPolygonDataSource._name == currentItemConfig.source ) {
            var colorString = currentItemConfig.color;
            entity.polygon.material = Cesium.Color.fromCssColorString(colorString).withAlpha(0.5);
            entity.polygon.outline = false;

            for (var l = 0; l < submenu1Config.length; l++)
            {
              var currentItemDet = submenu1Config[l];
              if (currentItemDet.source == resultGeojsonPolygonDataSource._name)
              {
                var itemDetCell = "";
                var itemTitle = "";
                itemTitle = currentItemDet.title;
                if (currentItemDet.detail.length > 0 )
                {
                  itemDetCell += "<ul style='font-size: 15px;'>";

                  for (var m = 0; m < currentItemDet.detail.length; m++)
                  {
                    itemDetCell += "<li>" + currentItemDet.detail[m] + "</li>";
                  }
                  itemDetCell += "</ul>";
                }
                var imgUrl = "";
                imgUrl = currentItemDet.imageUrl;
                if (imgUrl != "")
                {
                  itemDetCell += "<a href='" + imgUrl + "' target='_blank'><img src='" + imgUrl + "' width='auto' height = '200px' style='display:block; margin:0 auto;' /></a>";
                }


                entity.name = itemTitle;
                entity.description = itemDetCell;
              }
            }

            
          }
          else if (resultGeojsonPolygonDataSource._name == "Habitat_20210419_wgs84.geojson" && resultGeojsonPolygonDataSource._name == currentItemConfig.source && currentItemConfig.name == entity.properties.Habitat._value.toLowerCase()) {
          
            // console.log("currentItemConfig.name", currentItemConfig.name);
            // console.log("entity.properties.Habitat._value.toLowerCase()", entity.properties.Habitat._value.toLowerCase());
            //console.log("entity.properties.Fauna._value", entity.properties.Fauna._value);
            //console.log("entity.properties.Flora._value", entity.properties.Flora._value);
            var floraFaunaCell= "";
            var ecoCell= "";
            for (var h = 0; h < submenuHabitatConfig.length; h++)
            {
              var currentHabitatDetail = submenuHabitatConfig[h];
              if (currentHabitatDetail.Name == entity.properties.Habitat._value.toLowerCase())
              {
                floraFaunaCell = currentHabitatDetail.Species;
                ecoCell = currentHabitatDetail.Ecological;
              }
            }
            // var faunaRaw = entity.properties.Fauna._value;
            // var fauna2Raw = entity.properties.Fauna2._value;
            // var floraRaw = entity.properties.Flora._value;
            // var floraFaunaCell= "";
            // if(!faunaRaw && !floraRaw)
            // {
            //   floraFaunaCell = "-"
            // }
            // else
            // {
            //   if (floraRaw != null)
            //   {
            //     floraFaunaCell += "Flora:"
            //     floraFaunaCell += "<ul style='margin-top: 0px; margin-bottom: 0px;'>"
            //     var floraArr = floraRaw.split(';');
            //     for (var m = 0; m <floraArr.length; m++)
            //     {
            //       floraFaunaCell += "<li>" + floraArr[m] + "</li>";
            //     }
            //     floraFaunaCell += "</ul>";
            //   }
            //   if (faunaRaw != null)
            //   {
            //     floraFaunaCell += "Fauna:"
            //     floraFaunaCell += "<ul style='margin-top: 0px; margin-bottom: 0px;'>"
            //     var faunaArr = faunaRaw.split(';');
            //     for (var n = 0; n <faunaArr.length; n++)
            //     {
            //       floraFaunaCell += "<li>" + faunaArr[n] + "</li>";
            //     }
            //     if(fauna2Raw != null)
            //     {
            //       faunaArr = fauna2Raw.split(';');
            //       for (var n = 0; n <faunaArr.length; n++)
            //       {
            //         floraFaunaCell += "<li>" + faunaArr[n] + "</li>";
            //       }
            //     }
            //     floraFaunaCell += "</ul>";
            //   }
            // }
            // //console.log("floraFaunaCell", floraFaunaCell);
            // var ecoRaw = entity.properties.Ecological._value;
            // var ecoCell= "";
            // if(ecoRaw == "")
            // {
            //   ecoCell = "-";
            // }
            // else{
            //   var ecoArr = ecoRaw.split(';');
            //   for (var l = 0; l <ecoArr.length; l++)
            //   {
            //     ecoCell += ecoArr[l] + "<br />";
            //   }
            // }


            var colorString = currentItemConfig.color;
            var imgUrl = currentItemConfig.imageUrl;
            entity.polygon.material = Cesium.Color.fromCssColorString(colorString).withAlpha(0.5);
            //entity.polygon.material = Cesium.Color.fromCssColorString(colorString);
            entity.polygon.outline = false;
            entity.name = entity.properties.Habitat._value;
            var infoWindowContent = "<table style='border-collapse:collapse;border-spacing:0;font-size:14px;'>";
            infoWindowContent += "<colgroup>";
            infoWindowContent += "<col style='width: 70px'>";
            infoWindowContent += "<col style='width: 170px'>";
            infoWindowContent += "<col style='width: 270px'>";
            infoWindowContent += "</colgroup>";
            infoWindowContent += "<thead>";
            infoWindowContent += "<tr>";
            infoWindowContent += "<td rowspan='2' style='background-color:#506382;border-color:#ffffff;border-style:solid;border-width:1px;'>Size (ha)</th>";
            infoWindowContent += "<td style='background-color:#506382;border-color:#ffffff;border-style:solid;border-width:1px;' >Within Assessment Area</th>";
            infoWindowContent += "<td style='background-color:#506382;border-color:#ffffff;border-style:solid;border-width:1px;' >" + entity.properties.AssessSize._value + "</th>";
            infoWindowContent += "</tr>";
            infoWindowContent += "<tr>";
            infoWindowContent += "<td style='background-color:#506382;border-color:#ffffff;border-style:solid;border-width:1px;' >Within Project Site</td>";
            infoWindowContent += "<td style='background-color:#506382;border-color:#ffffff;border-style:solid;border-width:1px;' >" + entity.properties.SiteSize._value + "</td>";
            infoWindowContent += "</tr>";
            infoWindowContent += "</thead>";
            infoWindowContent += "<tbody>";
            infoWindowContent += "<tr>";
            infoWindowContent += "<td colspan='2' style='background-color:#3e4d66;border-color:#ffffff;border-style:solid;border-width:1px;'>Species of conservation importance</td>";
            infoWindowContent += "<td style='background-color:#3e4d66;border-color:#ffffff;border-style:solid;border-width:1px;' >" + floraFaunaCell + "</td>";
            infoWindowContent += "</tr>";
            infoWindowContent += "<tr>";
            infoWindowContent += "<td colspan='2' style='background-color:#506382;border-color:#ffffff;border-style:solid;border-width:1px;'>Ecological Value</td>";
            infoWindowContent += "<td style='background-color:#506382;border-color:#ffffff;border-style:solid;border-width:1px;' >" + ecoCell + "</td>";
            infoWindowContent += "</tr>";
            infoWindowContent += "<tr>";
            
            if (imgUrl != "")
            {
              infoWindowContent += "<td colspan='3' style='background-color:#3e4d66;border-color:#ffffff;border-style:solid;border-width:1px; text-align:center; height:200px'>";
              infoWindowContent += "<a href='" + imgUrl + "' target='_blank'><img src='" + imgUrl + "' width='auto' height = '200px' /></a>";
            }
            else
            {
              infoWindowContent += "<td colspan='3' style='background-color:#3e4d66;border-color:#ffffff;border-style:solid;border-width:1px; text-align:center;'>";
              infoWindowContent += "Photo";
            }              
            infoWindowContent += "</td>";
            infoWindowContent += "</tr>";
            infoWindowContent += "</tbody>";

            infoWindowContent += "</table>";
            entity.description = infoWindowContent;

          }
          else if (resultGeojsonPolygonDataSource._name == "Habitat_20210419_ManMud_wgs84.geojson" && resultGeojsonPolygonDataSource._name == currentItemConfig.source && currentItemConfig.name == entity.properties.Habitat._value.toLowerCase()) {
            var colorString = currentItemConfig.color;
            entity.polygon.material = Cesium.Color.fromCssColorString(colorString).withAlpha(0.5);
            entity.polygon.outline = false;
          }
          else if (resultGeojsonPolygonDataSource._name == "Habitat_20210419_Mud_wgs84.geojson" && resultGeojsonPolygonDataSource._name == currentItemConfig.source && currentItemConfig.name == entity.properties.Habitat._value.toLowerCase()) {
            var colorString = currentItemConfig.color;
            entity.polygon.material = Cesium.Color.fromCssColorString(colorString).withAlpha(0.5);
            entity.polygon.outline = false;
          }
          else if (resultGeojsonPolygonDataSource._name == "Habitat_20210419_WooPla_wgs84.geojson" && resultGeojsonPolygonDataSource._name == currentItemConfig.source && currentItemConfig.name == entity.properties.Habitat._value.toLowerCase()) {
            var colorString = currentItemConfig.color;
            entity.polygon.material = Cesium.Color.fromCssColorString(colorString).withAlpha(0.5);
            entity.polygon.outline = false;
          }
          else if (resultGeojsonPolygonDataSource._name == "Habitat_20210419_Pla_wgs84.geojson" && resultGeojsonPolygonDataSource._name == currentItemConfig.source && currentItemConfig.name == entity.properties.Habitat._value.toLowerCase()) {
            var colorString = currentItemConfig.color;
            entity.polygon.material = Cesium.Color.fromCssColorString(colorString).withAlpha(0.5);
            entity.polygon.outline = false;
          }
          else if (resultGeojsonPolygonDataSource._name == "TaiHoWan_wgs84.geojson" && resultGeojsonPolygonDataSource._name == currentItemConfig.source ) {
            var colorString = currentItemConfig.color;
            entity.polygon.material = Cesium.Color.fromCssColorString(colorString).withAlpha(0.2);
            entity.polygon.outline = false;
          }
          else if ((resultGeojsonPolygonDataSource._name == "TungChungRiver_wgs84.geojson" || resultGeojsonPolygonDataSource._name == "WongLungHangNullah_wgs84.geojson") && resultGeojsonPolygonDataSource._name == currentItemConfig.source ) {
            var colorString = currentItemConfig.color;
            entity.polygon.material = Cesium.Color.fromCssColorString(colorString).withAlpha(0.5);
            entity.polygon.outline = false;
          }
          else if ((resultGeojsonPolygonDataSource._name == "CoastalProtectionArea_Merge_wgs84.geojson" || resultGeojsonPolygonDataSource._name == "ConservationArea_Merge_wgs84.geojson") && resultGeojsonPolygonDataSource._name == currentItemConfig.source ) {
            var colorString = currentItemConfig.color;
            entity.polygon.material = Cesium.Color.fromCssColorString(colorString).withAlpha(0.5);
            entity.polygon.outline = false;
          }
          else
          {
            
          }
          // else if (resultGeojsonPolygonDataSource._name == "Country_Park_for_TCLE_wgs84.geojson") {
          //   var colorString = currentItemConfig.color;
          //   entity.polygon.fill = false;
          //   entity.polygon.outline = true;
          //   entity.polygon.outlineColor = Cesium.Color.fromCssColorString(colorString);
          //   entity.polygon.extrudedHeight = 1;
          //   entity.polygon.outlineWidth = 15;
          //   entity.polygon.zIndex = 10;
          // }
          entity.polygon.classificationType = Cesium.ClassificationType.TERRAIN;
        }
      }
      // if ((resultGeojsonPolygonDataSource._name == "CEDD_TCNTE_PDA.geojson" || resultGeojsonPolygonDataSource._name == "CEDD_TCNTE_TCWRoad.geojson")  ) {        
      //   entity.polygon.material = Cesium.Color.GAINSBORO;
      //   //entity.polygon.material = Cesium.Color.fromCssColorString("#94A08B");
      //   entity.polygon.classificationType = Cesium.classificationType.TERRAIN;
      //   //console.log("CEDD_TCNTE_PDA.geojson || CEDD_TCNTE_TCWRoad.geojson");
      // }
    }
    
  })
}
//## 增加 geojson polyline Add geojson polyline
cesiumMap.addGeojsonPolyline = function ({
  url: url,
  menuId: menuId
}) {
  let viewer = cesiumMap.cesium.viewer;
  Cesium.GeoJsonDataSource.load(url).then(dataSource => {
    viewer.dataSources.add(dataSource);
    dataSource.show = false;
    var entities = dataSource.entities.values;

    var colorHash = {};
    for (var i = 0; i < entities.length; i++) {
      var entity = entities[i];
      // console.log("entity");
      // console.log(entity);
      if(entity.properties)
      {
        
        if(menuId == 1)
        {
          var layerProperty = entity.properties.Layer._value;
          for (var j = 0; j< pDescriptionColorConfig.length; j++) {
            var currentItemConfig =  pDescriptionColorConfig[j];
            if (currentItemConfig.source == dataSource._name)
            {
              var colorString = currentItemConfig.color;
              if (dataSource._name.includes("tunnel") || layerProperty == "03_Underground Works Site"){
                entity.polyline.material = new Cesium.PolylineDashMaterialProperty({
                  color: Cesium.Color.fromCssColorString(colorString)
                })
              }
              else
              {
                entity.polyline.material = Cesium.Color.fromCssColorString(colorString);
              }
              entity.polyline.width = 6;
            }
          }
        }
        else if(menuId == 41 || menuId == 42 || menuId == 43) // menu id head = 4 = corridor
        {
          
          var colorValue ;
          var datacolor;
          if(menuId == 41) //menuid 4 = corridor; 1 = Leq_day
          {
            colorValue = entity.properties.Leq_day._value;
          }
          else if(menuId == 42) //menuid 4 = corridor; 2 = Leq_night
          {
            colorValue = entity.properties.Leq_night._value;
          }
          else if(menuId == 43) //menuid 4 = corridor; 3 = Lmax_night
          {
            colorValue = entity.properties.Lmax_night._value;
          }
          
          if (colorValue >= 75 )
          {
            datacolor = "#8B0000";
          }
          else if(colorValue >= 72 )
          {
            datacolor = "#B22222";
          }
          else if(colorValue >= 69 )
          {
            datacolor = "#8B008B";
          }
          else if(colorValue >= 66 )
          {
            datacolor = "#9932CC";
          }
          else if(colorValue >= 63 )
          {
            datacolor = "#FF8C00";
          }
          else if(colorValue >= 60 )
          {
            datacolor = "#3CB371";
          }
          else 
          {
            datacolor = "#00FA9A";
          }
          entity.name = entity.properties.NSR_ID._value;
          entity.corridor = new Cesium.CorridorGraphics({
            positions : entity.polyline._positions._value.flat(),
            height : entity.properties.Height._value - 1.2,
            extrudedHeight : entity.properties.Height._value + entity.properties.ExtHeight._value - 1.2,
            width : 1.0,
            cornerType: Cesium.CornerType.BEVELED,
            material : Cesium.Color.fromCssColorString(datacolor).withAlpha(0.5),
            outline : true,
            outlineColor : Cesium.Color.fromCssColorString(datacolor).withAlpha(0.5)
          })

        }        
        else if (entity.properties.Type)
        {
          
          var typeProperty = entity.properties.Type._value;
        
          var lowerTypProperty = typeProperty.toLowerCase();
          //console.log(lowerTypProperty);
          //console.log("Polyline Entity " + i + " type prop: " + lowerTypProperty);
          for (var j = 0; j < ecologyColorConfig.length; j++)
          {
            var currentItemConfig =  ecologyColorConfig[j];
            if (currentItemConfig.source == dataSource._name && lowerTypProperty == currentItemConfig.name)
            {
              var colorString = currentItemConfig.color;
              entity.polyline.material = Cesium.Color.fromCssColorString(colorString);
              entity.polyline.width = 6;
            }
          }
        }
        else if(entity.properties.Layer) {
          var layerProperty = entity.properties.Layer._value;
          
          for (var j = 0; j < ecologyColorConfig.length; j++)
          {
            var currentItemConfig =  ecologyColorConfig[j];
            if (currentItemConfig.source == dataSource._name && layerProperty == currentItemConfig.name)
            {
              
              var colorString = currentItemConfig.color;
              if (layerProperty === "02_TCW_EXT_Tunnel" || layerProperty === "03_Underground Works Site")
              {
                entity.polyline.material = new Cesium.PolylineDashMaterialProperty({
                  color: Cesium.Color.fromCssColorString(colorString)
                })
              }
              else if(layerProperty === "Ecologically Important Streams")
              {
                entity.polyline.material = Cesium.Color.fromCssColorString(colorString);
                    
                for (var l = 0; l < submenu1Config.length; l++)
                {
                  var currentItemDet = submenu1Config[l];
                  if (currentItemDet.source == dataSource._name)
                  {
                    var itemDetCell = "";
                    var itemTitle = "";
                    itemTitle = currentItemDet.title;
                    if (currentItemDet.detail.length > 0 )
                    {
                      itemDetCell += "<ul>";

                      for (var m = 0; m < currentItemDet.detail.length; m++)
                      {
                        itemDetCell += "<li>" + currentItemDet.detail[m] + "</li>";
                      }
                      itemDetCell += "</ul>";
                    }
                    var imgUrl = "";
                    imgUrl = currentItemDet.imageUrl;
                    if (imgUrl != "")
                    {
                      itemDetCell += "<a href='" + imgUrl + "' target='_blank'><img src='" + imgUrl + "' width='auto' height = '200px' style='display:block; margin:0 auto;' /></a>";
                    }

                    entity.name = itemTitle;
                    entity.description = itemDetCell;
                  }
                }
              }
              else
              {
                entity.polyline.material = Cesium.Color.fromCssColorString(colorString);
              }
              entity.polyline.width = 6;
            }
          }
        }
        else if(entity.properties.RefName) {
          var layerProperty = entity.properties.RefName._value;
          
          for (var j = 0; j < ecologyColorConfig.length; j++)
          {
            var currentItemConfig =  ecologyColorConfig[j];
            if (currentItemConfig.source == dataSource._name && currentItemConfig.name == "Ecologically Important Streams")
            {
              
              var colorString = currentItemConfig.color;
              entity.polyline.material = Cesium.Color.fromCssColorString(colorString);
                    
              for (var l = 0; l < submenu1Config.length; l++)
              {
                var currentItemDet = submenu1Config[l];
                if (currentItemDet.source == dataSource._name)
                {
                  var itemDetCell = "";
                  var itemTitle = "";
                  itemTitle = currentItemDet.title;
                  if (currentItemDet.detail.length > 0 )
                  {
                    itemDetCell += "<ul>";

                    for (var m = 0; m < currentItemDet.detail.length; m++)
                    {
                      itemDetCell += "<li>" + currentItemDet.detail[m] + "</li>";
                    }
                    itemDetCell += "</ul>";
                  }
                  var imgUrl = "";
                  imgUrl = currentItemDet.imageUrl;
                  if (imgUrl != "")
                  {
                    itemDetCell += "<a href='" + imgUrl + "' target='_blank'><img src='" + imgUrl + "' width='auto' height = '200px' style='display:block; margin:0 auto;' /></a>";
                  }

                  entity.name = itemTitle;
                  entity.description = itemDetCell;
                }
              }
              entity.polyline.width = 6;
            }
          }
        }
        else
        {
          for (var j = 0; j < ecologyColorConfig.length; j++)
          {
            var currentItemConfig =  ecologyColorConfig[j];
            if (currentItemConfig.source == dataSource._name )
            {
              var colorString = currentItemConfig.color;
              entity.polyline.material = Cesium.Color.fromCssColorString(colorString);
              entity.polyline.width = 6;
            }
          }
        }
        entity.polyline.classificationType = Cesium.ClassificationType.TERRAIN;
      }
      else
      {
        console.log("no properties");
        
        
      }





      // entity.name = entity.properties.gridcode;
      // var name = entity.properties.gridcode;
      // var color = colorHash[name];
      // if (!color) {
      //   color = Cesium.Color.fromRandom({
      //     alpha: 1.0,
      //   });
      //   colorHash[name] = color;
      // }
      // entity.polyline.material = color;
    }
  })
}


cesiumMap.addGeojsonPoint = function ({
  url: url,
  menuId: menuId
}) {
  let viewer = cesiumMap.cesium.viewer;
  Cesium.GeoJsonDataSource.load(url).then(dataSource => {
    //console.log('addPoint', dataSource)
    viewer.dataSources.add(dataSource);
    dataSource.show = false;
    var entities = dataSource.entities.values;

    for (var i = 0; i < entities.length; i++) {
      var entity = entities[i];
      if(menuId == 411 || menuId == 412 || menuId == 413) //411 = building 1 leq_day; 412 = building 1 leq_night; 413 = building 1 lmax_night
      {
        var colorValue ;
        var datacolor;
        var valueCriteriaArray ;
        if(menuId == 411) //menuid 4 building 1 ; 1 = Leq_day
        {
          colorValue = entity.properties.Leq_D_Com._value;
        }
        else if(menuId == 412) //menuid 4 building 1; 2 = Leq_night
        {
          colorValue = entity.properties.Leq_N_Com._value;
        }
        else if(menuId == 413) //menuid 4 building 1; 3 = Lmax_night
        {
          colorValue = parseFloat(entity.properties.Lmax_Com._value);
        }
        
        if (colorValue == 1)
        {
          datacolor = "#993300";
        }
        else if (colorValue == 2)
        {
          datacolor = "#0099FF";
        }
        else 
        {
          datacolor = "#A9D08E";
        }
          
        entity.billboard = undefined;
        entity.point = {
          pixelSize: 10,
          color: Cesium.Color.fromCssColorString(datacolor),
          outlineWidth: 0,
          //heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
          distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 4000),
          //disableDepthTestDistance: Number.POSITIVE_INFINITY,
          show: true
        }
      }
      else
      {
        var typeProperty = entity.properties.Type._value;      
        if(typeProperty)
        {
          var lowerTypProperty = typeProperty.toLowerCase();
          //console.log(lowerTypProperty);
          //console.log("Point Entity " + i + " type prop: " + lowerTypProperty);
          for (var j = 0; j < ecologyColorConfig.length; j++)
          {
            var currentItemConfig =  ecologyColorConfig[j];
            if (currentItemConfig.source == dataSource._name && lowerTypProperty == currentItemConfig.name)
            {
              var colorString = currentItemConfig.color;
              //console.log("colorString: " + colorString);
              //console.log(entity);
              entity.billboard = undefined;
              entity.point = {
                pixelSize: 35,
                color: Cesium.Color.fromCssColorString(colorString),
                outlineWidth: 3,
                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 4000),
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
                show: true
              }
              //console.log("ok");
            }
          }
        }
      }
      

      // entity.name = entity.properties.gridcode;
      // var name = entity.properties.gridcode;
      // var color = colorHash[name];
      // if (!color) {
      //   color = Cesium.Color.fromRandom({
      //     alpha: 1.0,
      //   });
      //   colorHash[name] = color;
      // }
      // entity.polyline.material = color;
    }
  })
}

cesiumMap.addGeojsonPointPin = function ({
  url: url
}) {
  let viewer = cesiumMap.cesium.viewer;
  Cesium.GeoJsonDataSource.load(url).then(dataSource => {
    //console.log('addPoint', dataSource)
    viewer.dataSources.add(dataSource);
    var entities = dataSource.entities.values;
    

    for (var i = 0; i < entities.length; i++) {
      var entity = entities[i];
      var olPositionCartographic = Cesium.Cartographic.fromCartesian(entity.position);
      var floFauProperty = entity.properties.Fl_Fa._value; 
      if(floFauProperty)
      {
        var noSpaceFloFauProperty = floFauProperty.replace(/\s+/g, '');
        var imgURL = "img/bb_Icons/" + noSpaceFloFauProperty + ".jpg";
        
        var bmURL = Cesium.buildModuleUrl(imgURL);
        // option 1 ++++++++++++++++
        //console.log('entity.position', entity.position);
        // var myPin = Cesium.when(pinBuilder.fromURL(bmURL, Cesium.Color.GREEN, 48), function(canvas) {
        //   console.log('entity.position', entity.position);
        //   return viewer.entities.add({
        //     name : 'Point ' + i.toString(),
        //     position: entity.position,
        //     billboard: {
        //       image: canvas.toDataURL(),
        //       verticalOrigin: Cesium.VerticalOrigin.BOTTOM
        //     }

        //   })
        // });

        // option 2 ++++++++++++++++
        var pinBuilder = new Cesium.PinBuilder();
        imgURL = "https://toppng.com/uploads/preview/home-icon-free-11549922775iqxl34wxso.png";
        entity.billboard = {
          image: pinBuilder.fromUrl(imgURL,  Cesium.Color.GREEN, 48).toDataURL(),
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM
        };
        entity.point = undefined;

        // // option 3 ++++++++++++++++
        // //imgURL ="img/arup-logo.png";
        // //imgURL ="assets/logo.png";
        // imgURL = "https://toppng.com/uploads/preview/home-icon-free-11549922775iqxl34wxso.png";
        // bmURL = Cesium.buildModuleUrl(imgURL);
        // // console.log("imgURL",imgURL);
        // // console.log("bmURL",bmURL);
        // var myPin = Cesium.when(
        //   pinBuilder.fromUrl(imgURL, Cesium.Color.GREEN, 48),
        //   function (canvas) {
        //     console.log("imgURL",imgURL);
        //     // return viewer.entities.add({
        //     //   name: "test" + i.toString(),
        //     //   position: entity.position,
        //     //   billboard: {
        //     //     image: canvas.toDataURL(),
        //     //     verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        //     //   },
        //     // });
        //   }
        // );
        
        

      }





      // entity.name = entity.properties.gridcode;
      // var name = entity.properties.gridcode;
      // var color = colorHash[name];
      // if (!color) {
      //   color = Cesium.Color.fromRandom({
      //     alpha: 1.0,
      //   });
      //   colorHash[name] = color;
      // }
      // entity.polyline.material = color;
    }
  })
}

function speciesImageExist(imageName) {
  var isExist = false;
  for (var i = 0; i < speciesImageListConfig.length; i++) {
    var currentFileName = speciesImageListConfig[i].name;
    if (currentFileName == imageName)
    {
      isExist = true;
      break;
    }
  }
  return isExist;
}
function speciesImageWidth(imageName) {
  var w = 0;
  for (var i = 0; i < speciesImageListConfig.length; i++) {
    var currentFileName = speciesImageListConfig[i].name;
    if (currentFileName == imageName)
    {
      w = speciesImageListConfig[i].width;
      break;
    }
  }
  return w;
}
function speciesImageHeight(imageName) {
  var h = 0;
  for (var i = 0; i < speciesImageListConfig.length; i++) {
    var currentFileName = speciesImageListConfig[i].name;
    if (currentFileName == imageName)
    {
      h = speciesImageListConfig[i].height;
      break;
    }
  }
  return h;
}

cesiumMap.addGeojsonPointBb = function ({
  url: url
}) {
  let viewer = cesiumMap.cesium.viewer;
  Cesium.GeoJsonDataSource.load(url).then(dataSource => {
    //console.log('addPoint', dataSource)
    viewer.dataSources.add(dataSource);
    dataSource.show = false;
    var entities = dataSource.entities.values;
    var pinBuilder = new Cesium.PinBuilder();
    
    for (var i = 0; i < entities.length; i++) {
      var entity = entities[i];

      var floFauProperty = entity.properties.Flora_Faun._value; 
      if(floFauProperty)
      {
        var noSpaceFloFauProperty = floFauProperty.replace(/\s+/g, '');
        var imgURL = "img/bb_Icons/" + noSpaceFloFauProperty + ".png";
        var iconColor;
        if (noSpaceFloFauProperty == "Amphibian")
        {
          iconColor = Cesium.Color.LIME;          
        }
        else if(noSpaceFloFauProperty == "AquaticCommunity")
        {
          iconColor = Cesium.Color.fromCssColorString("#0000FF");
        }
        else if(noSpaceFloFauProperty == "Bird")
        {
          iconColor = Cesium.Color.fromCssColorString("#D0312D");
        }
        else if(noSpaceFloFauProperty == "Butterfly")
        {
          iconColor = Cesium.Color.fromCssColorString("#EFFD5F");
        }
        else if(noSpaceFloFauProperty == "Dragonfly")
        {
          iconColor = Cesium.Color.fromCssColorString("#A03CAE");
        }
        else if(noSpaceFloFauProperty == "IntertidalCommunity")
        {
          iconColor = Cesium.Color.fromCssColorString("#58CCED");
        }
        else if(noSpaceFloFauProperty == "Plant")
        {
          iconColor = Cesium.Color.fromCssColorString("#4FA64F");
        }
        else if(noSpaceFloFauProperty == "Reptile-Gecko")
        {
          iconColor = Cesium.Color.fromCssColorString("#5C2C06");
        }
        else if(noSpaceFloFauProperty == "TerrestrialMammal")
        {
          iconColor = Cesium.Color.fromCssColorString("#FCAE1E");
        }

        var noSpaceSpeciesProperty = entity.properties.Species._value.replace(/\s+/g, '');
        noSpaceSpeciesProperty = noSpaceSpeciesProperty.replace(/'/g, '');
        var speciesImageName = noSpaceSpeciesProperty + ".jpg";
        var speciesImgURL = "img/spc/" + noSpaceSpeciesProperty + ".jpg"
        
        entity.billboard = {
          image: pinBuilder.fromUrl(imgURL, iconColor, 50), // default: undefined
          //image: imgURL, // default: undefined
          show: true, // default,
          distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 5000),
          heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
          // pixelOffset: new Cesium.Cartesian2(0, -50), // default: (0, 0)
          // eyeOffset: new Cesium.Cartesian3(0.0, 0.0, 0.0), // default
          // horizontalOrigin: Cesium.HorizontalOrigin.CENTER, // default
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM // default: CENTER
          // scale: 2.0, // default: 1.0
          // color: Cesium.Color.LIME, // default: WHITE
          // rotation: Cesium.Math.PI_OVER_FOUR, // default: 0.0
          // alignedAxis: Cesium.Cartesian3.ZERO, // default
          // width: 100, // default: undefined
          // height: 25, // default: undefined
        };
        entity.point = undefined;
        entity.name = entity.properties.Species._value;
        var infoWindowContent = "";
        if(speciesImageExist(speciesImageName))
        {
          infoWindowContent += '<div style="text-align: center; height:' + speciesImageHeight(speciesImageName) + 'px; "><a href="' + speciesImgURL + '" target="_blank"><img src="' + speciesImgURL + '" style="display:block; margin:0 auto;" /></a></div>';
        }        
        infoWindowContent += "<table style='border-collapse:collapse;border-spacing:0;font-size:12px;'>";
        infoWindowContent += "<colgroup>";
        infoWindowContent += "<col style='width: 270px'>";
        infoWindowContent += "<col style='width: 270px'>";
        infoWindowContent += "</colgroup>";
        infoWindowContent += "<tbody>";
        infoWindowContent += "<tr>";
        infoWindowContent += "<td style='background-color:#3e4d66;border-color:#ffffff;border-style:solid;border-width:1px;'>Recorded Habitat</td>";
        infoWindowContent += "<td style='background-color:#3e4d66;border-color:#ffffff;border-style:solid;border-width:1px;' >" + entity.properties.Recorded_h._value + "</td>";
        infoWindowContent += "</tr>";
        infoWindowContent += "<tr>";
        infoWindowContent += "<td colspan='2' style='background-color:#506382;border-color:#ffffff;border-style:solid;border-width:1px;text-align:center;'><a href='" + entity.properties.Link_eng_._value + "' target='_blank'>Link to more information</a></td>";
        infoWindowContent += "</tr>";
        infoWindowContent += "</tbody>";

        infoWindowContent += "</table>";
        entity.description = infoWindowContent;

      }


    }
  })
}



//## 增加 geojson billboard，待办，测试数据 Add geojson billboard, to-do, test data
var temData = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "abbreviation": "F",
        "category": "Flora",
        "color": "#F9ACF5",
        "species": "Aquilaria sinensis",
        "speciesid": 1
      },
      "geometry": {
        "type": "Point",
        "coordinates": [
          114.10194396972656,
          22.535232038124086
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "abbreviation": "F",
        "category": "Flora",
        "color": "#acf9e4",
        "species": "Aquilaria sinensis",
        "speciesid": 2
      },
      "geometry": {
        "type": "Point",
        "coordinates": [
          114.12872314453125,
          22.524370661516432
        ]
      }
    }
  ]
}

cesiumMap.addGeojsonBillboard = function ({ data: data }) {//针对于 point 数据，我不能用 Cesium.GeojsonDataSource 加载了。 For point data, I cannot load it with Cesium.GeojsonDataSource.
  console.log('billboard', data)
  console.log(data.features)
  let viewer = cesiumMap.cesium.viewer;
  data.features.forEach(element => {

    viewer.entities.add({
      position: Cesium.Cartesian3.fromDegrees(element.geometry.coordinates[0], element.geometry.coordinates[1], 15),
      // ellipse: {
      //   semiMinorAxis: 10,
      //   semiMajorAxis: 10,
      //   height: 30,
      //   material: Cesium.Color.fromCssColorString(element.properties.color),
      //   outline: true, // height must be set for outline to display
      //   outlineWidth: 13,
      //   heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
      //   distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 4000)
      // },
      point: {
        pixelSize: 35,
        //color: Cesium.Color.fromCssColorString(element.properties.color),
        color: Cesium.Color.fromCssColorString(colorString),
        outlineWidth: 3,
        heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 10000)
      },
    });

    viewer.entities.add({
      position: Cesium.Cartesian3.fromDegrees(element.geometry.coordinates[0], element.geometry.coordinates[1], 16),
      label: {
        text: element.properties.abbreviation + element.properties.speciesid,
        font: "15px Helvetica",
        fillColor: Cesium.Color.fromCssColorString("#272822"),
        heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 10000)
      }
    });
  });
}

cesiumMap.addGeojsonBillboardTest = function ({ data: data }) {//针对于 point 数据，我不能用 Cesium.GeojsonDataSource 加载了。 For point data, I cannot load it with Cesium.GeojsonDataSource.
  //console.log('billboard', data)
  //console.log(data.features)
  let viewer = cesiumMap.cesium.viewer;
  data.features.forEach(element => {
var url = Cesium.buildModuleUrl("img/bb_Icons/")
    viewer.entities.add({
      position: Cesium.Cartesian3.fromDegrees(element.geometry.coordinates[0], element.geometry.coordinates[1], 15),
      // ellipse: {
      //   semiMinorAxis: 10,
      //   semiMajorAxis: 10,
      //   height: 30,
      //   material: Cesium.Color.fromCssColorString(element.properties.color),
      //   outline: true, // height must be set for outline to display
      //   outlineWidth: 13,
      //   heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
      //   distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 4000)
      // },
      point: {
        pixelSize: 35,
        //color: Cesium.Color.fromCssColorString(element.properties.color),
        color: Cesium.Color.fromCssColorString(colorString),
        outlineWidth: 3,
        heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 10000)
      },
    });

    viewer.entities.add({
      position: Cesium.Cartesian3.fromDegrees(element.geometry.coordinates[0], element.geometry.coordinates[1], 16),
      label: {
        text: element.properties.abbreviation + element.properties.speciesid,
        font: "15px Helvetica",
        fillColor: Cesium.Color.fromCssColorString("#272822"),
        heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 10000)
      }
    });
  });
}

/* ---------------------------- 各种 entity 图层的样式调整 Style adjustment of various entity layers--------------------------- */
//## 关闭或开启某个entity图层 Turn off or turn on an entity layer
cesiumMap.turnOffEntity = function (params) {
  let viewer = cesiumMap.cesium.viewer;
  if (params) {//如果 params 为真就移除,需要 vue 传递给一个参数，默认为 true，切换一次为 false  If params is true, remove it, you need to pass a parameter to vue, the default is true, switch once to false
    viewer.entities.removeAll();//这个可以移除通过 viewer.entities.add 添加的 entity  This can remove the entity added by viewer.entities.add
    viewer.dataSources.removeAll()//这个可以移除通过 viewer.dataSources.add(dataSource); 增加的 entity  This can remove the entity added by viewer.dataSources.add(dataSource);
  } else {//如果 params 为假就重新添加已经移除的 entity  If params is false, add the removed entity again
    cesiumMap.addGeojsonPolygon({
      data: "geojson/Country_Park_for_TCLE_wgs84.geojson",
      //data: myMapBox.resultGeojsonPolygon,

    })
    // cesiumMap.addGeojsonBillboard({
    //   data: myMapBox.speciesGeojson
    //   // data: temData


    // })
  }

}
// another way to switch layer on / off ###########################################################################################
cesiumMap.switchLayer = function (layerKey) {  // layerKey = the group of layers to swtich
  let viewer = cesiumMap.cesium.viewer;
  var layerToSwitch = [];
  for (var j = 0; j < ecologyColorConfig.length; j++)
  {
    var currentItemConfig =  ecologyColorConfig[j];
    if (currentItemConfig.group == layerKey)
    {      
      var sourceName = currentItemConfig.source;      
      var itemIndex = layerToSwitch.indexOf(sourceName);
      if (itemIndex < 0 )
      {
        layerToSwitch.push(sourceName);
      }

    }
  }
  for (var i = 0; i <layerToSwitch.length; i++)
  {
    var sourceName = layerToSwitch[i];
    var dataSource = viewer.dataSources.getByName(sourceName);
    //comment on 2022-01-04 1345, Chrome debug show error, don't know why
    dataSource[0].show = !dataSource[0].show;
    
  }
}

cesiumMap.switchLayerOff = function (layerKey) {  // layerKey = the group of layers to swtich
  let viewer = cesiumMap.cesium.viewer;
  var layerToSwitch = [];
  for (var j = 0; j < ecologyColorConfig.length; j++)
  {
    var currentItemConfig =  ecologyColorConfig[j];
    if (currentItemConfig.group == layerKey)
    {      
      var sourceName = currentItemConfig.source;      
      var itemIndex = layerToSwitch.indexOf(sourceName);
      if (itemIndex < 0 )
      {
        layerToSwitch.push(sourceName);
      }

    }
  }
  for (var i = 0; i <layerToSwitch.length; i++)
  {
    var sourceName = layerToSwitch[i];
    var dataSource = viewer.dataSources.getByName(sourceName);
    dataSource[0].show = false;
  }
}
cesiumMap.switchProjectDescLayerOff = function (layerKey) {  // layerKey = the group of layers to swtich
  let viewer = cesiumMap.cesium.viewer;
  var layerToSwitch = [];
  for (var j = 0; j < pDescriptionColorConfig.length; j++)
  {
    var currentItemConfig =  pDescriptionColorConfig[j];
    for (var k = 0; k < currentItemConfig.group.length; k++)
    {
      if (currentItemConfig.group[k] == layerKey)
      {      
        var sourceName = currentItemConfig.source;      
        var itemIndex = layerToSwitch.indexOf(sourceName);
        if (itemIndex < 0 )
        {
          layerToSwitch.push(sourceName);
        }
      }
    }
  }
  for (var i = 0; i <layerToSwitch.length; i++)
  {
    var sourceName = layerToSwitch[i];
    var dataSource = viewer.dataSources.getByName(sourceName);
    //console.log("sourceName", sourceName);
    dataSource[0].show = false;
  }
}
cesiumMap.switchNoiseLayerOffAll = function () {  // layerKey = the name of layers to swtich
  let viewer = cesiumMap.cesium.viewer;
  var layerToSwitch = [];
  for (var j = 0; j < noiseColorConfig.length; j++)
  {
    var currentItemConfig =  noiseColorConfig[j];
    var sourceName = currentItemConfig.source; 
    layerToSwitch.push(sourceName);
  }
  for (var i = 0; i <layerToSwitch.length; i++)
  {
    var sourceName = layerToSwitch[i];
    var dataSource = viewer.dataSources.getByName(sourceName);
    //console.log("sourceName", sourceName);
    dataSource[0].show = false;
  }
}
cesiumMap.switchNoiseLayerOff = function (layerKey) {  // layerKey = the name of layers to swtich
  let viewer = cesiumMap.cesium.viewer;
  var layerToSwitch = [];
  for (var j = 0; j < noiseColorConfig.length; j++)
  {
    var currentItemConfig =  noiseColorConfig[j];
    if (currentItemConfig.name == layerKey)
    {
      var sourceName = currentItemConfig.source; 
      layerToSwitch.push(sourceName);
    }
  }
  for (var i = 0; i <layerToSwitch.length; i++)
  {
    var sourceName = layerToSwitch[i];
    var dataSource = viewer.dataSources.getByName(sourceName);
    //console.log("sourceName", sourceName);
    dataSource[0].show = false;
  }
}
cesiumMap.switchLayerOn = function (layerKey) {  // layerKey = the group of layers to swtich
  let viewer = cesiumMap.cesium.viewer;
  var layerToSwitch = [];
  for (var j = 0; j < ecologyColorConfig.length; j++)
  {
    var currentItemConfig =  ecologyColorConfig[j];
    if (currentItemConfig.group == layerKey)
    {      
      var sourceName = currentItemConfig.source;      
      var itemIndex = layerToSwitch.indexOf(sourceName);
      if (itemIndex < 0 )
      {
        layerToSwitch.push(sourceName);
      }

    }
  }
  for (var i = 0; i <layerToSwitch.length; i++)
  {
    var sourceName = layerToSwitch[i];
    var dataSource = viewer.dataSources.getByName(sourceName);
    dataSource[0].show = true;
  }
}
cesiumMap.switchProjectDescLayerOn = function (layerKey) {  // layerKey = the group of layers to swtich
  let viewer = cesiumMap.cesium.viewer;
  var layerToSwitch = [];
  for (var j = 0; j < pDescriptionColorConfig.length; j++)
  {
    var currentItemConfig =  pDescriptionColorConfig[j];
    for (var k = 0; k < currentItemConfig.group.length; k++)
    {
      if (currentItemConfig.group[k] == layerKey)
      {      
        var sourceName = currentItemConfig.source;      
        var itemIndex = layerToSwitch.indexOf(sourceName);
        if (itemIndex < 0 )
        {
          layerToSwitch.push(sourceName);
        }
      }
    }
  }
  for (var i = 0; i <layerToSwitch.length; i++)
  {
    var sourceName = layerToSwitch[i];
    var dataSource = viewer.dataSources.getByName(sourceName);
    //console.log("sourceName", sourceName)
    dataSource[0].show = true;
  }
}
cesiumMap.switchNoiseLayerOn = function (layerKey) {  // layerKey = the name of layers to swtich
  let viewer = cesiumMap.cesium.viewer;
  var layerToSwitch = [];
  for (var j = 0; j < noiseColorConfig.length; j++)
  {
    var currentItemConfig =  noiseColorConfig[j];
    if (currentItemConfig.name == layerKey)
    {
      var sourceName = currentItemConfig.source; 
      layerToSwitch.push(sourceName);
    }
  }
  for (var i = 0; i <layerToSwitch.length; i++)
  {
    var sourceName = layerToSwitch[i];
    var dataSource = viewer.dataSources.getByName(sourceName);
    //console.log("sourceName", sourceName);
    dataSource[0].show = true;
  }
}
cesiumMap.switchTCETCWOff = function() {
  let viewer = cesiumMap.cesium.viewer;
  for (var i = 0; i <viewer.scene.primitives._primitives.length - 1; i++)
  {
    if (viewer.scene.primitives._primitives[i]._basePath =="tiles/3dtiles/TCE_v2/" || viewer.scene.primitives._primitives[i]._basePath =="tiles/3dtiles/TCW/" )
    {
      viewer.scene.primitives._primitives[i].show = false;
    }
  }
  //console.log("viewer.scene.primitives._primitives[0]", viewer.scene.primitives._primitives[0])
  //viewer.scene.primitives._primitives[0].show = false;
}
cesiumMap.switchTCETCWOn = function() {
  let viewer = cesiumMap.cesium.viewer;
  for (var i = 0; i <viewer.scene.primitives._primitives.length - 1; i++)
  {
    if (viewer.scene.primitives._primitives[i]._basePath =="tiles/3dtiles/TCE_v2/" || viewer.scene.primitives._primitives[i]._basePath =="tiles/3dtiles/TCW/" )
    {
      viewer.scene.primitives._primitives[i].show = true;
    }
  }
  //console.log("viewer.scene.primitives._primitives[0]", viewer.scene.primitives._primitives[0]._basePath)
  //viewer.scene.primitives._primitives[0].show = true;
}
cesiumMap.switchWithBarrierOff = function() {
  let viewer = cesiumMap.cesium.viewer;
  for (var i = 0; i <viewer.scene.primitives._primitives.length - 1; i++)
  {
    if (viewer.scene.primitives._primitives[i]._basePath =="tiles/3dtiles/TCE_v2_Barrier/" )
    {
      viewer.scene.primitives._primitives[i].show = false;
    }
  }
  //console.log("viewer.scene.primitives._primitives[0]", viewer.scene.primitives._primitives[0])
  //viewer.scene.primitives._primitives[0].show = false;
}
cesiumMap.switchWithBarrierOn = function() {
  let viewer = cesiumMap.cesium.viewer;
  for (var i = 0; i <viewer.scene.primitives._primitives.length - 1; i++)
  {
    if (viewer.scene.primitives._primitives[i]._basePath =="tiles/3dtiles/TCE_v2_Barrier/")
    {
      viewer.scene.primitives._primitives[i].show = true;
    }
  }
  //console.log("viewer.scene.primitives._primitives[0]", viewer.scene.primitives._primitives[0]._basePath)
  //viewer.scene.primitives._primitives[0].show = true;
}
cesiumMap.switchWithoutBarrierOff = function() {
  let viewer = cesiumMap.cesium.viewer;
  for (var i = 0; i <viewer.scene.primitives._primitives.length - 1; i++)
  {
    if (viewer.scene.primitives._primitives[i]._basePath =="tiles/3dtiles/TCE_v2_NoBarrier_v2/" )
    {
      viewer.scene.primitives._primitives[i].show = false;
    }
  }
  //console.log("viewer.scene.primitives._primitives[0]", viewer.scene.primitives._primitives[0])
  //viewer.scene.primitives._primitives[0].show = false;
}
cesiumMap.switchWithoutBarrierOn = function() {
  let viewer = cesiumMap.cesium.viewer;
  for (var i = 0; i <viewer.scene.primitives._primitives.length - 1; i++)
  {
    if (viewer.scene.primitives._primitives[i]._basePath =="tiles/3dtiles/TCE_v2_NoBarrier_v2/")
    {
      viewer.scene.primitives._primitives[i].show = true;
    }
  }
  //console.log("viewer.scene.primitives._primitives[0]", viewer.scene.primitives._primitives[0]._basePath)
  //viewer.scene.primitives._primitives[0].show = true;
}
//## 调整entity 图层的透明度  Adjust the transparency of the entity layer
cesiumMap.switchEntityTransparency = function (params) {//
  let viewer = cesiumMap.cesium.viewer;
  viewer.dataSources.removeAll()
  viewer.dataSources.add(resultGeojsonPolygonDataSource);
  var entities = resultGeojsonPolygonDataSource.entities.values;
  var colorHash = {};
  for (var i = 0; i < entities.length; i++) {
    var entity = entities[i];
    entity.name = entity.properties.gridcode;
    var name = entity.properties.gridcode;
    var colorString = landuseColorConfig[name._value]
    entity.polygon.material = Cesium.Color.fromCssColorString(colorString).withAlpha(params);

    entity.polygon.outline = false;
  }
}

function add3dTiles222(viewer, url, laz, color, opacity, zoomto) {
  console.log(url)
 /* var tileset = viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
    url: url,
    modelMatrix: Cesium.Matrix4.fromArray([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]),
    maximumScreenSpaceError: isMobile.any ? 64 : 4, //for better visualisation from the mobile devices
    maximumNumberOfLoadedTiles: isMobile.any ? 1000 : 100000000,
    luminanceAtZenith: laz,
  }));*/
  // cesiumMap.change3dTilesTransparency();
}

// ss
function add3dTiles(viewer, url, laz, color, opacity, zoomto) {
  /* backup
  var tileset = viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
    url: url,   
    modelMatrix: Cesium.Matrix4.fromArray([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]),
    maximumScreenSpaceError: isMobile.any ? 64 : 4, //for better visualisation from the mobile devices
    //maximumNumberOfLoadedTiles: isMobile.any ? 1000 : 100000000,
    maximumNumberOfLoadedTiles: isMobile.any ? 100 : 100000000, //added on 22/01/05 for iPhone tesing
    maximumMemoryUsage: isMobile.any ? 10: 512, //added on 22/01/05 for iPhone tesing
    luminanceAtZenith: laz,
  }));*/

  // for iPhone testing
  var tileset = viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
    url: url,   
    modelMatrix: Cesium.Matrix4.fromArray([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]),
    maximumScreenSpaceError:  64, //for better visualisation from the mobile devices
    //maximumNumberOfLoadedTiles: isMobile.any ? 1000 : 100000000,
    maximumNumberOfLoadedTiles:  isMobile.any ? 1000 : 100000000, //added on 22/01/05 for iPhone tesing
    maximumMemoryUsage:  isMobile.any ? 50 : 200, //added on 22/01/05 for iPhone tesing
    luminanceAtZenith: laz,
  }));

    // tileset.allTilesLoaded.addEventListener(function () {
  //   console.log('All tiles are loaded');
  // });
  tileset.style = new Cesium.Cesium3DTileStyle({
    color : "color('"+ color +"',"+ opacity +")",
    show: true,
  });
  
  if (zoomto){
    viewer.zoomTo(tileset);
  };
  // cesiumMap.change3dTilesTransparency();
}
//

function addglft(viewer, posX, posY, url, zoomto)
{
  var entityglft = viewer.entities.add({
    name: 'test',
    position: Cesium.Cartesian3.fromDegrees(113.9599695238, 22.2964514514, 250.0),
    model: {
      uri: 'TCE18_P1.gltf',
      //uri: 'free_car_001.gltf',
      minimumPixelSize: 128,
      maximumScale: 20000
      //heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
      //color: Cesium.Color.GAINSBORO
    }
  });
  console.log('model inited');
  viewer.zoomTo(entityglft);
  console.log('tried zoom');

  // var modelGltf = viewer.scene.primitives.add(Cesium.Model.fromGltf({
  //   url: 'TCE18_P01.gltf',
  //   modelMatrix: Cesium.Transforms.eastNorthUpToFixedFrame(Cesium.Cartesian3.fromDegrees(113.9599695238, 22.2964514514, 0.0))
  //   //modelMatrix: Cesium.Matrix4.fromArray([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]),
  //   //color: Cesium.Color.GAINSBORO
  //   //scale: 3
  // }));

  // var gltfModel = Cesium.Model.fromGltf({
  //   url: 'TCE18_P01.gltf',
  //   modelMatrix: Cesium.Transforms.eastNorthUpToFixedFrame(Cesium.Cartesian3.fromDegrees(113.9599695238, 22.2964514514, 0.0))
  // });
  // console.log('model inited');
  // gltfModel.then(function(model){
  //   console.log('start promise');
  //   viewer.scene.primitives.add(model);

  //   console.log('after fromGltf');
  //   if (zoomto){
  //     viewer.zoomTo(gltfModel);
  //     console.log('zoomed to Gltf');
  //   }
  // }).otherwise(function(e){
  //   alert(e);
  // });

}

cesiumMap.change3dTilesTransparency = function () {
  //下面的样式配置后续再研究吧，感觉默认的挺好看的。 Let's study the following style configuration later, I feel that the default one is pretty good.
  var HKTilesetStyle = new Cesium.Cesium3DTileStyle({
    'color': {
      'conditions': [
        // ['${z} >= 100', "color('#05A7DE',0.6)"],
        // ['${z} >= 60', "color('#5A95C1')"],
        // ['${z} >= 15', "color('#5AA0CB')"],
        ['true', "color('#05DEC6',0.2)"]
      ]
    }
  });
  HKBuilding.style = HKTilesetStyle;
}

cesiumMap.switch3dTileShow = function () {
  let viewer = cesiumMap.cesium.viewer;
  // console.log(viewer.scene.primitives)
  if (viewer.scene.primitives.contains(HKBuilding)) {
    viewer.scene.primitives.remove(HKBuilding)
    console.log('remove')
  } else {
    add3dTiles(viewer, 'CesiumLab/building2/tileset.json');
    console.log('add')
  }
}

/* ---------------------------------- 绘制polygon Draw polygon---------------------------------- */
function terminateShape() {
  let viewer = cesiumMap.cesium.viewer;
  activeShapePoints.pop(); //去除最后一个动态点 Remove the last dynamic point
  if (activeShapePoints.length) {
    drawPolygon(activeShapePoints); //绘制最终图 Draw the final picture
  }
  viewer.entities.remove(floatingPoint); //去除动态点图形（当前鼠标点） Remove dynamic dot graphics (current mouse point)
  viewer.entities.remove(activePolygon); //去除动态图形 Remove dynamic graphics
  viewer.entities.remove(activeLine); //去除动态线 Remove dynamic lines
  floatingPoint = undefined;
  activePolygon = undefined;
  activeLine = undefined;
  allPoint = [];
  handler = handler.destroy();//清除绘图的鼠标行为  Clear the mouse behavior of the drawing

  viewer.screenSpaceEventHandler.setInputAction(leftClick, Cesium.ScreenSpaceEventType.LEFT_CLICK);//重新恢复cesium默认的鼠标行为
}
function drawPolygon(positionData) {
  let viewer = cesiumMap.cesium.viewer;
  var shape = viewer.entities.add({
    polygon: {
      hierarchy: positionData,
      material: new Cesium.ColorMaterialProperty(Cesium.Color.BLUE.withAlpha(0.4))
    }
  });
  allDraw.push(shape);
  return shape;
}
function createPoint(worldPosition) {
  let viewer = cesiumMap.cesium.viewer;
  var point = viewer.entities.add({
    position: worldPosition,
    point: {
      color: Cesium.Color.SKYBLUE,
      pixelSize: 5,
      heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
    }
  });
  allDraw.push(point);
  return point;
}
function drawPolyline(worldPosition) {
  let viewer = cesiumMap.cesium.viewer;
  var polyline = viewer.entities.add({
    polyline: {
      positions: worldPosition,
      material: Cesium.Color.BLUE.withAlpha(0.4),
      width: 1,
      clampToGround: true
    }
  });
  allDraw.push(polyline);
  return polyline;
}
//##开始绘制 Start drawing
cesiumMap.draw = function () {
  let viewer = cesiumMap.cesium.viewer;
  leftClick = viewer.screenSpaceEventHandler.getInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
  viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
  viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
  handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas)
  handler.setInputAction(function (event) {
    var earthPosition = viewer.scene.globe.pick(viewer.camera.getPickRay(event.position), viewer.scene);
    if (Cesium.defined(earthPosition)) {
      var cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(viewer.scene.globe.pick(viewer.scene.camera.getPickRay(event.position), viewer.scene));
      var lat = Cesium.Math.toDegrees(cartographic.latitude).toFixed(7);
      var lon = Cesium.Math.toDegrees(cartographic.longitude).toFixed(7);
      allPoint.push({ 'lon': lon, 'lat': lat });
      if (activeShapePoints.length === 0) {
        floatingPoint = createPoint(earthPosition);
        activeShapePoints.push(earthPosition);
        var dynamicPolygonPositions = new Cesium.CallbackProperty(function () {
          return new Cesium.PolygonHierarchy(activeShapePoints);
        }, false);
        var dynamicPolylinePositions = new Cesium.CallbackProperty(function () {
          return activeShapePoints;
        }, false);
        activePolygon = drawPolygon(dynamicPolygonPositions); //绘制动态图
        activeLine = drawPolyline(dynamicPolylinePositions);
      }
      activeShapePoints.push(earthPosition);
      createPoint(earthPosition);
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

  handler.setInputAction(function (event) {
    if (Cesium.defined(floatingPoint)) {
      var newPosition = viewer.scene.globe.pick(viewer.camera.getPickRay(event.endPosition), viewer.scene);
      if (Cesium.defined(newPosition)) {
        floatingPoint.position.setValue(newPosition);
        activeShapePoints.pop();
        activeShapePoints.push(newPosition);
      }
    }
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

  handler.setInputAction(function (event) {
    terminateShape();
    getGeojsonPolygon(activeShapePoints, viewer, geoJsonPolygon)
    if (geoJsonPolygon.features[0] && geoJsonPolygon.features[0].geometry) {
      cesiumMap.intersectDatabase(geoJsonPolygon);
    }
    activeShapePoints = [];
    geoJsonPolygon = {
      "type": "FeatureCollection",
      "features": [
        {
          "type": "Feature",
          "geometry": {
            "type": "Polygon",
            "coordinates": [
              []
            ]
          },
          "properties": {}
        }
      ]
    };
  }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

}
//##获取绘制范围的 geojson  Get the geojson of the drawing range
function getGeojsonPolygon(params, viewer, geoJsonPolygon) {
  var ellipsoid = viewer.scene.globe.ellipsoid;
  params.forEach(element => {
    var cartographic = ellipsoid.cartesianToCartographic(element);
    var lat = Cesium.Math.toDegrees(cartographic.latitude);
    var lng = Cesium.Math.toDegrees(cartographic.longitude);
    geoJsonPolygon.features[0].geometry.coordinates[0].push([lng, lat])
  });
  geoJsonPolygon.features[0].geometry.coordinates[0].push(geoJsonPolygon.features[0].geometry.coordinates[0][0])//将第一个点追加到最后一个点后面，形成一个闭环  Append the first point to the last point to form a closed loop
  console.log(geoJsonPolygon)
  return geoJsonPolygon
}
//## 与数据库求交  Intersecting with the database
cesiumMap.intersectDatabase = function (geojson) {
  let viewer = cesiumMap.cesium.viewer;
  // axios.get('http://10.209.7.3:8414/api/Geo/GetRangeTrainedData', { params: { range: geojson.features[0].geometry } })//注意，get/post 的参数传递格式是不同的  Note that the parameter passing format of get/post is different
  //   .then((res) => {
  //     let resultGeojsonPolygon = {
  //       "type": "FeatureCollection",
  //       "features": []
  //     }
  //     console.log(res.data.length)
  //     res.data.forEach(element => {
  //       // console.log(element)
  //       if (JSON.parse(element.st_asgeojson).geometry.coordinates.length > 0) {
  //         resultGeojsonPolygon.features.push({
  //           "type": "Feature",
  //           "geometry": JSON.parse(element.st_asgeojson).geometry,
  //           "properties": JSON.parse(element.st_asgeojson).properties
  //         })
  //       }
  //     });
  //     cesiumMap.addGeojsonPolygon({ data: resultGeojsonPolygon })
  //     viewer.camera.flyTo({
  //       destination: Cesium.Cartesian3.fromDegrees(resultGeojsonPolygon.features[0].geometry.coordinates[0][0][0], resultGeojsonPolygon.features[0].geometry.coordinates[0][0][1], 3000),
  //     });

  //   })
  //   .catch((error) => { console.error('Drawing error') })

  // axios.post('http://localhost:3001/test', { data: geojson.features[0].geometry })//注意，get/post 的参数传递格式是不同的  Note that the parameter passing format of get/post is different
  //   .then((res) => {
  //     cesiumMap.addGeojsonPolygon({ data: res.data })
  //     console.log(res.data.features.length)
  //     myVue.$emit('postgres');
  //     // viewer.camera.flyTo({
  //     //   destination: Cesium.Cartesian3.fromDegrees(res.data.features[0].geometry.coordinates[0][0][0], res.data.features[0].geometry.coordinates[0][0][1], 3000),
  //     // });

  //   })
  //   .catch((error) => { console.error(error) })
}

//### Zoom to areas
function zoomToPlace(posX, posY, posZ, head, pit, rol)
{
  cesiumMap.cesium.viewer.camera.flyTo({
    destination: new Cesium.Cartesian3(posX, posY, posZ),
    orientation: {
      heading: head,
      //heading: 10,
      pitch: pit,
      roll: rol
    }
  });
}
cesiumMap.zoomSub2Point1 = function () {
  cesiumMap.cesium.viewer.camera.flyTo({
    destination: new Cesium.Cartesian3(-2398418.634065974, 5401571.584679408, 2403544.8487699777),
    orientation: {
      heading: 6.009488505517018,
      //heading: 10,
      pitch: -1.1573147706038305,
      roll: 6.283185265193651
    }
  });
}
cesiumMap.zoomSub2Point2 = function () {
  cesiumMap.cesium.viewer.camera.flyTo({
    destination: new Cesium.Cartesian3(-2399172.1729446803, 5401706.712515698, 2403043.2632679045),
    orientation: {
      heading: 6.208078159923026,
      //heading: 10,
      pitch: -1.0116355591240365,
      roll: 0.0
    }
  });
}
cesiumMap.zoomSub2Point3 = function () {
  cesiumMap.cesium.viewer.camera.flyTo({
    destination: new Cesium.Cartesian3(-2396258.8029616293, 5398828.990808947, 2403738.9794591893),
    orientation: {
      heading: 6.217885149046608,
      //heading: 10,
      pitch: -1.3727687694632174,
      roll: 0.0
    }
  });
}
cesiumMap.zoomSub2Point4 = function () {
  cesiumMap.cesium.viewer.camera.flyTo({
    destination: new Cesium.Cartesian3(-2398670.00861597, 5401452.108035238, 2406087.2092175675),
    orientation: {
      heading: 6.217103687922932,
      //heading: 10,
      pitch: -1.5535343945888518,
      roll: 0.0
    }
  });
}
cesiumMap.zoomSub2Point5 = function () {
  cesiumMap.cesium.viewer.camera.flyTo({
    destination: new Cesium.Cartesian3(-2396388.954028517, 5398499.470024855, 2404418.3921131045),
    orientation: {
      heading: 6.084112519107157,
      //heading: 10,
      pitch: -1.5205587790069544,
      roll: 0.004189896047710917
    }
  });
}
cesiumMap.zoomSub2Point6 = function () {
  cesiumMap.cesium.viewer.camera.flyTo({
    destination: new Cesium.Cartesian3(-2396087.900657328, 5398543.84877118, 2403692.533560578),
    orientation: {
      heading: 6.084110502907739,
      //heading: 10,
      pitch: -1.5205592814889282,
      roll: 0.00419191479403036
    }
  });
}
cesiumMap.zoomSub2Point7 = function () {
  cesiumMap.cesium.viewer.camera.flyTo({
    destination: new Cesium.Cartesian3(-2396433.4344277564, 5398806.868534602, 2404018.1365917195),
    orientation: {
      heading: 6.084112421059642,
      //heading: 10,
      pitch: -1.5205588034428321,
      roll: 0.004189994219066406
    }
  });
}
cesiumMap.zoomSub2Point8 = function () {
  cesiumMap.cesium.viewer.camera.flyTo({
    destination: new Cesium.Cartesian3(-2396091.8718693475, 5398506.78410753, 2403729.099212724),
    orientation: {
      heading: 6.084111388106911,
      //heading: 10,
      pitch: -1.5205590608787758,
      roll: 0.004191028476651759
    }
  });
}
cesiumMap.zoomSub2Point9 = function () {
  cesiumMap.cesium.viewer.camera.flyTo({
    destination: new Cesium.Cartesian3(-2398723.272819218, 5401093.395051598, 2405799.260078885),
    orientation: {
      heading: 6.084113555562824,
      //heading: 10,
      pitch: -1.5205585206950345,
      roll: 0.004188858282733854
    }
  });
}
cesiumMap.zoomSub2Point10 = function () {
  cesiumMap.cesium.viewer.camera.flyTo({
    destination: new Cesium.Cartesian3(-2398723.272819218, 5401093.395051598, 2405799.260078885),
    orientation: {
      heading: 6.084113555562824,
      //heading: 10,
      pitch: -1.5205585206950345,
      roll: 0.004188858282733854
    }
  });
}
cesiumMap.zoomSub2Point11 = function () {
  cesiumMap.cesium.viewer.camera.flyTo({
    destination: new Cesium.Cartesian3(-2398723.272819218, 5401093.395051598, 2405799.260078885),
    orientation: {
      heading: 6.084113555562824,
      //heading: 10,
      pitch: -1.5205585206950345,
      roll: 0.004188858282733854
    }
  });
}
cesiumMap.zoomSub2Point12 = function () {
  cesiumMap.cesium.viewer.camera.flyTo({
    destination: new Cesium.Cartesian3(-2396619.275159117, 5398196.007328054, 2403791.760655366),
    orientation: {
      heading: 6.003517015532613,
      //heading: 10,
      pitch: -1.2299072895250678,
      roll: 0.000037090348429025255
    }
  });
}
cesiumMap.zoomSub3Point1 = function () {
  cesiumMap.cesium.viewer.camera.flyTo({
    destination: new Cesium.Cartesian3(-2398816.1937034936, 5398617.345711123, 2405805.6916256724),
    orientation: {
      heading: 6.084116431093968,
      //heading: 10,
      pitch: -1.5205578040231207,
      roll: 0.004185979119025518
    }
  });
}
cesiumMap.zoomSub3Point2 = function () {
  cesiumMap.cesium.viewer.camera.flyTo({
    destination: new Cesium.Cartesian3(-2396959.7341427337, 5399784.88518767, 2404753.843992178),
    orientation: {
      heading: 6.084113217146547,
      //heading: 10,
      pitch: -1.5205586050375475,
      roll: 0.00418919712650645
    }
  });
}
cesiumMap.zoomPDSub1Point1 = function () {
  cesiumMap.cesium.viewer.camera.flyTo({
    destination: new Cesium.Cartesian3(-2397469.5656106723, 5396020.752779161, 2404614.434964947),
    orientation: {
      heading: 0.5071634097716267,
      //heading: 10,
      pitch: -0.5979077393764864,
      roll: 0.00002085302391208188
    }
  });
}
cesiumMap.zoomPDSub1Point2 = function () {
  cesiumMap.cesium.viewer.camera.flyTo({
    destination: new Cesium.Cartesian3(-2395482.817866405, 5397208.490866036, 2403098.2201409284),
    orientation: {
      heading: 0.5071638431767154,
      pitch: -0.5979088846463192,
      roll: 0.000020083093873246582
    }
  });
}
cesiumMap.zoomPDSub2Point1 = function () {
  cesiumMap.cesium.viewer.camera.flyTo({
    destination: new Cesium.Cartesian3(-2398028.6804409255, 5396502.718107255, 2405083.984392912),
    orientation: {
      heading: 6.19870814624339,
      pitch: -1.3233941967187968,
      roll: 0.00023257340809035298
    }
  });
}
cesiumMap.zoomPDSub2Point1a = function () {
  cesiumMap.cesium.viewer.camera.flyTo({
    destination: new Cesium.Cartesian3(-2398028.6904409254, 5396502.728107254, 2405083.984392912),
    orientation: {
      heading: 6.19870814624339,
      pitch: -1.3233941967187968,
      roll: 0.00023257340809035298
    }
  });
}
cesiumMap.zoomPDSub2Point2 = function () {
  cesiumMap.cesium.viewer.camera.flyTo({
    destination: new Cesium.Cartesian3(-2396643.6714897677, 5398638.891277019, 2404246.070349354),
    orientation: {
      heading: 6.145316692601919,
      pitch: -1.5121511085191197,
      roll: 0.00020128857441559234
    }
  });
}
cesiumMap.zoomPDSub3 = function () {
  var deltaPositionX = -2398398.0362789645 - cesiumMap.cesium.viewer.camera.position.x;
  var deltaPositionY = 5400561.519378464 - cesiumMap.cesium.viewer.camera.position.y;
  var deltaPositionZ = 2405585.3125868286 - cesiumMap.cesium.viewer.camera.position.z;

  if (deltaPositionX >= 0.5 || deltaPositionX <= -0.5 ||deltaPositionY >= 0.5 || deltaPositionY <= -0.5 ||deltaPositionZ >= 0.5 || deltaPositionZ <= -0.5)
  {
    cesiumMap.cesium.viewer.camera.flyTo({
      destination: new Cesium.Cartesian3(-2398398.0362789645, 5400561.519378464, 2405585.3125868286),
      orientation: {
        heading: 5.929741792740519,
        pitch: -1.4888464581415337,
        roll: 0.0010384262169216285
      }
    });
  }
  else
  {
    cesiumMap.moveMap();
  }  
}
cesiumMap.zoomPDSub4 = function () {
  cesiumMap.cesium.viewer.camera.flyTo({
    destination: new Cesium.Cartesian3(-2398046.8800288024, 5396574.387224983, 2405221.3440983235),
    orientation: {
      heading: 5.979109675446049,
      pitch: -1.4035229459620564,
      roll: 0.00023044114405035288
    }
  });
}
cesiumMap.zoomPDSub4Point4 = function () {
  cesiumMap.cesium.viewer.camera.flyTo({
    destination: new Cesium.Cartesian3(-2395564.3657665667, 5397250.820816967, 2403217.882116418),
    orientation: {
      heading: 0.08285130734230783,
      pitch: -1.3687459923372738,
      roll: 0.000019714792263592074
    }
  });
}
cesiumMap.moveMap = function () {
  var currentPosX = cesiumMap.cesium.viewer.camera.position.x;
  var currentPosY = cesiumMap.cesium.viewer.camera.position.y;
  var currentPosZ = cesiumMap.cesium.viewer.camera.position.z;
  var currnetHeading = cesiumMap.cesium.viewer.camera.heading;
  var currentPitch = cesiumMap.cesium.viewer.camera.pitch;
  var currentRoll = cesiumMap.cesium.viewer.camera.roll;
  cesiumMap.cesium.viewer.camera.flyTo({
    destination: new Cesium.Cartesian3(currentPosX, currentPosY + 0.5, currentPosZ),
    orientation: {
      heading: currnetHeading,
      //heading: 10,
      pitch: currentPitch,
      roll: currentRoll
    }
  });
}


export default cesiumMap;