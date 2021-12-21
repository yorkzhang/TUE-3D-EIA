import mapboxgl from "mapbox-gl/dist/mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import landuseColorConfig from "@/config/landuseColor.json"
import myCesium from "@/libs/myCesium.js";
import axios from 'axios';
import drawStyle from '../config/mapBox_draw_style.json'
mapboxgl.accessToken = 'pk.eyJ1IjoibGluc2hpeW91eGlhbmciLCJhIjoiY2sweWxnN2p6MGd1djNncDh0NGJjMXVyMSJ9.oaIz3c43CUJjckoXdc_vfg';
let mapBox = {
  resultGeojsonPolygon: {
    "type": "FeatureCollection",
    "features": []
  },
  speciesGeojson: {
    "type": "FeatureCollection",
    "features": []
  }
}
let map;
var Draw;
var geocoder;
var selectPolygon = 0;
/* ---------------------------------- 地图初始化 --------------------------------- */

mapBox.init = function (params) {
  Draw = new MapboxDraw({
    displayControlsDefault: false,
    controls: {
      polygon: true,
      line_string: true,
      trash: true
    },
    clickBuffer: 5,
    styles: drawStyle
  });

  map = new mapboxgl.Map({
    container: 'mapBoxContainer',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [114.246078, 22.420376],
    zoom: 14
  });

  map.addControl(new mapboxgl.NavigationControl());
  map.addControl(new mapboxgl.ScaleControl(), 'bottom-right');
}
//##重置所有
mapBox.cleanEvent = function () {
  map.off('click', addPolygonSpecies)
  map.off('draw.create', getDrawPolygon);
  map.off('draw.create', measureResult);
  map.off('click', setDraw);
  if (map.hasControl(Draw)) {
    map.removeControl(Draw);
  }
  if (map.hasControl(geocoder)) {
    map.removeControl(geocoder);
  }

}

/* --------------------------------- 地图全局操作 --------------------------------- */
//##切换地图底图
mapBox.switchBasemap = function () {
  var styleJson = map.getStyle();
  if (styleJson.name == "Mapbox Streets") {
    map.setStyle('mapbox://styles/mapbox/satellite-v9')
  } else {
    map.setStyle('mapbox://styles/mapbox/streets-v11')
  }
  //由于mapbox的规则（没有底图的概念），当切换style后，原有的图层就会消失。所以必须要重新添加已有的用户图层，并且在添加的时候还要设置一定的延迟，目前成功了，后续需要思考是否有更好的方案。
  setTimeout(() => {
    console.log(mapBox.resultGeojsonPolygon)
    addPolygons(mapBox.resultGeojsonPolygon, 'intersect')
  }, 500);

}
//##测量
mapBox.measure = function (params) {
  mapBox.cleanEvent()
  myVue.$emit('draw_delete')
  if (!map.hasControl(Draw)) {
    map.addControl(Draw, 'top-right');
    if (Draw.getAll().features.length > 0) {
      Draw.deleteAll()
    }
  }
  map.on('draw.create', measureResult);
}
function measureResult() {
  if (Draw.getAll().features.length > 1) {
    myVue.$Message.warning({
      content: 'Just one region. If want to add a new one, please delete the old one.',
      duration: 5
    });
  } else {
  }

  var geometry = Draw.getAll().features.slice(Draw.getAll().features.slice.length - 2, Draw.getAll().features.slice.length - 1)[0].geometry; //无论Draw 的 feature 有多长，都只取最初的那一个，保持地图上只有一个region
  var measureDraw = {
    type: 'FeatureCollection',
    features: [{
      type: 'Feature',
      properties: {},
      id: 'example-id',
      geometry: geometry
    }]
  };
  console.log('measure result', geometry);
  Draw.set({
    type: 'FeatureCollection',
    features: [{
      type: 'Feature',
      properties: {},
      id: 'example-id',
      geometry: geometry
    }]
  });
  var measureResultInfo;
  if (geometry.type == "Polygon") {
    var measureResult = turf.area(measureDraw);
    console.log('measureResult', measureResult.toFixed(2));
    measureResultInfo = "The polygon's area is: " + measureResult.toFixed(2) + " square meters.";
  } else {
    var measureResult = turf.length(measureDraw);
    measureResultInfo = "The line's length is: " + measureResult.toFixed(2) + " kilometers.";
  }
  myVue.$emit('measure', measureResultInfo);
  map.on('draw.delete', function (params) {
    myVue.$emit('draw_delete');
  });
}
mapBox.switchTransparency = function (params) {
  if (map.getLayer('intersect')) {
    map.setPaintProperty('intersect', 'fill-opacity', params);
  } else {
    console.log('nodd')
  }
}
// 添加地图搜索按钮
mapBox.AddSeartDiv = function () {
  geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl
  });
  document.getElementById('geocoder').appendChild(geocoder.onAdd(map));
  // map.addControl(geocoder);
}
//## 切换路由
mapBox.switchMenue = function (params) {
  console.log(params)
  mapBox.cleanEvent();
  // if (params == 'search') {
  //   geocoder = new MapboxGeocoder({
  //     accessToken: mapboxgl.accessToken,
  //     mapboxgl: mapboxgl
  //   });
  //   map.addControl(geocoder);
  // }
  if (params != "mapping") {

    if (map.hasControl(Draw)) {
      Draw.set({
        type: 'FeatureCollection',
        features: []
      });
      selectPolygon = Draw.getAll();

    }
    if (map.getLayer('intersect')) {
      map.setPaintProperty('intersect', 'fill-opacity', 1);
    }
  }

  if (params == '2DView') {
    // mapBox.init();
    // map.on('click', addPolygonSpecies)
  }
  if (params == '3DView') {
    myVue.$store.commit("updateShowBasemapSwitch", false);
    myCesium.initCesium();

    myVue.$store.commit("updateShowMap", false);

    // myVue.$store.commit("updateSpeciesUnImportantStatus", false);
    // speciesUnImportantMap
    // myVue.$store.commit("updateSpeciesStatus", false);
    // speciesMap
  }
}
/* ---------------------------------- Mapping:文件上传 ---------------------------------- */
mapBox.uploadFile = function (data) {
  if (!map.hasControl(Draw)) {
    map.addControl(Draw, 'top-right');
  }
  console.log(JSON.parse(data), "上传成功");
  Draw.set({
    type: 'FeatureCollection',
    features: [{
      type: 'Feature',
      properties: {},
      id: 'example-id',
      geometry: JSON.parse(data)
    }]
  });
  myVue.$emit('draw_creat')
  map.easeTo({
    center: JSON.parse(data).coordinates[0][0],
    essential: true,
    zoom: 13
  });
  console.log(Draw.getAll())
  //待办，需要将地图视角切换到对应的区域
}

/* ----------------------------------- 缓冲区 ---------------------------------- */
mapBox.bufferAnalysis = function (bufferNumber) {
  /* 
  1.获取projectextent数据表中的结果；
  2.对该结果进行缓冲区分析，前端输入距离参数；
  3.返回结果的缓冲区
     */
  // show page loading
  myVue.$store.commit('updateLoading', true)
  axios.get(APIROUTER.projecttextent.bufferAnalysis, { params: { multiple: parseFloat(bufferNumber) } })
    .then(res => {
      console.log(res, 'bufferAnalysis')
      if (res && res.data && res.data.result && res.data.data && res.data.data[0]) {
        Draw.set({
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            id: 'example-id',
            geometry: JSON.parse(res.data.data[0].st_asgeojson || "")
          }]
        });
      } else {
        myVue.$Message.error({
          content: res.message || 'Buffer creation failed. Please try again later',
          duration: 10,
        })
      }
      myVue.$store.commit('updateLoading', false)
    })
}
/* ---------------------------------- Mapping:绘制求交 ---------------------------------- */

/*
1.获取前端绘制的数据；
2.基于前端获取到的数据拼接请求参数；
3.与后端求交
4.获取求交后的结果并可视化 addPolygons
5.移除绘制的图形
*/
mapBox.addDraw = function () {
  mapBox.cleanEvent()
  if (!map.hasControl(Draw)) {
    map.addControl(Draw, 'top-right');
  }
  map.on('draw.create', getDrawPolygon);
}
mapBox.getHabitatMap = function () {
  var data = Draw.getAll();
  console.log('intersectPolygon', data.features[0].geometry)
  // add page loading
  myVue.$store.commit("updateLoading", true);
  axios({
    method: 'get',
    url: APIURL.Express + '/updateHabitat'
  }).then(res => {
    if (res && res.data) {
      myVue.$store.commit('updateHabitatMapStatus', true)
      mapBox.resultGeojsonPolygon = {
        "type": "FeatureCollection",
        "features": []
      }
      res.data.forEach(element => {
        mapBox.resultGeojsonPolygon.features.push({
          "type": "Feature",
          "geometry": JSON.parse(element.geojson),
          "properties": {
            gid: element.gid,
            gridcode: parseInt(element.gridcode),
            shape_area: element.shape_area,
            shape_leng: element.shape_leng
          }
        })
      });
      addPolygons(mapBox.resultGeojsonPolygon, 'intersect')
      console.log('habitat', mapBox.resultGeojsonPolygon)
      Draw.deleteAll()
      myVue.$emit('compute_complete')
    } else {
      myVue.$Message.error({
        content: res.message || 'Buffer creation failed. Please try again later',
        duration: 10,
      })
    }
    myVue.$store.commit('updateLoading', false)
  }).catch((error) => { console.error(error) })
  //如下是汉勇做的api，只求交，不保存求交后的habitat 结果
  /*  axios.get(APIROUTER.geo.getrangetrainedlist, { params: { range: data.features[0].geometry } })//注意，get/post 的参数传递格式是不同的
     .then((res) => {
       if (res && res.data && res.data.result && res.data.data) {
         console.log(res, 'temp')
         myVue.$store.commit('updateHabitatMapStatus', true)
         mapBox.resultGeojsonPolygon = {
           "type": "FeatureCollection",
           "features": []
         }
         res.data.data.forEach(element => {
           mapBox.resultGeojsonPolygon.features.push({
             "type": "Feature",
             "geometry": JSON.parse(element.st_asgeojson).geometry,
             "properties": JSON.parse(element.st_asgeojson).properties
           })
         });
         addPolygons(mapBox.resultGeojsonPolygon, 'intersect')
         console.log(mapBox.resultGeojsonPolygon)
         Draw.deleteAll()
         myVue.$emit('compute_complete')
       } else {
         myVue.$Message.error({
           content: res.message || 'Buffer creation failed. Please try again later',
           duration: 10,
         })
       }
       myVue.$store.commit('updateLoading', false)
     })
     .catch((error) => { console.error(error) }) */
}


function getDrawPolygon() {
  if (Draw.getAll().features.length > 1) {
    myVue.$Message.warning({
      content: 'Just one region. If want to add a new one, please delete the old one.',
      duration: 5
    });

  }
  var geometry = Draw.getAll().features.slice(Draw.getAll().features.slice.length - 2, Draw.getAll().features.slice.length - 1)[0].geometry; //无论Draw 的 feature 有多长，都只取最初的那一个，保持地图上只有一个region
  if (geometry.type == "Polygon") {
    Draw.set({
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        properties: {},
        id: 'example-id',
        geometry: geometry
      }]
    });
    uploadDrawPolygon(geometry);
    myVue.$emit('draw_creat');
  } else {
    myVue.$Message.warning({
      content: 'Please choose the polygon tool to draw',
      duration: 5
    });
  }

}

/* 
1,当地图中没有该图层的话，直接添加Source与layer，否则修改source 为新的data
*/
//## 增加 geojson polygon
function addPolygons(geojson, layerNameID) {
  if (map.getLayer(layerNameID)) {
    map.getSource(layerNameID).setData(geojson);
  } else {
    map.addSource(layerNameID, {
      'type': 'geojson',
      'data': geojson
    });
    map.addLayer({
      'id': layerNameID,
      'type': 'fill',
      'source': layerNameID,
      'layout': {},
      'paint': {
        'fill-color': setLandUseColor(),
        // 'fill-outline-color': '#272822'
      }
    });
  }
}
//## 更新 geojson 对象到 projectextent 数据表
function uploadDrawPolygon(coordinates) {
  axios({
    method: 'post',
    url: APIROUTER.projecttextent.getprojectextentbyjsonobject,
    data: {
      coordinatesJson: JSON.stringify(coordinates)
    }
  }).then(a => {
    console.log('projectextent 存储成功')
  })

}
/* --------------------------- Mapping:编辑polygon -------------------------- */
mapBox.editPolygon = function (params) {
  //恢复 intersect 原先的状态
  map.setPaintProperty('intersect', 'fill-opacity', 1);
  if (!map.hasControl(Draw)) {
    map.addControl(Draw, 'top-right');
  }
  //每次只能够选中一个polygon，进行编辑，每次点击该菜单后都清空之前的polyogn
  Draw.set({
    type: 'FeatureCollection',
    features: []
  });
  selectPolygon = Draw.getAll();
  map.on('click', setDraw);

}



function setDraw(e) {

  let queryFeatures = map.queryRenderedFeatures(e.point, { layers: ['intersect'] });//待办，这里需要替换成rest api，需要获取点击的polygon在数据库中的边界
  console.log(queryFeatures)

  if (queryFeatures.length > 0) {
    if (selectPolygon.features.length == 0) {
      //点击获取对应polygon A 的id以及对应的geojson数据
      axios.get(APIROUTER.geo.getgeotrainedjsonbyid, { params: { id: queryFeatures[0].properties.gid } })
        .then(result => {
          //基于获取到的geojson新增带编辑节点的polygon B
          map.setPaintProperty('intersect', 'fill-opacity', 0.2);
          Draw.set({
            type: 'FeatureCollection',
            features: [{
              type: 'Feature',
              properties: result.data.data,
              id: 'example-id',
              geometry: JSON.parse(result.data.data.st_asgeojson)
            }]
          });

          selectPolygon = Draw.getAll();
          myVue.$emit('select_intersect_polygon', result.data.data)
        })

    } else {
      //已经有一个 selectPolygon
      console.log('已经有一个 selectPolygon')
      myVue.$Message.success({
        content: 'Just one selected Polygon',
        duration: 2,
      });
    }
  } else {
    //恢复 intersect 原先的状态
    console.log('未点击要素')
    map.setPaintProperty('intersect', 'fill-opacity', 1);
    Draw.set({
      type: 'FeatureCollection',
      features: []
    });
    selectPolygon = Draw.getAll();
  }


}
//## update Polygon
mapBox.updatePolygon = function (habitantAttrObj) {
  let editPolygon = Draw.getAll();
  map.setPaintProperty('intersect', 'fill-opacity', 1);
  /*
  .属性数值habitantAttrObj的修改需要涉及到api的修改，后面再说。https://workflowy.com/#/3d9ea1ad48c9
  */
  // add page loading
  myVue.$store.commit("updateLoading", true);
  console.log(habitantAttrObj, 'habitantAttrobj')
  console.log(editPolygon, 'editpolygon')
  let gid = 782//基于 sr_trained_4326_old 数据进行测试
  let rightGid = editPolygon.features[0].properties.gid
  doSql(rightGid, editPolygon.features[0].geometry).then(res => {
    if (res && res.data) {
      // @@a do something
      axios({
        method: 'get',
        url: APIURL.Express + '/getHabitat',
      }).then(res => {
        if (res && res.data) {
          mapBox.resultGeojsonPolygon = {
            "type": "FeatureCollection",
            "features": []
          }
          res.data.forEach(element => {
            mapBox.resultGeojsonPolygon.features.push({
              "type": "Feature",
              "geometry": JSON.parse(element.geojson),
              "properties": {
                gid: element.gid,
                gridcode: parseInt(element.gridcode)
              }
            })
          });
          addPolygons(mapBox.resultGeojsonPolygon, 'intersect')
          console.log(res, 'update habitatmap')
          myVue.$Message.success({
            content: 'Polygon update successfully',
            duration: 10,
          });
          myVue.$store.commit('updateLoading', false)
          map.setPaintProperty('intersect', 'fill-opacity', 1);
          //每次只能够选中一个polygon，进行编辑，每次点击该菜单后都清空之前的polyogn
          Draw.set({
            type: 'FeatureCollection',
            features: []
          });
          selectPolygon = Draw.getAll();
        }
      })
    } else {
      myVue.$Message.error({
        content: res.message || 'Polygon update failed. Please try again later',
        duration: 10,
      })
    }

    console.log(res, 'updataPolygon')
  });
  /* 待办：
  1,当前的api只是修改了 geog 字段，其他属性字段的修改待数据结构明确后再完善api； */
}


/* --------------------------- landuse layer color -------------------------- */
function setLandUseColor() {
  let landuseColor = ['match', ['get', 'gridcode']]
  for (const key in landuseColorConfig) {
    if (landuseColorConfig.hasOwnProperty.call(landuseColorConfig, key)) {
      landuseColor.push(parseInt(key), landuseColorConfig[key])
    }
  }
  landuseColor.push('#272822')//其他没有匹配值的polygon的颜色为黑色
  return landuseColor;
}

/* --------------------------------- view 部分 -------------------------------- */
//## 初始化的时候直接加载重要的 species
mapBox.addImportantSpecies = function () {
  mapBox.speciesGeojson = {
    "type": "FeatureCollection",
    "features": []
  }
  map.on('click', addPolygonSpecies)
  axios({
    method: 'get',
    url: APIROUTER.view.getimportspecies,
    params: {//post 此处用 data，get 此处用 params，要注意。
      important: '1'
    }
  }).then(a => {
    // 此处获取的即为 important species
    myVue.$emit('species-data', a.data.data)
    a.data.data.forEach(element => {
      mapBox.speciesGeojson.features.push({
        "type": "Feature",
        "geometry": JSON.parse(element.geojson),
        "properties": {
          color: '#' + element.color,
          category: element.category,
          species: element.species,
          speciesid: element.speciesid,
          abbreviation: element.abbreviati
        }
      })
      //##批量添加 icon，必须保证 icon 的名称与 category 的名称一一对应。
      // map.loadImage('img/category/' + element.category + '.png', function (error, image) {
      //   if (error) throw error;
      //   map.addImage(element.category, image, { 'sdf': true });
      // })
    });
    map.easeTo({
      center: JSON.parse(a.data.data[0].geojson).coordinates,
      essential: true,
      zoom: 16
    });
    addColorIcon({
      sourceName: 'importantSpecies',
      geojsonData: mapBox.speciesGeojson
    })
  })
}
// ## 选中某一个polygon时，加载该polygon下对应的 所有 species
function addPolygonSpecies(e) {
  mapBox.speciesGeojson = {
    "type": "FeatureCollection",
    "features": []
  }
  let queryFeatures = map.queryRenderedFeatures(e.point, { layers: ['intersect'] })
  console.log('click polygon', queryFeatures)
  if (queryFeatures.length > 0) {

    /* ----------------------------------- 待办 ----------------------------------- */
    //##如下是han yong 的api，是通过 gid 关联的方式获取 polygon 对应的 species
    /* axios({
      method: 'get',
      url: APIROUTER.view.getallspecies,
      params: {//post 此处用 data，get 此处用 params，要注意。
        // trainedgid: queryFeatures[0].properties.gid

        trainedgid: 316146
      }
    }).then(a => { */

    axios({
      method: 'post',
      url: APIURL.Express + '/getImportantSpecies',
      data: {//post 此处用 data，get 此处用 params，要注意。
        // trainedgid: queryFeatures[0].properties.gid

        gid: queryFeatures[0].properties.gid
      }
    }).then(a => {

      // 获取该polygon下的 important species
      if (a.data.length > 0) {

        //前端配置legend
        myVue.$emit('species-data', a.data)
        a.data.forEach(element => {
          mapBox.speciesGeojson.features.push({
            "type": "Feature",
            "geometry": JSON.parse(element.geojson),
            "properties": {
              color: '#' + element.color,
              category: element.category,
              species: element.species,
              speciesid: element.speciesid,
              abbreviation: element.abbreviati
            }
          })
        });
        map.easeTo({
          center: JSON.parse(a.data[0].geojson).coordinates,
          essential: true,
          zoom: 16
        });
      } else {
        myVue.$emit('click-map-species', [])
        myVue.$emit('species-data', [])
      }
      //获取 unimportant species
      var sql = 'select * from "unimportantSpecies_habitat" where gridcode=' + queryFeatures[0].properties.gridcode;
      expressPost(sql).then(a => {
        if (a.data) {
          myVue.$emit('click-map-species', a.data.rows || [])
        }
      })
      addColorIcon({
        sourceName: 'importantSpecies',
        geojsonData: mapBox.speciesGeojson
      })
    })
  } else {
    myVue.$emit('click-map-species', [])
    myVue.$emit('species-data', [])
  }

}
//##增加不同颜色的 icon
function addColorIcon({
  sourceName: sourceName,//source/layer/img等的name，对应 category ，同时对应 img 文件名称
  geojsonData: geojsonData
}) {
  if (map.getLayer(sourceName + 1)) {
    map.getSource(sourceName).setData(geojsonData);
  } else {
    map.addSource(sourceName, {
      'type': 'geojson',
      'data': geojsonData
    });
    //下面两个图层的顺序要按照这样的方式来，否则 symbol 会被遮挡
    map.addLayer({
      'id': sourceName + 2,
      'source': sourceName,
      'type': 'circle',
      'paint': {
        'circle-color': ['get', 'color'],
        'circle-stroke-width': 3,
        'circle-radius': 14,
      }
    });
    map.addLayer({
      'id': sourceName + 1,
      'source': sourceName,
      'type': 'symbol',
      'layout': {
        'text-field': ["concat", ['get', 'abbreviation'], ['get', 'speciesid']],
        'text-size': 14,
      },
    });

  }


}
//## categorys 筛选
mapBox.categorysFilte = function (params) {
  var updateSpeciesGeojson = {
    "type": "FeatureCollection",
    "features": []
  }
  // 基于 paramsElement[0].category 的属性控制图层中元素的显示情况
  params.forEach(paramsElement => {
    mapBox.speciesGeojson.features.forEach(element => {
      if (element.properties.category == paramsElement.category) {
        updateSpeciesGeojson.features.push(element)
      }
    });
  });
  addColorIcon({
    sourceName: 'importantSpecies',
    geojsonData: updateSpeciesGeojson
  })
  mapBox.speciesGeojson = updateSpeciesGeojson

}

/* -------------------------------- export 部分 ------------------------------- */
//## extract habita map
mapBox.extractHabitatMap = function () {
  axios({
    method: 'get',
    url: APIURL.Express + '/exportResult'
    // url: 'http://localhost:1111' + '/exportResult'
  }).then(res => {
    if (res && res.status == 200) {
      myVue.$emit('get-shapefile-generation-status', true);
    } else {
      myVue.$emit('get-shapefile-generation-status', false);
    }
  }).catch(err => {
    myVue.$emit('get-shapefile-generation-status', false);
  })
}

/* ------------------------------- express 对接 ------------------------------- */
async function expressPost(sql) {
  var result = await axios({
    method: 'post',
    url: APIURL.Express,
    data: {
      sql: sql
    }
  })
  return result
}
async function doSql(gid, geojson) {

  var result = await axios({
    method: "post",
    url: APIURL.Express + '/updatepolygon',
    data: { gid: gid, geojson: geojson }
  })
  return result

}
export default mapBox