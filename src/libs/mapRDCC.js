import URL from "../config/api";
import mapboxgl from 'mapbox-gl/dist/mapbox-gl'
import axios from "axios";
// import store from '../store/index';
let mapboxKey = "pk.eyJ1IjoiaGthZ2xqcSIsImEiOiJjazd6dDl4OWIwOWVsM21td3hqb3Q5aGxtIn0.IWC0fVRghs_jT5YAA_tKkw";
let gpsDev = URL.kenAPI + 'Gateway/GPS/DEV';
let gpsCar = URL.kenAPI + 'Gateway/GPS/CAR';
let mapBox = {}
let map;
let allIotData = [];
/* ---------------------------------- 全局函数 ---------------------------------- */
//##增加点
function addPointLayer({
  sourceName: sourceName,
  data: data,
  image: image,
  imageRatio: imageRatio,
  cluster: cluster,
  overlap: overlap,
  clusterColor: clusterColor
}) {
  if (map.getLayer(sourceName)) {
    map.getSource(sourceName).setData(data);
    if (map.getLayer(sourceName)) {
      map.setLayoutProperty(sourceName, 'visibility', 'visible');
    }
    if (map.getLayer(sourceName + '_clusters')) {
      map.setLayoutProperty(sourceName + '_clusters', 'visibility', 'visible');
    }
    if (map.getLayer(sourceName + '_cluster-count')) {
      map.setLayoutProperty(sourceName + '_cluster-count', 'visibility', 'visible');
    }
  } else {
    if (cluster) {
      map.addSource(sourceName, {
        'type': 'geojson',
        'data': data,
        'cluster': true,
        'clusterRadius': 25,
        'maxzoom': 24,
        'clusterProperties': {
          'attribute': ['+', 1],
        }
      });
      if (imageRatio) {
        map.addImage(sourceName + '_Image', image, { pixelRatio: imageRatio });
      } else {
        map.addImage(sourceName + '_Image', image, { pixelRatio: 2 });
      }
      map.addLayer({
        id: sourceName + '_clusters',
        type: 'circle',
        source: sourceName,
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': '#FFF',
          'circle-radius': [
            'step',
            ['get', 'point_count'],
            10,
            10,
            20,
            50,
            30
          ],
          'circle-stroke-width': 8,
          'circle-stroke-color': clusterColor,
        }
      });
      map.addLayer({
        id: sourceName + '_cluster-count',
        type: 'symbol',
        source: sourceName,
        filter: ['has', 'point_count'],
        layout: {
          'text-field': '{attribute}',
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
          'text-size': 18
        }
      });
      map.addLayer({
        'id': sourceName,
        'type': 'symbol',
        'source': sourceName,
        'filter': ['!', ['has', 'point_count']],
        'layout': {
          'visibility': 'visible',
          'icon-image': sourceName + '_Image',
        },
      });
      myLayers.push(sourceName + '_clusters');
      queryLayers.push(sourceName + '_clusters');
    } else {
      map.addSource(sourceName, {
        'type': 'geojson',
        'data': data,
      });
      if (imageRatio) {
        map.addImage(sourceName + '_Image', image, { pixelRatio: imageRatio });
      } else {
        map.addImage(sourceName + '_Image', image, { pixelRatio: 2 });
      }
      if (overlap) {
        map.addLayer({
          'id': sourceName,
          'type': 'symbol',
          'source': sourceName,
          'layout': {
            'visibility': 'visible',
            'icon-image': sourceName + '_Image',
            'icon-allow-overlap': ["step", ["zoom"], false, 10, true, 24, true],
            'text-allow-overlap': ["step", ["zoom"], false, 10, true, 24, true],
          }
        });
      } else {
        map.addLayer({
          'id': sourceName,
          'type': 'symbol',
          'source': sourceName,
          'layout': {
            'visibility': 'visible',
            'icon-image': sourceName + '_Image',
          }
        });
      }

    }
    myLayers.push(sourceName);
    queryLayers.push(sourceName);
  }
}

//##生成 cluster 的 popup
function clusterPopup(DataSource, clusterId, description, coordinate, queryFeatures) {
  let idArr = [];
  map.getSource(DataSource).getClusterLeaves(clusterId, 2000, 0, function (error, features) {
    if (features.length > 0) {
      // 基于 geocoding 获取 iot 所在的位置
      // let coordinateGeocoding = features[0].geometry.coordinates;
      // let reverseGeocodingUrl = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + coordinateGeocoding[0] + ',' + coordinateGeocoding[1] + '.json?access_token=' + mapboxKey + '&language=en';
      // let buildingName;
      // axios.get(reverseGeocodingUrl).then(res => {
      //   if (res.status === 200 && res.data) {
      //     buildingName = res.data.features[0].place_name.split(",")[0]; 
      //     // console.log(buildingName);
      //     // 循环获取列表
      //     for (let i = 0; i < features.length; i++) {
      //       idArr.push(features[i].properties.id || features[i].properties.deviceId);
      //       description = (description || '') + `<div class="iot_list_name" id='${features[i].properties.id}'>
      //                       <label>${i + 1}. <i class="ivu-icon ivu-icon-md-ionic"></i></label>
      //                       <span>${features[i].properties.deviceName}</span>
      //                   </div>`;
      //       // 2020-10-13-iot弹框列表点击事件
      //       setTimeout(() => {
      //         let bObj = document.getElementById(features[i].properties.id);
      //         bObj.addEventListener("click", function () {
      //           WCVue.$emit('city_iot_device_group_id');
      //         }, false);
      //       }, 300);
      //     }

      //     let len = features.length;
      //     // 外层加入一层放标题和设置滚动条
      //     description = `<div class='city_list_detail_title'>${buildingName} ${len > 8 ? '(' + len + ')' : ''}</div>
      //                               <div class="city_list_detail_box">${description}</div>`;
      //     // 抛出所有iot的id
      //     WCVue.$emit('city_iot_device_group_id', idArr);
      //     setTimeout(() => {
      //       WCVue.$emit('city_iot_device_group_id', idArr);
      //     }, 300);
      //     coordinate = queryFeatures[0].geometry.coordinates;
      //     Popup = new mapboxgl.Popup()
      //       .setLngLat(coordinate)
      //       .setHTML(description)
      //       .addTo(map);
      //   }
      // });
      //直接指定 iot 所在的位置名称
      let buildingName = features[1].properties.title
      // 循环获取列表
      for (let i = 0; i < features.length; i++) {
        idArr.push(features[i].properties.id || features[i].properties.deviceId);
        description = (description || '') + `<div class="iot_list_name" id='${features[i].properties.id}'>
                            <label>${i + 1}. <i class="ivu-icon ivu-icon-md-ionic"></i></label>
                            <span>${features[i].properties.deviceName}</span>
                        </div>`;
        // 2020-10-13-iot弹框列表点击事件
        (function (i) {
          // 2020-10-22-闭包问题，改成分别执行
          setTimeout(() => {
            let bObj = document.getElementById(features[i].properties.id);
            bObj.addEventListener("click", function () {
              WCVue.$emit('city_iot_device_group_id_one', features[i].properties.id);
            }, false);
          }, 300);
        }(i));
      }

      let len = features.length;
      // 外层加入一层放标题和设置滚动条
      description = `<div class='city_list_detail_title'>${buildingName} ${len > 8 ? '(' + len + ')' : ''}</div>
                                    <div class="city_list_detail_box">${description}</div>`;
      // 抛出所有iot的id
      WCVue.$emit('city_iot_device_group_id', idArr);
      coordinate = queryFeatures[0].geometry.coordinates;
      Popup = new mapboxgl.Popup()
        .setLngLat(coordinate)
        .setHTML(description)
        .addTo(map);
    }
  });
  return { description, coordinate };
}

/* --------------------------- 全局变量 -------------------------- */

let assetsList = [];
let vehiclesList = [];
let myLayers = [];
let queryLayers = [];

/* -------------------------------当前 icon/Popup ------------------------------- */

let currentMarkers = [];
let Popup = new mapboxgl.Popup();
/* ---------------------------------- 初始化地图 --------------------------------- */
mapBox.init = function (v) {
  myLayers = [];
  queryLayers = ['buildings_gov', 'buildings_others'];
  mapboxgl.accessToken = mapboxKey;
  map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v9',
    center: [114.20353, 22.32588],
    zoom: 15,
    rotation: 300,
    pitch: 60,
    maxZoom: 20,
    "light": {  //##待办，好像不起作用
      "anchor": "viewport",
      "color": "white",
      "intensity": 10.4
    }
  });
  map.getCanvas().style.cursor = "default";
  map.resize();
  map.on('load', function () {
    map.addSource('buildings', {
      'type': 'vector',
      'scheme': 'tms',
      'tiles': [URL.mapBox + 'geoserver/gwc/service/tms/1.0.0/HKshp%3Apublic@EPSG%3A900913@pbf/{z}/{x}/{y}.pbf'
      ]
    });
    map.addLayer({
      'id': 'buildings_gov',
      'source': 'buildings',
      'layout': { 'visibility': 'visible' },
      'source-layer': 'public',
      'type': 'fill-extrusion',
      'paint': {
        'fill-extrusion-color': [
          'interpolate',
          ['linear'],
          ['get', 'height'],
          0, 'rgb(253,174,97)',
          75, "rgb(215,25,28)",
          150, 'rgb(255,228,196)',
        ],
        'fill-extrusion-height': ['get', 'height'],
        'fill-extrusion-opacity': 0.2,
        'fill-extrusion-base': [
          'interpolate',
          ['linear'],
          ['zoom'],
          15,
          0,
          15.05,
          ['get', 'min_height']]
        // 'fill-extrusion-pattern':'catcat'
      }

    });
    myLayers.push('buildings_gov');
    map.addSource('buildings_others', {
      'type': 'vector',
      'scheme': 'tms',
      'tiles': [URL.mapBox + 'geoserver/gwc/service/tms/1.0.0/HKshp%3Apublic_other@EPSG%3A900913@pbf/{z}/{x}/{y}.pbf '
      ]
    });
    map.addLayer({
      'id': 'buildings_others',
      'source': 'buildings_others',
      'layout': { 'visibility': 'visible' },
      'source-layer': 'public_other',
      'type': 'fill-extrusion',
      'paint': {

        'fill-extrusion-color': 'white',
        'fill-extrusion-height': ['get', 'height'],
        'fill-extrusion-opacity': 0.2,
        'fill-extrusion-base': [
          'interpolate',
          ['linear'],
          ['zoom'],
          15,
          0,
          15.05,
          ['get', 'min_height']]

      }

    });
    myLayers.push('buildings_others');
    if (v) {
      map.on('click', function (e) {
        if (currentMarkers !== null) {
          currentMarkers.forEach(element => {
            element.remove();
          });
          currentMarkers = []
        }
        //##鼠标单击，获取坐标
        WCVue.$emit('cur-gps-map', [e.lngLat.lng, e.lngLat.lat]);
        var marker = new mapboxgl.Marker({
          color: '#FE014A'
        })
          .setLngLat([e.lngLat.lng, e.lngLat.lat])
          .addTo(map);
        currentMarkers.push(marker);
      })
    } else {
      mapBox.mapClick();
    }
    map.on('contextmenu', function (e) {
      WCVue.$emit('map-contextmenu', e.lngLat);
    });
    map.on('zszFun', function (e) {
      console.log(e);
    });
  });
}


/* ---------------------------------- 鼠标点击 ---------------------------------- */
//##鼠标点击方法
mapBox.mapClick = function (point, layers) {
  if (Popup) {
    Popup.remove();
  }
  if (point) {
    map.jumpTo({
      center: point,
      bearing: 0,
      zoom: 18,
      pitch: 0
    });
    //注意使用 map.project 的时候如果要与缩放动画 map.easeTo 结合使用的话，map.project 要放在一个延迟 setTimeout 执行,或者将 map.easeTo 直接替换为 map.jumpTo 即可
    setTimeout(() => {
      let pointScreen = map.project(point);
      console.log(pointScreen)
      //##寻找建筑周围的iot
      let bbox = [
        [pointScreen.x - 100, pointScreen.y - 100],
        [pointScreen.x + 100, pointScreen.y + 100]
      ];
      let queryFeatures = map.queryRenderedFeatures(bbox, { layers: layers });
      let description, coordinate;
      if (queryFeatures.length > 0) {
        var layerID = queryFeatures[0].layer.id;
        let data = queryFeatures[0].properties;
        let Measure = data.listSensorMeasure;
        let listSensorMeasure = Measure ? JSON.parse(Measure) : [];
        listSensorMeasure = listSensorMeasure.filter((val, index) => {
          let k = val.measureKey.toLowerCase();
          if (index > 3 || k.includes('type') || k === 'version' || k === 'occupancy') {
            return;
          }
          return val;
        });
        let list = '';
        if (listSensorMeasure.length > 0) {
          for (let i = 0; i < listSensorMeasure.length; i++) {
            list += `<div class="card_li ${listSensorMeasure[i].measureStatus === 2 ? 'red' : ''}">
                <div class="tit oneEllipsis" title='${listSensorMeasure[i].measureKey}'>${listSensorMeasure[i].measureKey}</div>
                <div class="val oneEllipsis" title='${listSensorMeasure[i].measureValue}'>${listSensorMeasure[i].measureValue}</div>
              </div>`;
          }
        }
        // 2020-09-01 所有都显示faultNo，如果没有再显示id
        let showNo = queryFeatures[0].properties.faultNo || queryFeatures[0].properties.equipment;
        // end

        //##不同的图层弹出框内容配置
        switch (layerID) {
          case 'buildings_gov':
            description = `<div class="city_iot_default_img">${queryFeatures[0].properties.name}<img src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRNGNffUMMUL8dXB7BbkqIjCOZGUew-D_J8norCKqaQ1dqc9dcU&usqp=CAU" alt="Italian Trulli" width="100%" height="100%"></div>`;
            break;
          case 'buildings_others':
            description = `<div class="city_iot_default_img">${queryFeatures[0].properties.name}<img src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRNGNffUMMUL8dXB7BbkqIjCOZGUew-D_J8norCKqaQ1dqc9dcU&usqp=CAU" alt="Italian Trulli" width="100%" height="100%"></div>`;
            break;
          case 'car':
            description = `<div class="city_iot_default_img">${queryFeatures[0].properties.title}<img src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRNGNffUMMUL8dXB7BbkqIjCOZGUew-D_J8norCKqaQ1dqc9dcU&usqp=CAU" alt="Italian Trulli" width="100%" height="100%"></div>`;
            break;
          case 'Traffic CCTV':
            var imageSrc = queryFeatures[0].properties.url;
            description = `<div class="city_iot_default_img">${queryFeatures[0].properties.description}<img src='${imageSrc}' width="100%" height="100%"></div>`;
            break;
          case 'Traffic-Light':

            description = '<strong>' + 'LOCATION: ' + queryFeatures[0].properties.title + '</br>' + 'Time: ' + queryFeatures[0].properties.time + '</br>' + '</strong>';
            break;
          case 'RMU':
            description = `<div class='mapBox_box_detail'>
              <p><label>ID: </label><span>${queryFeatures[0].properties.rmuId}</span></p>
              <p><label>Event: </label><span>${queryFeatures[0].properties.event}</span></p>
              <p><label>Location: </label><span>${queryFeatures[0].properties.location}</span></p>
            </div>`
            break
          case 'RMUWarn':
            description = `<div class='mapBox_box_detail'>
              <p><label>ID: </label><span>${queryFeatures[0].properties.rmuId}</span></p>
              <p><label>Event: </label><span>${queryFeatures[0].properties.event}</span></p>
              <p><label>Location: </label><span>${queryFeatures[0].properties.location}</span></p>
            </div>`
            break
          case 'IoT':
            console.log('iot')
            let id = queryFeatures[0].properties.deviceId;
            WCVue.$emit('city_iot_device_id', id);
            description = `<div class="city_list_box">
                <div class="iot_name">
                  <label><i class="ivu-icon ivu-icon-md-ionic"></i></label>
                  <span>${queryFeatures[0].properties.deviceName}</span>
                </div>
                <div class="city_iot_card">
                  ${list}
                </div>
                <div class="iot_ul">
                  <div class="iot_li">
                    <label>Region </label>
                    <span>${queryFeatures[0].properties.regionName}</span>
                  </div>
                  <div class="iot_li">
                    <label>SBU </label>
                    <span>${queryFeatures[0].properties.sbuOthersName}</span>
                  </div>
                </div>
              </div>`;
            break;
          case 'FSDIoT':
            console.log('FSDIoT')
            // console.error(queryFeatures[0].properties)
            if (queryFeatures[0].properties.id) {
              WCVue.$emit('city_iot_device_id', queryFeatures[0].properties.id);
              description = `<div class="city_list_box">
                  <div class="iot_name">
                    <label><i class="ivu-icon ivu-icon-md-ionic"></i></label>
                    <span>${queryFeatures[0].properties.title}</span>
                  </div>
                  </div>`;
              {/* <div class="city_iot_card">
                    <div class="card_li">
                      <div class="tit oneEllipsis">Signal</div>
                      <div class="val oneEllipsis">${queryFeatures[0].properties.signal || ''} dBm</div>
                    </div>
                    <div class="card_li">
                      <div class="tit oneEllipsis">Battery</div>
                      <div class="val oneEllipsis">${queryFeatures[0].properties.battery || ''} V</div>
                    </div>
                    <div class="card_li">
                      <div class="tit oneEllipsis">Humidity</div>
                      <div class="val oneEllipsis">${queryFeatures[0].properties.humidity || ''} %</div>
                    </div>
                    <div class="card_li">
                      <div class="tit oneEllipsis">Temperature</div>
                      <div class="val oneEllipsis">${queryFeatures[0].properties.temperature || ''} °C</div>
                    </div>
                  </div>
                  <div class="iot_ul">
                    <div class="iot_li">
                      <label>Region </label>
                      <span>${queryFeatures[0].properties.regionName == undefined ? '' : queryFeatures[0].properties.regionName}</span>
                    </div>
                    <div class="iot_li">
                      <label>SBU </label>
                      <span>${queryFeatures[0].properties.sbuOthersName == undefined ? '' : queryFeatures[0].properties.sbuOthersName}</span>
                    </div>
                  </div> */}
            }
            break;
          case 'DSDIoT':
            console.log('DSDIoT')
            // console.error(queryFeatures[0].properties)
            if (queryFeatures[0].properties.id) {
              // debugger
              WCVue.$emit('city_iot_device_id', queryFeatures[0].properties.id);
              description = `<div class="city_list_box">
                  <div class="iot_name">
                    <label><i class="ivu-icon ivu-icon-md-ionic"></i></label>
                    <span>${queryFeatures[0].properties.title}</span>
                  </div>
                  </div>`;
              {/* <div class="city_iot_card">
                    <div class="card_li">
                      <div class="tit oneEllipsis">Signal</div>
                      <div class="val oneEllipsis">${queryFeatures[0].properties.signal || ''} dBm</div>
                    </div>
                    <div class="card_li">
                      <div class="tit oneEllipsis">Battery</div>
                      <div class="val oneEllipsis">${queryFeatures[0].properties.battery || ''} V</div>
                    </div>
                    <div class="card_li">
                      <div class="tit oneEllipsis">Humidity</div>
                      <div class="val oneEllipsis">${queryFeatures[0].properties.humidity || ''} %</div>
                    </div>
                    <div class="card_li">
                      <div class="tit oneEllipsis">Temperature</div>
                      <div class="val oneEllipsis">${queryFeatures[0].properties.temperature || ''} °C</div>
                    </div>
                  </div>
                  <div class="iot_ul">
                    <div class="iot_li">
                      <label>Region </label>
                      <span>${queryFeatures[0].properties.regionName == undefined ? '' : queryFeatures[0].properties.regionName}</span>
                    </div>
                    <div class="iot_li">
                      <label>SBU </label>
                      <span>${queryFeatures[0].properties.sbuOthersName == undefined ? '' : queryFeatures[0].properties.sbuOthersName}</span>
                    </div>
                  </div> */}
            }
            break;
          case 'IoT_clusters':
            console.log('iot_clusters')
            var clusterId = data.cluster_id;
            map.getSource('IoT').getClusterExpansionZoom(
              clusterId,
              function (err, zoom) {
                if (zoom > 20) {
                  ({ description, coordinate } = clusterPopup('IoT', clusterId, description, coordinate, queryFeatures));
                }
                if (err) return;
                map.easeTo({
                  center: queryFeatures[0].geometry.coordinates,
                  zoom: zoom
                });
              }
            );
            return
          case 'FSDIoT_clusters':
            var clusterId = data.cluster_id;
            map.getSource('FSDIoT').getClusterExpansionZoom(
              clusterId,
              function (err, zoom) {
                if (zoom > 20) {
                  ({ description, coordinate } = clusterPopup('FSDIoT', clusterId, description, coordinate, queryFeatures));
                }
                if (err) return;
                map.easeTo({
                  center: queryFeatures[0].geometry.coordinates,
                  zoom: zoom
                });
              }
            );
            return
            break;
          case 'DSDIoT_clusters':
            var clusterId = data.cluster_id;
            map.getSource('DSDIoT').getClusterExpansionZoom(
              clusterId,
              function (err, zoom) {
                if (zoom > 20) {
                  ({ description, coordinate } = clusterPopup('DSDIoT', clusterId, description, coordinate, queryFeatures));
                }
                if (err) return;
                map.easeTo({
                  center: queryFeatures[0].geometry.coordinates,
                  zoom: zoom
                });
              }
            );
            return
            break;
          case 'Lift':
            console.log('Lift')
            // console.error(queryFeatures[0].properties)
            if (queryFeatures[0].properties.id) {
              // @ZSZ 左侧
              WCVue.$emit('city_lift_device_id', queryFeatures[0].properties.id);
              description = `<div class="city_list_box">
                  <div class="iot_name">
                    <label><i class="ivu-icon ivu-icon-md-ionic"></i></label>
                    <span>${queryFeatures[0].properties.title}</span>
                  </div>
                  </div>`;
            }
            break;
          case 'Lift_clusters':
            console.log('Lift_clusters')
            var clusterId = data.cluster_id;
            map.getSource('Lift').getClusterExpansionZoom(
              clusterId,
              function (err, zoom) {
                if (zoom > 20) {
                  ({ description, coordinate } = clusterPopup('Lift', clusterId, description, coordinate, queryFeatures));
                }
                if (err) return;
                map.easeTo({
                  center: queryFeatures[0].geometry.coordinates,
                  zoom: zoom
                });
              }
            );
            return
          case 'alarms-ccep':
            if (queryFeatures[0].properties && (showNo)) {
              WCVue.$emit('getAlarmIdFun', showNo);
              // description = showNo;
              // 2020-10-15-点击交通灯弹出详情框
              let val = queryFeatures[0].properties;
              let emergencyLevel = JSON.parse(val.emergencyLevel);
              let status = JSON.parse(val.status);
              description = `
                  <div class='mapBox_box_detail'>
                    <p><label>Emergency Level: </label><span>${emergencyLevel.type}</span></p>
                    <p><label>System: </label><span>${val.system}</span></p>
                    <p><label>Type: </label><span>${val.type}</span></p>
                    <p><label>ID: </label><span>${showNo}</span></p>
                    <p><label>Location: </label><span>${val.location}</span></p>
                    <p><label>Status: </label><span>${status.type}</span></p>
                  </div>
                `;
            }
            break;
          case 'alarms-traffic':
            // console.log(layerID)
            // console.log(queryFeatures[0].properties)
            if (queryFeatures[0].properties && (showNo)) {
              WCVue.$emit('getAlarmIdFun', showNo);
              // description = showNo;
              // 2020-10-15-点击交通灯弹出详情框
              let val = queryFeatures[0].properties;
              let emergencyLevel = JSON.parse(val.emergencyLevel);
              let status = JSON.parse(val.status);
              description = `
                  <div class='mapBox_box_detail'>
                    <p><label>Emergency Level: </label><span>${emergencyLevel.type}</span></p>
                    <p><label>System: </label><span>${val.system}</span></p>
                    <p><label>Type: </label><span>${val.type}</span></p>
                    <p><label>ID: </label><span>${showNo}</span></p>
                    <p><label>Location: </label><span>${val.location}</span></p>
                    <p><label>Status: </label><span>${status.type}</span></p>
                  </div>
                `;
            }
            break;
          default:
            return
            break;
        }

        Popup = new mapboxgl.Popup()
          .setLngLat([point[0], point[1]])
          .setHTML(description)
          .addTo(map)
      }
    }, 500);

  } else {
    map.on('click', function (e) {
      let queryFeatures = map.queryRenderedFeatures(e.point, { layers: queryLayers });
      let description, coordinate;
      if (queryFeatures.length > 0) {
        var layerID = queryFeatures[0].layer.id;
        let data = queryFeatures[0].properties;
        console.log(data, 'data')
        let Measure = data.listSensorMeasure;
        let listSensorMeasure = Measure ? JSON.parse(Measure) : [];
        listSensorMeasure = listSensorMeasure.filter((val, index) => {
          let k = val.measureKey.toLowerCase();
          if (index > 3 || k.includes('type') || k === 'version' || k === 'occupancy') {
            return;
          }
          return val;
        });
        let list = '';
        if (listSensorMeasure.length > 0) {
          for (let i = 0; i < listSensorMeasure.length; i++) {
            list += `<div class="card_li ${listSensorMeasure[i].measureStatus === 2 ? 'red' : ''}">
                <div class="tit oneEllipsis" title='${listSensorMeasure[i].measureKey}'>${listSensorMeasure[i].measureKey}</div>
                <div class="val oneEllipsis" title='${listSensorMeasure[i].measureValue}'>${listSensorMeasure[i].measureValue}</div>
              </div>`;
          }
        }
        // 2020-09-01 所有都显示faultNo，如果没有再显示id
        let showNo = queryFeatures[0].properties.faultNo || queryFeatures[0].properties.equipment;
        // end

        /* 2020-11-02-获取当前IoT数据 */
        let iotId = queryFeatures[0].properties.id;
        let currentIot = {};
        for (let i = 0; i < allIotData.length; i++) {
          if (allIotData[i].properties.deviceId === iotId) {
            console.warn(allIotData[i].properties, 'zsz')
            currentIot = allIotData[i].properties;
          }
        }
        /* end */

        //##不同的图层弹出框内容配置
        switch (layerID) {
          case 'buildings_gov':
            description = `<div class="city_iot_default_img">${queryFeatures[0].properties.name}<img src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRNGNffUMMUL8dXB7BbkqIjCOZGUew-D_J8norCKqaQ1dqc9dcU&usqp=CAU" alt="Italian Trulli" width="100%" height="100%"></div>`;
            break;
          case 'buildings_others':
            description = `<div class="city_iot_default_img">${queryFeatures[0].properties.name}<img src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRNGNffUMMUL8dXB7BbkqIjCOZGUew-D_J8norCKqaQ1dqc9dcU&usqp=CAU" alt="Italian Trulli" width="100%" height="100%"></div>`;
            break;
          case 'car':
            description = `<div class="city_iot_default_img">${queryFeatures[0].properties.title}<img src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRNGNffUMMUL8dXB7BbkqIjCOZGUew-D_J8norCKqaQ1dqc9dcU&usqp=CAU" alt="Italian Trulli" width="100%" height="100%"></div>`;
            break;
          case 'Traffic CCTV':
            var imageSrc = queryFeatures[0].properties.url;
            description = `<div class="city_iot_default_img">${queryFeatures[0].properties.description}<img src='${imageSrc}' width="100%" height="100%"></div>`;
            break;
          case 'Traffic-Light':

            description = '<strong>' + 'LOCATION: ' + queryFeatures[0].properties.title + '</br>' + 'Time: ' + queryFeatures[0].properties.time + '</br>' + '</strong>';
            break;
          case 'IoT':
            console.log('iot')
            let id = queryFeatures[0].properties.deviceId;
            WCVue.$emit('city_iot_device_id', id);
            description = `<div class="city_list_box">
                <div class="iot_name">
                  <label><i class="ivu-icon ivu-icon-md-ionic"></i></label>
                  <span>${queryFeatures[0].properties.deviceName}</span>
                </div>
                <div class="city_iot_card">
                  ${list}
                </div>
                <div class="iot_ul">
                  <div class="iot_li">
                    <label>Region </label>
                    <span>${queryFeatures[0].properties.regionName}</span>
                  </div>
                  <div class="iot_li">
                    <label>SBU </label>
                    <span>${queryFeatures[0].properties.sbuOthersName}</span>
                  </div>
                </div>
              </div>`;
            break;
          case 'FSDIoT':
            console.log('FSDIoT')
            // console.error(queryFeatures[0].properties)
            if (queryFeatures[0].properties.id) {
              // debugger
              WCVue.$emit('city_iot_device_id', queryFeatures[0].properties.id);
              description = `<div class='mapBox_box_detail'>
                <p>
                  <label>${queryFeatures[0].properties.title} - ${currentIot.gwinType}</label>
                </p>
                <p>
                  <span>${currentIot.description}</span>
                </p>
              </div>`;
              {/* <div class="city_iot_card">
                    <div class="card_li">
                      <div class="tit oneEllipsis">Signal</div>
                      <div class="val oneEllipsis">${queryFeatures[0].properties.signal || ''} dBm</div>
                    </div>
                    <div class="card_li">
                      <div class="tit oneEllipsis">Battery</div>
                      <div class="val oneEllipsis">${queryFeatures[0].properties.battery || ''} V</div>
                    </div>
                    <div class="card_li">
                      <div class="tit oneEllipsis">Humidity</div>
                      <div class="val oneEllipsis">${queryFeatures[0].properties.humidity || ''} %</div>
                    </div>
                    <div class="card_li">
                      <div class="tit oneEllipsis">Temperature</div>
                      <div class="val oneEllipsis">${queryFeatures[0].properties.temperature || ''} °C</div>
                    </div>
                  </div>
                  <div class="iot_ul">
                    <div class="iot_li">
                      <label>Region </label>
                      <span>${queryFeatures[0].properties.regionName == undefined ? '' : queryFeatures[0].properties.regionName}</span>
                    </div>
                    <div class="iot_li">
                      <label>SBU </label>
                      <span>${queryFeatures[0].properties.sbuOthersName == undefined ? '' : queryFeatures[0].properties.sbuOthersName}</span>
                    </div>
                  </div> */}
            }
            break;
          case 'DSDIoT':
            console.log('DSDIoT')
            if (queryFeatures[0].properties.id) {
              // debugger
              WCVue.$emit('city_iot_device_id', queryFeatures[0].properties.id);
              description = `<div class='mapBox_box_detail'>
                <p>
                  <label>${queryFeatures[0].properties.title} - ${currentIot.gwinType}</label>
                </p>
                <p>
                  <span>${currentIot.description}</span>
                </p>
              </div>`;
              /* description = `<div class="city_list_box">
                  <div class="iot_name">
                    <label><i class="ivu-icon ivu-icon-md-ionic"></i></label>
                    <span>${queryFeatures[0].properties.title}</span>
                  </div>
                  <div class="iot_name">
                    <label><i class="ivu-icon ivu-icon-md-ionic"></i></label>
                    <span>${currentIot.description}</span>
                  </div>
                  </div>`; */
              {/* <div class="city_iot_card">
                    <div class="card_li">
                      <div class="tit oneEllipsis">Signal</div>
                      <div class="val oneEllipsis">${queryFeatures[0].properties.signal || ''} dBm</div>
                    </div>
                    <div class="card_li">
                      <div class="tit oneEllipsis">Battery</div>
                      <div class="val oneEllipsis">${queryFeatures[0].properties.battery || ''} V</div>
                    </div>
                    <div class="card_li">
                      <div class="tit oneEllipsis">Humidity</div>
                      <div class="val oneEllipsis">${queryFeatures[0].properties.humidity || ''} %</div>
                    </div>
                    <div class="card_li">
                      <div class="tit oneEllipsis">Temperature</div>
                      <div class="val oneEllipsis">${queryFeatures[0].properties.temperature || ''} °C</div>
                    </div>
                  </div>
                  <div class="iot_ul">
                    <div class="iot_li">
                      <label>Region </label>
                      <span>${queryFeatures[0].properties.regionName == undefined ? '' : queryFeatures[0].properties.regionName}</span>
                    </div>
                    <div class="iot_li">
                      <label>SBU </label>
                      <span>${queryFeatures[0].properties.sbuOthersName == undefined ? '' : queryFeatures[0].properties.sbuOthersName}</span>
                    </div>
                  </div> */}
            }
            break;
          case 'IoT_clusters':
            console.log('iot_clusters')
            var clusterId = data.cluster_id;
            map.getSource('IoT').getClusterExpansionZoom(
              clusterId,
              function (err, zoom) {
                if (zoom > 20) {
                  ({ description, coordinate } = clusterPopup('IoT', clusterId, description, coordinate, queryFeatures));
                }
                if (err) return;
                map.easeTo({
                  center: queryFeatures[0].geometry.coordinates,
                  zoom: zoom
                });
              }
            );
            return
          case 'FSDIoT_clusters':
            console.log('FSDIoT_clusters')
            var clusterId = data.cluster_id;
            map.getSource('FSDIoT').getClusterExpansionZoom(
              clusterId,
              function (err, zoom) {
                if (zoom > 20) {
                  ({ description, coordinate } = clusterPopup('FSDIoT', clusterId, description, coordinate, queryFeatures));
                }
                if (err) return;
                map.easeTo({
                  center: queryFeatures[0].geometry.coordinates,
                  zoom: zoom
                });
              }
            );
            return
            break;
          case 'DSDIoT_clusters':
            console.log('DSDIoT_clusters')
            var clusterId = data.cluster_id;
            map.getSource('DSDIoT').getClusterExpansionZoom(
              clusterId,
              function (err, zoom) {
                if (zoom > 20) {
                  ({ description, coordinate } = clusterPopup('DSDIoT', clusterId, description, coordinate, queryFeatures));
                }
                if (err) return;
                map.easeTo({
                  center: queryFeatures[0].geometry.coordinates,
                  zoom: zoom
                });
              }
            );
            return
            break;
          case 'RMU':
            description = `<div class='mapBox_box_detail'>
              <p><label>ID: </label><span>${queryFeatures[0].properties.rmuId}</span></p>
              <p><label>Event: </label><span>${queryFeatures[0].properties.event}</span></p>
              <p><label>Location: </label><span>${queryFeatures[0].properties.location}</span></p>
            </div>`
            WCVue.$emit('rumDataObj', queryFeatures[0].properties);
            break
          case 'RMUWarn':
            description = `<div class='mapBox_box_detail'>
              <p><label>ID: </label><span>${queryFeatures[0].properties.rmuId}</span></p>
              <p><label>Event: </label><span>${queryFeatures[0].properties.event}</span></p>
              <p><label>Location: </label><span>${queryFeatures[0].properties.location}</span></p>
            </div>`
            WCVue.$emit('rumDataObj', queryFeatures[0].properties);
            break
          case 'Lift':
            console.log('Lift')
            // console.error(queryFeatures[0].properties)
            if (queryFeatures[0].properties.id) {
              // @ZSZ 单击
              WCVue.$emit('city_lift_device_id', queryFeatures[0].properties.id);
              description = `<div class="city_list_box">
                  <div class="iot_name">
                    <label><i class="ivu-icon ivu-icon-md-ionic"></i></label>
                    <span>${queryFeatures[0].properties.title}</span>
                  </div>
                  </div>`;
            }
            break;
          case 'Lift_clusters':
            console.log('Lift_clusters')
            var clusterId = data.cluster_id;
            map.getSource('Lift').getClusterExpansionZoom(
              clusterId,
              function (err, zoom) {
                if (zoom > 20) {
                  ({ description, coordinate } = clusterPopup('Lift', clusterId, description, coordinate, queryFeatures));
                }
                if (err) return;
                map.easeTo({
                  center: queryFeatures[0].geometry.coordinates,
                  zoom: zoom
                });
              }
            );
            return
          case 'alarms-ccep':
            if (queryFeatures[0].properties && (showNo)) {
              WCVue.$emit('getAlarmIdFun', showNo);
              // description = showNo;
              // 2020-10-15-点击交通灯弹出详情框
              let val = queryFeatures[0].properties;
              let emergencyLevel = JSON.parse(val.emergencyLevel);
              let status = JSON.parse(val.status);
              description = `
                  <div class='mapBox_box_detail'>
                    <p><label>Emergency Level: </label><span>${emergencyLevel.type}</span></p>
                    <p><label>System: </label><span>${val.system}</span></p>
                    <p><label>Type: </label><span>${val.type}</span></p>
                    <p><label>ID: </label><span>${showNo}</span></p>
                    <p><label>Location: </label><span>${val.location}</span></p>
                    <p><label>Status: </label><span>${status.type}</span></p>
                  </div>
                `;
            }
            break;
          case 'alarms-traffic':
            // console.log(layerID)
            // console.log(queryFeatures[0].properties)
            if (queryFeatures[0].properties && (showNo)) {
              WCVue.$emit('getAlarmIdFun', showNo);
              // description = showNo;
              // 2020-10-15-点击交通灯弹出详情框
              let val = queryFeatures[0].properties;
              let emergencyLevel = JSON.parse(val.emergencyLevel);
              let status = JSON.parse(val.status);
              description = `
                  <div class='mapBox_box_detail'>
                    <p><label>Emergency Level: </label><span>${emergencyLevel.type}</span></p>
                    <p><label>System: </label><span>${val.system}</span></p>
                    <p><label>Type: </label><span>${val.type}</span></p>
                    <p><label>ID: </label><span>${showNo}</span></p>
                    <p><label>Location: </label><span>${val.location}</span></p>
                    <p><label>Status: </label><span>${status.type}</span></p>
                  </div>
                `;
            }
            break;
          //## 配置 gps-car 弹出框 @SZ
          case 'gpsCaricon':
            if (data) {
              description = JSON.stringify(data);
            }

            break;
          //## 配置 gps-dev 弹出框 @SZ
          case 'gpsDevicon':
            if (data) {
              description = JSON.stringify(data);
            }
            break;
          default:
            return
            break;
        }
        Popup = new mapboxgl.Popup()
          .setLngLat([e.lngLat.lng, e.lngLat.lat])
          .setHTML(description)
          .addTo(map)
      }
    });
  }
}
/* ---------------------------------- 定位 --------------------------------- */
//定位到建筑之前的版本
// mapBox.easeTo = function (index, name, image) {
//   if (Popup) {
//     Popup.remove();
//   }
//   switch (index) {
//     case 0:
//       var center = [114.1556865, 22.288546799999995]
//       break;
//     case 1:
//       var center = [114.15499399999999, 22.286593999999997]
//       break;
//     case 2:
//       var center = [114.1524863, 22.287639]
//       break;
//     case 3:
//       var center = [114.2084053, 22.2922788]
//       break;
//     case 4:
//       var center = [114.15145025, 22.285003449999998]
//       break;
//     case 5:
//       var center = [114.1574514, 22.2786766]
//       break;
//     case 6:
//       var center = [114.16342949999999, 22.278344699999998]
//       break;
//     case 7:
//       var center = [114.16586, 22.2802975]
//       break;
//   }
//   map.easeTo({
//     center: center,
//     essential: true
//   });
//   var description = `<div class="city_iot_default_img">
//     <strong>${name}</strong>
//     <p>
//       <img src='${image}' alt="Italian Trulli" width="100%" height="100%">
//     </p>
//   </div>`;
//   Popup = new mapboxgl.Popup()
//     .setLngLat(center)
//     .setHTML(description)
//     .addTo(map);
// }
//##点击左侧栏建筑的操作
mapBox.leftClickMenu = function (item, curTabsNum) {
  console.log(curTabsNum)
  switch (curTabsNum) {
    case 0:
      if (Popup) {
        Popup.remove();
      }
      let name = item.buildingName
      let image = item.buildImages.imagePath
      map.easeTo({
        center: item.gisCoordinate,
        essential: true
      });
      var description = `<div class="city_iot_default_img">
    <strong>${name}</strong>
    <p>
      <img src='${image}' alt="Italian Trulli" width="100%" height="100%">
    </p>
  </div>`;
      Popup = new mapboxgl.Popup()
        .setLngLat(item.gisCoordinate)
        .setHTML(description)
        .addTo(map);
      break;
    case 1:
      mapBox.mapClick(item.gisCoordinate, ['FSDIoT', 'FSDIoT_clusters', 'DSDIoT', 'DSDIoT_clusters'])
      break;
    case 5:
      console.log(item, 'lift')
      mapBox.mapClick(item.gisCoordinate, ['Lift', 'Lift_clusters'])
      break;
    default:
      break;
  }
}

//##定位到assets
mapBox.flyToAssets = function (index, name, image) {
  if (Popup) {
    Popup.remove();
  }
  if (assetsList && assetsList[index]) {
    map.easeTo({
      center: assetsList[index],
      essential: true
    });
    var description = '<strong>' + name + '</strong><p>' + '<img src=' + image + ' alt="Italian Trulli" width="100%" height="100%">';

    Popup = new mapboxgl.Popup()
      .setLngLat(assetsList[index])
      .setHTML(description)
      .addTo(map);
  }

}

//##定位到 IoT
mapBox.flyIoIots = function (index, item) {
  map.easeTo({
    center: item.gisCoordinate,
    essential: true
  });
  let listSensorMeasure = item.listSensorMeasure;
  let list = '';
  if (listSensorMeasure.length > 0) {
    for (let i = 0; i < listSensorMeasure.length; i++) {
      list += `<div class="card_li ${listSensorMeasure[i].measureStatus === 2 ? 'red' : ''}">
        <div class="tit oneEllipsis" title='${listSensorMeasure[i].measureKey}'>${listSensorMeasure[i].measureKey}</div>
        <div class="val oneEllipsis" title='${listSensorMeasure[i].measureValue}'>${listSensorMeasure[i].measureValue}</div>
      </div>`;
    }
  }
  var description = `<div class="city_list_box">
    <div class="iot_name">
      <label><i class="ivu-icon ivu-icon-md-ionic"></i></label>
      <span>${item.deviceName}</span>
    </div>
    <div class="city_iot_card">
      ${list}
    </div>
    <div class="iot_ul">
      <div class="iot_li">
        <label>Region </label>
        <span>${item.region}</span>
      </div>
      <div class="iot_li">
        <label>SBU </label>
        <span>${item.sbu}</span>
      </div>
    </div>
  </div>`;
  if (Popup) {
    Popup.remove();
  }
  Popup = new mapboxgl.Popup()
    .setLngLat(item.gisCoordinate)
    .setHTML(description)
    .addTo(map)
}

//##定位到车辆
mapBox.flyToVehicles = function (index, name, image) {
  if (vehiclesList && vehiclesList[index]) {
    map.easeTo({
      center: vehiclesList[index],
      essential: true
    });
    var description = '<strong>' + name + '</strong><p>' + '<img src=' + image + ' alt="Italian Trulli" width="100%" height="100%">';
    if (Popup) {
      Popup.remove();
    }
    Popup = new mapboxgl.Popup()
      .setLngLat(vehiclesList[index])
      .setHTML(description)
      .addTo(map);
  }

}

//##定位到当前设备位置，并增加图标
mapBox.addIotIcon = function (coordinate) {
  if (eval(coordinate)) {
    map.easeTo({
      center: eval(coordinate),
      essential: true
    });
    var marker = new mapboxgl.Marker({
      color: '#FE014A'
    })
      .setLngLat(eval(coordinate))
      .addTo(map);
  }

}

//##定位到region
mapBox.switchToRegion = function (regionId) {
  //基于geocording定位
  axios.post(URL.api + "CityEquipment/GetRegionList", {}).then(res => {
    // 根据传过来的regionId，获取对应的 regionName
    res.data.data.forEach(element => {
      if (element.regionId === regionId) {
        var regionNameSplice = element.regionName.replace(/([A-Z])/g, ' $1'); //将regionName分词，便于后续的geocording进行
        let geoCodingUrl = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + regionNameSplice + '.json?access_token=' + mapboxKey + '&cachebuster=1592292617705&autocomplete=true&country=hk&types=country%2Cregion%2Cdistrict%2Cpostcode%2Clocality%2Cplace%2Cneighborhood%2Caddress%2Cpoi&bbox=113.835031570189%2C22.1533950797306%2C114.428685402771%2C22.5619483201592&limit=3&language=en';
        axios.get(geoCodingUrl).then(res => {
          map.fitBounds([
            [res.data.features[0].bbox[0], res.data.features[0].bbox[1]],
            [res.data.features[0].bbox[2], res.data.features[0].bbox[3]]
          ], {
            bearing: 0,
            zoom: 13,
            pitch: 0
          });
        });
      }
    });
  });
  //手动定位
  // var center = [];
  // switch (regionId) {
  //   case '5ecf7e4df3ef472144967847':
  //     center = [114.178696, 22.262585]
  //     break;
  //   case '5ecf7e66f3ef472144967848':
  //     center = [114.203684, 22.326169]
  //     break;
  //   case '5ecf7e84f3ef472144967849':
  //     center = [114.203684, 22.326169]
  //     break;
  //   case '5ecf7e90f3ef47214496784a':
  //     center = [114.165808, 22.303201]
  //     break;
  //   case '5ecf7ea2f3ef47214496784b':
  //     center = [113.938287, 22.287724]
  //     break;
  //   case '5ecf7eb5f3ef47214496784c':
  //     center = [113.987283, 22.458030]
  //     break;
  //   case '5ecf7ec4f3ef47214496784d':
  //     center = [114.168268, 22.446774]
  //     break;
  //   default:
  //     center = [114.203684, 22.326169]
  //     break;
  // }
  // map.easeTo({
  //   center: center,
  //   essential: true,
  //   bearing: 0,
  //   zoom:13,
  //   pitch:0
  // });
}

/* --------------------------------- IoT -------------------------------- */
//## IoT 筛选关联
mapBox.addIotSearchResult = function (params, arr) {
  if (Popup) {
    Popup.remove();
  }
  if (params.region) {
    map.setLayoutProperty('FSDIoT', 'visibility', 'none');
    map.setLayoutProperty('FSDIoT_clusters', 'visibility', 'none');
    map.setLayoutProperty('FSDIoT_cluster-count', 'visibility', 'none');
    map.setLayoutProperty('DSDIoT', 'visibility', 'none');
    map.setLayoutProperty('DSDIoT_clusters', 'visibility', 'none');
    map.setLayoutProperty('DSDIoT_cluster-count', 'visibility', 'none');
    //视角缩放到查询结果的第一个sensor的坐标处
    // if (arr[0]&&arr[0].geometry.coordinates) {
    //   map.easeTo({
    //     center: arr[0].geometry.coordinates,
    //     essential: true,
    //     bearing: 0,
    //     zoom: 13,
    //     pitch: 0
    //   });
    // }
    //缩放到region
    mapBox.switchToRegion(params.region);
    var temGeojson = {
      "type": "FeatureCollection",
      "features": []
    }
    arr.forEach(element => {
      if (element.geometry.coordinates.length > 0) {
        temGeojson.features.push(element)
      } else {
        temGeojson.features.splice(0, temGeojson.features.length);
      }
    });
    var size = 100;
    var IOTPulsingDot = {
      width: size,
      height: size,
      data: new Uint8Array(size * size * 4),

      // get rendering context for the map canvas when layer is added to the map
      onAdd: function () {
        var canvas = document.createElement('canvas');
        canvas.width = this.width;
        canvas.height = this.height;
        this.context = canvas.getContext('2d');
      },

      // called once before every frame where the icon will be used
      render: function () {
        var duration = 100000000000000000;
        var t = (performance.now() % duration) / duration;

        var radius = (size / 2) * 0.3;
        var outerRadius = (size / 2) * 0.7 * t + radius;
        var context = this.context;

        // draw outer circle
        context.clearRect(0, 0, this.width, this.height);
        context.beginPath();
        context.arc(
          this.width / 2,
          this.height / 2,
          outerRadius,
          0,
          Math.PI * 2
        );
        context.fillStyle = 'rgba(40, 255, 255,' + (1 - t) + ')';
        context.fill();

        // draw inner circle
        context.beginPath();
        context.arc(
          this.width / 2,
          this.height / 2,
          radius,
          0,
          Math.PI * 2
        );

        context.fillStyle = '#55BAF7';
        context.strokeStyle = 'white';
        context.lineWidth = 2 + 4 * (1 - t);
        context.fill();
        context.stroke();

        // update this image's data with data from the canvas
        this.data = context.getImageData(
          0,
          0,
          this.width,
          this.height
        ).data;

        // continuously repaint the map, resulting in the smooth animation of the dot
        map.triggerRepaint();

        // return `true` to let the map know that the image was updated
        return true;
      }
    };
    addPointLayer({
      sourceName: 'IoT',
      data: temGeojson,
      image: IOTPulsingDot,
      cluster: true,
      clusterColor: '#55BAF7'
    })
  } else {
    if (map.getLayer('IoT')) {
      map.setLayoutProperty('IoT', 'visibility', 'none');
      map.setLayoutProperty('IoT_clusters', 'visibility', 'none');
      map.setLayoutProperty('IoT_cluster-count', 'visibility', 'none');
    }
  }
}
//##直接增加ken的iot
mapBox.addKenIots = function () {
  if (Popup) {
    Popup.remove();
  }
  axios.get(URL.kenAPI + 'hkapi/api/v1/city/sensor-latest').then(res => {
    if (res.status === 200 && res.data) {
      var temGeojsonFSD = {
        "type": "FeatureCollection",
        "features": []
      }
      var temGeojsonDSD = {
        "type": "FeatureCollection",
        "features": []
      }
      res.data.forEach(element => {
        // console.log(element.TdeviceType)
        if (element.latitude && element.longitude) {
          if (element.TdeviceType && element.TdeviceType == 'Water Level Sensor') {
            var feature = { "geometry": { "coordinates": [JSON.parse(element.longitude), JSON.parse(element.latitude)], "type": "Point" }, "properties": { "title": element.location, 'id': element.id, "deviceName": element.name }, "type": "Feature" }
            temGeojsonDSD.features.push(feature)
          } else {
            var feature = { "geometry": { "coordinates": [JSON.parse(element.longitude), JSON.parse(element.latitude)], "type": "Point" }, "properties": { "title": element.location, 'id': element.id, "deviceName": element.name }, "type": "Feature" }
            temGeojsonFSD.features.push(feature)
          }
        }
      });
      // 增加sensor pulsingDot icon
      var size = 100;
      //有光晕的点
      var FSDIoTPulsingDot = {
        width: size,
        height: size,
        data: new Uint8Array(size * size * 4),

        // get rendering context for the map canvas when layer is added to the map
        onAdd: function () {
          var canvas = document.createElement('canvas');
          canvas.width = this.width;
          canvas.height = this.height;
          this.context = canvas.getContext('2d');
        },

        // called once before every frame where the icon will be used
        render: function () {
          var duration = 1000;
          var t = (performance.now() % duration) / duration;

          var radius = (size / 2) * 0.3;
          var outerRadius = (size / 2) * 0.7 * t + radius;
          var context = this.context;

          // draw outer circle
          context.clearRect(0, 0, this.width, this.height);
          context.beginPath();
          context.arc(
            this.width / 2,
            this.height / 2,
            outerRadius,
            0,
            Math.PI * 2
          );
          context.fillStyle = 'rgba(40, 255, 255,' + (1 - t) + ')';
          context.fill();

          // draw inner circle
          context.beginPath();
          context.arc(
            this.width / 2,
            this.height / 2,
            radius,
            0,
            Math.PI * 2
          );

          context.fillStyle = '#55BAF7';
          context.strokeStyle = 'white';
          context.lineWidth = 2 + 4 * (1 - t);
          context.fill();
          context.stroke();

          // update this image's data with data from the canvas
          this.data = context.getImageData(
            0,
            0,
            this.width,
            this.height
          ).data;

          // continuously repaint the map, resulting in the smooth animation of the dot
          map.triggerRepaint();

          // return `true` to let the map know that the image was updated
          return true;
        }
      };
      var DSDIoTPulsingDot = {
        width: size,
        height: size,
        data: new Uint8Array(size * size * 4),

        // get rendering context for the map canvas when layer is added to the map
        onAdd: function () {
          var canvas = document.createElement('canvas');
          canvas.width = this.width;
          canvas.height = this.height;
          this.context = canvas.getContext('2d');
        },

        // called once before every frame where the icon will be used
        render: function () {
          var duration = 1000;
          var t = (performance.now() % duration) / duration;

          var radius = (size / 2) * 0.3;
          var outerRadius = (size / 2) * 0.7 * t + radius;
          var context = this.context;

          // draw outer circle
          context.clearRect(0, 0, this.width, this.height);
          context.beginPath();
          context.arc(
            this.width / 2,
            this.height / 2,
            outerRadius,
            0,
            Math.PI * 2
          );
          context.fillStyle = 'rgba(40, 255, 255,' + (1 - t) + ')';
          context.fill();

          // draw inner circle
          context.beginPath();
          context.arc(
            this.width / 2,
            this.height / 2,
            radius,
            0,
            Math.PI * 2
          );

          context.fillStyle = '#99CC00';
          context.strokeStyle = 'white';
          context.lineWidth = 2 + 4 * (1 - t);
          context.fill();
          context.stroke();

          // update this image's data with data from the canvas
          this.data = context.getImageData(
            0,
            0,
            this.width,
            this.height
          ).data;

          // continuously repaint the map, resulting in the smooth animation of the dot
          map.triggerRepaint();

          // return `true` to let the map know that the image was updated
          return true;
        }
      };
      //无光晕的点
      var FSDIoTDot = {
        width: size,
        height: size,
        data: new Uint8Array(size * size * 4),

        // get rendering context for the map canvas when layer is added to the map
        onAdd: function () {
          var canvas = document.createElement('canvas');
          canvas.width = this.width;
          canvas.height = this.height;
          this.context = canvas.getContext('2d');
        },

        // called once before every frame where the icon will be used
        render: function () {
          var duration = 100000000000000000;
          var t = (performance.now() % duration) / duration;

          var radius = (size / 2) * 0.3;
          var outerRadius = (size / 2) * 0.7 * t + radius;
          var context = this.context;

          // draw outer circle
          context.clearRect(0, 0, this.width, this.height);
          context.beginPath();
          context.arc(
            this.width / 2,
            this.height / 2,
            outerRadius,
            0,
            Math.PI * 2
          );
          context.fillStyle = 'rgba(40, 255, 255,' + (1 - t) + ')';
          context.fill();

          // draw inner circle
          context.beginPath();
          context.arc(
            this.width / 2,
            this.height / 2,
            radius,
            0,
            Math.PI * 2
          );

          context.fillStyle = '#55BAF7';
          context.strokeStyle = 'white';
          context.lineWidth = 2 + 4 * (1 - t);
          context.fill();
          context.stroke();

          // update this image's data with data from the canvas
          this.data = context.getImageData(
            0,
            0,
            this.width,
            this.height
          ).data;

          // continuously repaint the map, resulting in the smooth animation of the dot
          map.triggerRepaint();

          // return `true` to let the map know that the image was updated
          return true;
        }
      };
      var DSDIoTDot = {
        width: size,
        height: size,
        data: new Uint8Array(size * size * 4),

        // get rendering context for the map canvas when layer is added to the map
        onAdd: function () {
          var canvas = document.createElement('canvas');
          canvas.width = this.width;
          canvas.height = this.height;
          this.context = canvas.getContext('2d');
        },

        // called once before every frame where the icon will be used
        render: function () {
          var duration = 100000000000000000;//通过修改这个值来空值是否显示光晕
          var t = (performance.now() % duration) / duration;

          var radius = (size / 2) * 0.3;
          var outerRadius = (size / 2) * 0.7 * t + radius;
          var context = this.context;

          // draw outer circle
          context.clearRect(0, 0, this.width, this.height);
          context.beginPath();
          context.arc(
            this.width / 2,
            this.height / 2,
            outerRadius,
            0,
            Math.PI * 2
          );
          context.fillStyle = 'rgba(40, 255, 255,' + (1 - t) + ')';
          context.fill();

          // draw inner circle
          context.beginPath();
          context.arc(
            this.width / 2,
            this.height / 2,
            radius,
            0,
            Math.PI * 2
          );

          context.fillStyle = '#99CC00';
          context.strokeStyle = 'white';
          context.lineWidth = 2 + 4 * (1 - t);
          context.fill();
          context.stroke();

          // update this image's data with data from the canvas
          this.data = context.getImageData(
            0,
            0,
            this.width,
            this.height
          ).data;

          // continuously repaint the map, resulting in the smooth animation of the dot
          map.triggerRepaint();

          // return `true` to let the map know that the image was updated
          return true;
        }
      };
      addPointLayer({
        sourceName: 'FSDIoT',
        data: temGeojsonFSD,
        image: FSDIoTDot,
        cluster: true,
        clusterColor: '#55BAF7'
      });
      addPointLayer({
        sourceName: 'DSDIoT',
        data: temGeojsonDSD,
        image: DSDIoTDot,
        cluster: true,
        clusterColor: '#99CC00'
      });
    }
  })
}
mapBox.getAllIotData = function (arr) {
  allIotData = arr;
}
/* ---------------------------------- CCTV ---------------------------------- */

mapBox.addTraffic = function () {
  if (Popup) {
    Popup.remove();
  }
  axios.get('/static/json/CCTV_extract.json').then(res => {
    if (res.status === 200 && res.data) {
      map.loadImage(
        '/static/img/icon-cctv.png',
        function (error, image) {
          if (error) throw error;
          addPointLayer({
            sourceName: 'Traffic CCTV',
            data: res.data,
            image: image,
            imageRatio: 5,
          })

        });
    }

  })
}

/* ------------------------------ traffic light ----------------------------- */
mapBox.addTrafficLight = function () {
  if (Popup) {
    Popup.remove();
  }
  axios.get(URL.kenAPI + 'hkapi/api/v1/city/traffic-light').then(res => {
    if (res.status === 200 && res.data) {
      var temGeojson = {
        "type": "FeatureCollection",
        "features": []
      }
      res.data[0].forEach(element => {
        if (element.LAT && element.LONG) {
          var feature = { "geometry": { "coordinates": [parseFloat(element.LONG), parseFloat(element.LAT)], "type": "Point" }, "properties": { "title": element.EQUIPMENT_LOCATION, time: element.time }, "type": "Feature" }
          temGeojson.features.push(feature)
        }
      });
      if (res.status === 200 && res.data) {
        map.loadImage(
          '/static/img/traffic light2.png',
          function (error, image) {
            if (error) throw error;
            addPointLayer({
              sourceName: 'Traffic-Light',
              data: temGeojson,
              image: image,
              imageRatio: 3,
            })

          });
      }
    }
  })
}

/* ----------------------------------- RMU ---------------------------------- */
//## 定位到 RMU
mapBox.flyToRMU = function (params) {
  if (Popup) {
    Popup.remove();
  }
  if (params && params.row.gisCoordinate) {
    map.easeTo({
      center: params.row.gisCoordinate,
      essential: true
    });
    var description = '<strong>' + params.row.location + '</strong><p>' + '<p>' + params.row.rmuId + '</p>';
    description = `<div class='mapBox_box_detail'>
              <p><label>ID: </label><span>${params.row.rmuId}</span></p>
              <p><label>Event: </label><span>${params.row.event}</span></p>
              <p><label>Location: </label><span>${params.row.location}</span></p>
            </div>`
    Popup = new mapboxgl.Popup()
      .setLngLat(params.row.gisCoordinate,)
      .setHTML(description)
      .addTo(map);
  }

}
//##增加RMU，数据与下方表格同步
mapBox.addRMUSearchResult = function (arr) {
  if (Popup) {
    Popup.remove();
  }
  if (arr) {
    var temGeojsonRMU = {
      "type": "FeatureCollection",
      "features": []
    }
    var temGeojsonRMUWarn = {
      "type": "FeatureCollection",
      "features": []
    }
    arr.forEach(element => {
      if (element.gisCoordinate && !element.gisCoordinate.includes("'") && !element.gisCoordinate.includes("undefined")) {
        var feature = { "geometry": { "coordinates": [JSON.parse(element.gisCoordinate[0]), JSON.parse(element.gisCoordinate[1])], "type": "Point" }, "type": "Feature" };
        feature.properties = element;
        if (element.isWarn) {
          temGeojsonRMUWarn.features.push(feature)
        } else {
          temGeojsonRMU.features.push(feature)
        }
      }
    });
    console.log(temGeojsonRMUWarn)
    map.loadImage(
      '/static/img/icon-RMU.png',
      function (error, image) {
        if (error) throw error;
        addPointLayer({
          sourceName: 'RMU',
          data: temGeojsonRMU,
          image: image,
          imageRatio: 5,
          overlap: true
        })
      });
    map.loadImage(
      '/static/img/icon-alarm.png',
      function (error, image) {
        if (error) throw error;
        addPointLayer({
          sourceName: 'RMUWarn',
          data: temGeojsonRMUWarn,
          image: image,
          imageRatio: 5,
          overlap: true
        })
      });
  }
}
/* ---------------------------------- alarm --------------------------------- */
// ## 展示 alarms
mapBox.addAlarmSearchResult = function (arr) {
  if (Popup) {
    Popup.remove();
  }
  if (arr) {
    var temGeojsonCCEP = {
      "type": "FeatureCollection",
      "features": []
    }
    var temGeojsonTrafficLight = {
      "type": "FeatureCollection",
      "features": []
    }
    arr.forEach(element => {
      if (element.detail.coordinates && !element.detail.coordinates.includes("'") && !element.detail.coordinates.includes("undefined")) {
        var feature = { "geometry": { "coordinates": [JSON.parse(element.detail.coordinates)[0], JSON.parse(element.detail.coordinates)[1]], "type": "Point" }, "type": "Feature" };
        feature.properties = element;
        switch (element.system) {
          case 'Traffic-Light':
            temGeojsonTrafficLight.features.push(feature)
            break;
          case 'CCEP':
            temGeojsonCCEP.features.push(feature)
            break;
          default:
            break;
        }
      }
    });
    //## 修复 traffic light 图标
    map.loadImage(
      '/static/img/icon-alarm.png',
      function (error, image) {
        if (error) throw error;
        addPointLayer({
          sourceName: 'alarms-ccep',
          data: temGeojsonCCEP,
          image: image,
          imageRatio: 5,
          overlap: true
        })
      });
    map.loadImage(
      '/static/img/traffic light2.png',
      function (error, image) {
        if (error) throw error;
        addPointLayer({
          sourceName: 'alarms-traffic',
          data: temGeojsonTrafficLight,
          image: image,
          imageRatio: 3,
          overlap: true
        })

      });
  }
}
//## 定位到 alarms
mapBox.flyToAlarm = function (params) {
  let coordinate = [JSON.parse(params.row.detail.coordinates)[0], JSON.parse(params.row.detail.coordinates)[1]];
  map.easeTo({
    center: coordinate,
    essential: true
  });
  var description = params.row.faultNo || params.row.equipment;
  if (Popup) {
    Popup.remove();
  }
  Popup = new mapboxgl.Popup()
    .setLngLat(coordinate)
    .setHTML(description)
    .addTo(map)
}

/* ---------------------------------- lift ---------------------------------- */
//##加载全部 lift
mapBox.addAllLift = function (arr) {
  if (Popup) {
    Popup.remove();
  }
  if (arr && arr.features[0].geometry.coordinates) {
    var temGeojson = {
      "type": "FeatureCollection",
      "features": []
    }
    arr.features.forEach(element => {
      if (element.geometry.coordinates[0]) {
        //battery的字段访问方式还不统一，有的是element.data.Battery voltage.value,有的是element.data.BatteryVoltage
        var feature = { "geometry": { "coordinates": [JSON.parse(element.geometry.coordinates[0]), JSON.parse(element.geometry.coordinates[1])], "type": "Point" }, "properties": { "title": element.properties.venue, 'id': element.properties.cityLiftDeviceId, "deviceName": element.properties.liftDeviceName }, "type": "Feature" }
        temGeojson.features.push(feature)
      }
    });
    // 增加sensor pulsingDot icon
    var size = 100;
    var IOTPulsingDot = {
      width: size,
      height: size,
      data: new Uint8Array(size * size * 4),

      // get rendering context for the map canvas when layer is added to the map
      onAdd: function () {
        var canvas = document.createElement('canvas');
        canvas.width = this.width;
        canvas.height = this.height;
        this.context = canvas.getContext('2d');
      },

      // called once before every frame where the icon will be used
      render: function () {
        var duration = 100000000000000000;
        var t = (performance.now() % duration) / duration;

        var radius = (size / 2) * 0.3;
        var outerRadius = (size / 2) * 0.7 * t + radius;
        var context = this.context;

        // draw outer circle
        context.clearRect(0, 0, this.width, this.height);
        context.beginPath();
        context.arc(
          this.width / 2,
          this.height / 2,
          outerRadius,
          0,
          Math.PI * 2
        );
        context.fillStyle = 'rgba(40, 255, 255,' + (1 - t) + ')';
        context.fill();

        // draw inner circle
        context.beginPath();
        context.arc(
          this.width / 2,
          this.height / 2,
          radius,
          0,
          Math.PI * 2
        );

        context.fillStyle = '#E6DB74';
        context.strokeStyle = 'white';
        context.lineWidth = 2 + 4 * (1 - t);
        context.fill();
        context.stroke();

        // update this image's data with data from the canvas
        this.data = context.getImageData(
          0,
          0,
          this.width,
          this.height
        ).data;

        // continuously repaint the map, resulting in the smooth animation of the dot
        map.triggerRepaint();

        // return `true` to let the map know that the image was updated
        return true;
      }
    };
    addPointLayer({
      sourceName: 'Lift',
      data: temGeojson,
      image: IOTPulsingDot,
      cluster: true,
      clusterColor: '#55BAF7'
    });
  }

}
/* ---------------------------------- 图层切换 ---------------------------------- */

mapBox.layersSwitch = function (layerName) {
  console.log(layerName)
  if (Popup) {
    Popup.remove();
  }
  myLayers.forEach(element => {
    if (map.getLayer(element)) {
      map.setLayoutProperty(element, 'visibility', 'none');
    }
  });
  if (map.getLayer('buildings_gov')) {
    map.setLayoutProperty('buildings_gov', 'visibility', 'visible');
    map.setPaintProperty(
      'buildings_gov',
      'fill-extrusion-opacity',
      0.2
    );
  }
  if (map.getLayer('buildings_others')) {
    map.setLayoutProperty('buildings_others', 'visibility', 'visible');
    map.setPaintProperty(
      'buildings_others',
      'fill-extrusion-opacity',
      0.2
    );
  }
  map.easeTo({
    center: [114.203684, 22.326169],
    essential: true,
    bearing: 0,
    zoom: 12,
    pitch: 0
  });
  switch (layerName) {
    case 'Building':
      map.setPaintProperty(
        'buildings_others',
        'fill-extrusion-opacity',
        0.5
      );
      map.setPaintProperty(
        'buildings_gov',
        'fill-extrusion-opacity',
        1
      );
      map.easeTo({
        center: [114.20353, 22.32588],
        essential: true,
        rotation: 300,
        zoom: 15,
        pitch: 60,
      });
      queryLayers = ['buildings_others', 'buildings_gov']
      return
      break;
    case 'IoT':
      if (map.getLayer('IoT')) {
        map.setLayoutProperty('IoT', 'visibility', 'visible');
      }
      if (map.getLayer('FSDIoT')) {
        map.setLayoutProperty('FSDIoT', 'visibility', 'visible');
        map.setLayoutProperty('FSDIoT_clusters', 'visibility', 'visible');
        map.setLayoutProperty('FSDIoT_cluster-count', 'visibility', 'visible');
        map.setLayoutProperty('DSDIoT', 'visibility', 'visible');
        map.setLayoutProperty('DSDIoT_clusters', 'visibility', 'visible');
        map.setLayoutProperty('DSDIoT_cluster-count', 'visibility', 'visible');
      } else {
        mapBox.addKenIots();
      };
      break;
    case 'Emergency Asset':
      break;
    case 'Vehicle':
      if (map.getLayer('car')) {
        map.setLayoutProperty('car', 'visibility', 'visible');
        map.setLayoutProperty('trace', 'visibility', 'visible');
      }
      break;
    case 'Traffic CCTV':
      if (map.getLayer('Traffic CCTV')) {
        map.setLayoutProperty('Traffic CCTV', 'visibility', 'visible');
      } else {
        mapBox.addTraffic();
      }
      break;
    case 'RMU':
      if (map.getLayer('RMU')) {
        map.setLayoutProperty('RMU', 'visibility', 'visible');
        map.setLayoutProperty('RMUWarn', 'visibility', 'visible');
      } else {
        mapBox.addRMUSearchResult();
      }
      break;
    case 'Lift':
      if (map.getLayer('Lift')) {
        map.setLayoutProperty('Lift', 'visibility', 'visible');
        map.setLayoutProperty('Lift_clusters', 'visibility', 'visible');
        map.setLayoutProperty('Lift_cluster-count', 'visibility', 'visible');
      } else {
        mapBox.addAllLift();
      };
      break
    case 'Traffic-Light':
      if (map.getLayer('Traffic-Light')) {
        map.setLayoutProperty('Traffic-Light', 'visibility', 'visible');
      } else {
        mapBox.addTrafficLight();
      }
      map.easeTo({
        center: [114.173902, 22.282745],
        essential: true,
        bearing: 0,
        zoom: 13,
        pitch: 0
      });
      break;
    case 'RDCC':
      if (map.getLayer('alarms-ccep')) {
        map.setLayoutProperty('alarms-ccep', 'visibility', 'visible');
      }
      if (map.getLayer('alarms-traffic')) {
        map.setLayoutProperty('alarms-traffic', 'visibility', 'visible');
      }
      break;
    //## ！配置 gps 图层
    case 'GPS':
      if (map.getLayer('gpsCaricon')) {
        map.setLayoutProperty('gpsCaricon', 'visibility', 'visible');
        map.setLayoutProperty('gpsDevicon', 'visibility', 'visible');
      } else {
        mapBox.addGpsCar(gpsCar, 'gpsCar', '/static/img/icon-gps-car.png')
        mapBox.addGpsCar(gpsDev, 'gpsDev', '/static/img/icon-gps-dev.png')
      }
      map.easeTo({
        center: vehiclesList[0],
        essential: true,
        rotation: 300,
        zoom: 18,
        pitch: 60,
      });
      break;
    default:
      break;
  }
  queryLayers = [];
  myLayers.forEach(element => {
    if (element != 'buildings_others' && element != 'buildings_gov') {
      queryLayers.push(element);
    }
  });
}
mapBox.switchGovBuildings = function (v) {
  switch (v) {
    case true:
      map.setLayoutProperty('buildings_gov', 'visibility', 'visible');
      break;
    case false:
      map.setLayoutProperty('buildings_gov', 'visibility', 'none');
      break;
    default:
      break;
  }
}

/* -------------------------------- 获取iot所在建筑 ------------------------------- */
mapBox.getIotWithInBuilding = function (lngLat) {
  map.easeTo({
    center: lngLat,
    essential: true,
    rotation: 300,
    zoom: 17,
    pitch: 60,
  });
  let pointScreen = map.project(lngLat);
  //第一种比较简单的，只获取包含该点的建筑
  let queryFeatures = map.queryRenderedFeatures(pointScreen, { layers: ['buildings_gov', 'buildings_others'] });
  if (map.getLayer('IotWithInBuilding')) {
    map.removeLayer('IotWithInBuilding');
    map.removeSource('IotWithInBuilding');
  }
  map.addSource('IotWithInBuilding', {
    "type": "geojson",
    "data": {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": queryFeatures[0].geometry.coordinates
      },
      "properties": {
        "title": "Mapbox DC",
        "marker-symbol": "monument",
        'height': queryFeatures[0].properties.height
      }
    }
  });
  map.addLayer({
    'id': 'IotWithInBuilding',
    'source': 'IotWithInBuilding',
    'layout': { 'visibility': 'visible' },
    'type': 'fill-extrusion',
    'paint': {
      'fill-extrusion-color': '#FF0000',
      'fill-extrusion-height': 1000,
      'fill-extrusion-opacity': 0.4,
    }

  });
  myLayers.push('IotWithInBuilding')
  //第二种比较复杂的，过去该点所围绕框框所包含的所有建筑，求其最大面积者（这样不好，但是代码先放在这里）
  // let bbox = [
  //   [pointScreen.x - 66, pointScreen.y - 66],
  //   [pointScreen.x + 66, pointScreen.y + 66]
  // ];
  // console.log('bbox', bbox)
  // setTimeout(() => {
  //   let queryFeatures = map.queryRenderedFeatures(bbox, { layers: ['buildings_gov', 'buildings_others'] });
  //   console.log(queryFeatures)
  // }, 1000);

}


/* ---------------------------------- GPS设备 ---------------------------------- */
//## 增加车辆
mapBox.addGpsCar = function (url, name, imgUrl) {
  axios.get(url).then(res => {
    if (res.status === 200 && res.data) {
      var data = res.data
      var coordinates = data.features[0].geometry.coordinates;
      if (coordinates[0].length > 0) {
        map.easeTo({
          center: coordinates[0],
          essential: true,
          rotation: 300,
          zoom: 18,
          pitch: 60,
        });
      }
      map.loadImage(
        imgUrl,
        function (error, image) {
          if (error) throw error;
          map.addImage(name + 'Image', image, { pixelRatio: 4 });
          map.addSource(name + 'icon', {
            'type': 'geojson',
            'data': {
              'type': 'FeatureCollection',
              'features': [
                {
                  'type': 'Feature',
                  'geometry': {
                    'type': 'Point',
                    'coordinates': coordinates[0]
                  },
                  'properties': data.features[0].properties
                }
              ]
            }
          });

          map.addLayer({
            'id': name + 'icon',
            'type': 'symbol',
            'source': name + 'icon',
            'layout': {
              'icon-image': name + 'Image',
              'visibility': 'visible',
              'icon-allow-overlap': ["step", ["zoom"], false, 10, true, 24, true],
              'text-allow-overlap': ["step", ["zoom"], false, 10, true, 24, true],
            }

          });
          myLayers.push(name + 'icon');
          queryLayers.push(name + 'icon')
        });
      //##初始化车辆位置
      if (coordinates[0].length > 0) {
        axios.get(url).then(res => {
          if (res.status === 200 && res.data) {
            res.data.features.forEach(element => {
              vehiclesList.push(element.geometry.coordinates[0])
            });
          }
        })
      }

      var i = 0;
      window.setInterval(function () {
        if (map.getSource(name)) {
          map.getSource(name).setData(url);
        }
        if (map.getSource(name + 'icon')) {
          map.getSource(name + 'icon').setData(url);
        }
        //##更新车辆位置
        if (coordinates[0].length > 0) {
          axios.get(url).then(res => {
            if (res.status === 200 && res.data) {
              vehiclesList = [];
              res.data.features.forEach(element => {
                vehiclesList.push(element.geometry.coordinates[0])
              });
            }
          })
        }


      }, 1000);
    }
  })
}


export default mapBox






