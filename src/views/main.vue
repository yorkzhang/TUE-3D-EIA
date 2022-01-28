<template>
  <div class="main">
    <Spin fix v-if="loading" size="large"></Spin>
    <pageTitle />
    <pageMenu />
    <!-- <div
      class="leftTopMenu"
      :style="mapUITop"
      v-if="$store.state.showBasemapSwitch"
      @click="switchBasemap"
    >
      <Icon type="md-map" />
      <div class="tooltip">switch basemap</div>
    </div> -->

    <!-- <Button
      type="primary"
      shape="circle"
      icon="ios-list-box-outline"
      class="showLegendBtn"
      @click="toogleLegend"
    ></Button>
    <Button
      type="primary"
      shape="circle"
      icon="ios-list-box-outline"
      class="showDataInfoBtn"
      :style="{
        left: $store.state.showSubMenu
          ? 160 + 330 + 10 + 'px'
          : 160 + 10 + 'px',
      }"
      v-if="$store.state.speciesMap"
      @click="toogleDataInfo"
    ></Button> -->
    <div class="content">
      
      <div
        class="subMenu"
        v-if="
          $store.state.showSubMenu &&
          $route.path != '/help' &&
          $route.path != '/about' &&
          $route.path != '/feedback'
        "
      >
        <router-view />
      </div>
      
      <div v-else>
        <router-view />
      </div>
      <!--<div
        class="map"
        id="mapBoxContainer"
        :style="{ display: $store.state.showMap ? 'block' : 'none' }"
      ></div>-->
      <div
        id="cesiumContainer"
        class="map"
        :style="{ display: $store.state.showMap ? 'none' : 'block' }"
      ></div>
    </div>
    <!-- <div class="legend" v-show="$store.state.habitatMap && showLegend">
      <div class="legendTitle">Legend</div>
      <Button
        shape="circle"
        icon="md-close"
        size="small"
        class="hiddenLegendBtn"
        @click="toogleLegend"
      ></Button>

      <div
        v-if="$store.state.speciesMap"
        id="dividingLin"
        class="dividingLin"
        style="border-bottom: 1px solid #b2b1b1"
      >
        <h4>Species List</h4>
        <h5>Species of Conservation Importance</h5>
        <div
          class="legentSpcies"
          v-for="(item, key) in speciesOfConservationImportance"
          :key="key"
        >
          <div>{{ key }}</div>
          <div v-if="item.length">
            <div class="subList" v-for="(subItem, index) in item" :key="index">
              <div
                class="categoryImg"
                :style="{ background: '#' + subItem.color }"
              >
                {{ subItem.abbreviati }}{{ subItem.speciesid }}
              </div>
              <span :style="{ color: '#' + subItem.color }">{{
                subItem.species
              }}</span>
            </div>
          </div>
        </div>
      </div>
      <h4>Habitant Map</h4>
      <div class="legendItem" v-for="(item, key) in legends" :key="key">
        <div class="divBlock" :style="{ 'background-color': item }"></div>
        <span>{{ key }}</span>
      </div>
    </div> -->
    
    <!--
    <div class="legend" v-show="this.$store.state.surveyLocationOn || this.$store.state.habitatMapOn || this.$store.state.sitesConservationOn || this.$store.state.assessment500mOn || this.$store.state.ecologySub2and3On || this.$store.state.pDescSub2Point1On || this.$store.state.pDescSub2Point2On || this.$store.state.pDescYear1On || this.$store.state.pDescYear2On || this.$store.state.pDescYear3On || this.$store.state.pDescYear4On || this.$store.state.noiseOn">
    -->
    <div class="legend" v-if="0 || this.$store.state.surveyLocationOn || this.$store.state.habitatMapOn || this.$store.state.sitesConservationOn || this.$store.state.assessment500mOn || this.$store.state.ecologySub2and3On || this.$store.state.pDescSub2Point1On || this.$store.state.pDescSub2Point2On || this.$store.state.pDescYear1On || this.$store.state.pDescYear2On || this.$store.state.pDescYear3On || this.$store.state.pDescYear4On || this.$store.state.noiseOn">
    
      <div class="legendTitle">Legend</div>
      <!-- <Button
        shape="circle"
        icon="md-close"
        size="small"
        class="hiddenLegendBtn"
        @click="toogleLegend"
      ></Button> -->
      <div class="wrapper">
        <div v-for="(item, index) in legendTUE" :key="index" >
          <div v-if="(item.id === '1' && $store.state.surveyLocationOn) || (item.id === '2' && $store.state.habitatMapOn) || (item.id === '3' && $store.state.sitesConservationOn) || (item.id === '4' && $store.state.assessment500mOn) || (item.id === '5a' && $store.state.ecologySub2_1) || (item.id === '5b' && $store.state.ecologySub2_2) || (item.id === '5c' && $store.state.ecologySub2_3) || (item.id === '5d' && $store.state.ecologySub2_4) || (item.id === '5e' && $store.state.ecologySub2_5) || (item.id === '5f' && $store.state.ecologySub2_6) || (item.id === '5g' && $store.state.ecologySub2_7) || (item.id === '5h' && $store.state.ecologySub2_8) || (item.id === '5i' && $store.state.ecologySub2_9) || (item.id === '5j' && $store.state.ecologySub2_10) || (item.id === '5k' && $store.state.ecologySub2_11) || (item.id === '5l' && $store.state.ecologySub2_12) || (item.id === '6' && $store.state.pDescSub2Point1On) || (item.id === '7' && $store.state.pDescSub2Point2On) || (item.id === '7' && $store.state.pDescYear4On) || (item.id === '8' && $store.state.pDescYear1On) || (item.id === '9' && $store.state.pDescYear2On) || (item.id === '10' && $store.state.pDescYear3On) || (item.id === '11' && $store.state.noiseOn)" style='margin-right:10px;'>
            <h4 v-if="(item.id === '1' || item.id === '2' || item.id === '3' || item.id === '4' || item.id === '5a' || item.id === '5b' || item.id === '5c' || item.id === '5d' || item.id === '5e' || item.id === '5f' || item.id === '5g' || item.id === '5h' || item.id === '5i' || item.id === '5j' || item.id === '5k' || item.id === '5l')">{{item.name}}</h4>
            <div class="legendItem" v-for="(subItem, index2) in item.legend" :key="index2">
              <div class="divBlock" :style="{ 'background-color': '#' + subItem.color }" v-if="subItem.type === 'polygon'"></div>
              <div class="divBlock" :style="{ 'background': 'repeating-linear-gradient( 45deg, #' + subItem.color + ', #'  + subItem.color + ' 4px, #FFFFFF 4px, #FFFFFF 7px)' }" v-else-if="subItem.type === 'polygonStripe'"></div>
              <div class="divLineBlock" :style="{ 'background-color': '#' + subItem.color }" v-else-if="subItem.type === 'line'"></div>
              <div class="divLineBlock" :style="{ 'background': 'repeating-linear-gradient( 90deg, #' + subItem.color + ', #'  + subItem.color + ' 4px, #2d3849 4px, #2d3849 7px)' }" v-else-if="subItem.type === 'lineStripe'"></div>
              <div class="divPointBlock" :style="{ 'background-color': '#' + subItem.color }" v-else-if="subItem.type === 'point'"></div>
              <div class="divBlock" :style="{ 'border': '3px solid #' + subItem.color }" v-else-if="subItem.type === 'polygonoutline'"></div>
              <span>{{ subItem.title }}</span>
            </div>
          </div>
        </div>
      </div>
      
      
    </div>
    <div
      class="dataInfo"
      id="dataInfo"
      :style="{
        left: $store.state.speciesUnImportantMap
          ? 160 + 330 + 10 + 'px'
          : 160 + 10 + 'px',
      }"
      v-if="$store.state.speciesUnImportantMap && showDataInfo"
    >
      <div class="legendTitle">List of Flora and Fauna Species</div>
      <Button
        shape="circle"
        icon="md-close"
        size="small"
        class="hiddenLegendBtn"
        @click="toogleDataInfo"
      ></Button>

      <div class="dividingLin">
        <div
          class="legentSpcies"
          v-for="(item, key) in speciesOfConservationUnImportance"
          :key="key"
        >
          <div>{{ key }}</div>
          <div v-if="item.length">
            <div class="subList" v-for="(subItem, index) in item" :key="index">
              <!-- <div
                class="categoryImg"
                :style="{ background: '#' + subItem.color }"
              >
                {{ subItem.abbreviati }}{{ subItem.speciesid }}
              </div> -->
              <span :style="{ color: '#' + subItem.color }">{{
                subItem.species
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div id="itemDetail">
    </div>
    <div id="itemDetail2">
    </div>
    <!-- <div id="arupLogo">
     <img src="img/Arup_logo_red.png" width="150px" />
    </div> -->
    <div class="disclaimerBG" style="width:620px; height:430px;" v-if="desclaimerAccepted == false">
      <div class="disclaimerBox" style="width:620px; height:430px;">
        <br />
        <h2><u>Disclaimer</u></h2>
        <br />
        <ol type="1">
          <li style="text-align: justify;">The information provided on this website is for reference only. Please refer to the Environmental Impact Assessment (EIA) Report for more details, assumptions and assessment results.</li>
          <li style="text-align: justify;">The information and content of this website is provided ‘as is’ and users shall rely on it as their own risk. No commercial use of the content is permitted. To the fullest extent permitted by law, we exclude any and all liability to users for their use or reliance on the content of this website.</li>
        </ol>
        <br />
        <div class="buttonDescLeft" @click="AcceptDesclaimer">Accept</div>
        <div class="buttonDescRight" @click="DeclineDesclaimer">Decline</div>
        <br />
      </div>
    </div>
  </div>
</template>

<script>
import pageTitle from "@/components/pageTitle.vue";
import pageMenu from "@/components/pageMenu.vue";
import MapBox from "@/libs/myMapBox.js";
import "@/style/mapbox-gl-draw.css";
import MapCasium from "@/libs/myCesium.js";
import habitatMapLendJson from "@/config/landuseColorRename.json";
import speciesCategoryConfigJson from "@/config/speciesCategoryConfig.json";
import legendTUEJson from "@/config/legendTUE.json";
export default {
  data() {
    return {
      legends: habitatMapLendJson,
      showLegend: true,
      showDataInfo: true,
      speciesCategoryConfigJson: speciesCategoryConfigJson,
      legendTUE: legendTUEJson,
      desclaimerAccepted: false
    };
  },
  computed: {
    loading() {
      return this.$store.state.loading;
    },
    speciesOfConservationImportance() {
      let tempObj = {};
      let arrs = this.$store.getters.getSpeciesData;
      arrs.map((item) => {
        if (!tempObj[item.category]) {
          tempObj[item.category] = [];
        }
        if (item.important == "1") tempObj[item.category].push(item);
      });
      return tempObj;
    },
    speciesOfConservationUnImportance() {
      let tempObj = {};
      let arrs = this.$store.getters.getSpeciesUnImportantData;
      arrs.map((item) => {
        if (!tempObj[item.category]) {
          tempObj[item.category] = [];
        }
        tempObj[item.category].push(item);
      });
      return tempObj;
    },
    mapUITop() {
      console.log(typeof this.$store.state.mapDrawToolsShow);
      let top = this.$store.state.mapDrawToolsShow ? 284 : 187;
      return { top: top + "px" };
    },
  },
  watch: {
    "$route.path"(newPath) {
      let path = newPath.substring(1);
      //MapBox.switchMenue(path);
    },
  },
  methods: {
    init() {
      this.$store.commit("updateShowSubMenu", true);
      this.$store.commit("updateShowBasemapSwitch", true);
      this.checkUser();
      //MapBox.init();
      MapCasium.initCesium();
    },
    checkUser() {
      if (!this.$store.state.username) {
        this.$store.commit(
          "updateUserName",
          sessionStorage.getItem("username")
        );
      }
    },
    drawPolygon() {
      MapBox.getHabitatMap();
    },
    editPolygon() {
      MapBox.editPolygon();
    },
    toogleLegend() {
      console.log("toggleLegend");
      this.showLegend = !this.showLegend;
    },
    switchBasemap() {
      MapBox.switchBasemap();
    },
    toogleDataInfo() {
      this.showDataInfo = !this.showDataInfo;
    },
    AcceptDesclaimer()
    {
      //alert("accept");
      this.desclaimerAccepted = true;
    },
    DeclineDesclaimer()
    {
      //alert("decline");
      window.location.replace("https://www.epd.gov.hk/eia/english/alpha/aspd_766.html");
    }
  },
  components: { pageTitle, pageMenu },
  mounted() {
    this.init();
  },
};
</script>

<style lang='less'>
.main {
  position: relative;
  .content {
    position: absolute;
    top: 60px;
    left: 160px;
  }
  .subMenu {
    padding: 20px 0;
  }
  .map {
    position: absolute;
    top: 0;
    left: 0;
    width: calc(~"100vw - 160px");
    height: calc(~"100vh - 50px");
  }
  .legend,
  .dataInfo {
    position: absolute;
    bottom: 10px;
    left: 500px;
    padding: 10px;
    z-index: 2;
    background: #2d3849;
    text-align: left;
    border-radius: 10px;
    .wrapper {
      max-height:200px;
      overflow-y: auto;
    }
    .legendTitle {
      font-size: 13px;
      border-bottom: 1px solid #9498af;
      padding-bottom: 6px;
      margin-bottom: 10px;
    }
    .hiddenLegendBtn {
      position: absolute;
      right: 20px;
      top: 10px;
      z-index: 1;
    }
    .dividingLin {
      border-bottom: 1px solid #b2b1b1;
      margin: 10px 0;
      max-height: 700px;
      overflow-y: auto;
    }
    h3 {
      border-bottom: 1px solid #3d4857;
      margin-bottom: 10px;
      padding-bottom: 10px;
    }
    .legentSpcies {
      margin: 10px 0;
      .subList {
        padding: 1px 20px;
        // line-height: 30px;
        .categoryImg {
          display: inline-block;
          width: 30px;
          height: 30px;
          font-size: 12px;
          border-radius: 50%;
          line-height: 24px;
          text-align: center;
          border: 3px solid #000;
          margin-right: 10px;
          color: #000;
          vertical-align: middle;
        }
      }
    }
    .legendItem {
      display: flex;
      align-items: center;
      .divBlock {
        display: inline-block;
        width: 10px;
        height: 10px;
        margin-right: 10px;
      }
      .divLineBlock {
        display: inline-block;
        width: 10px;
        height: 3px;
        margin-right: 10px;
      }
      .divPointBlock {
        display: inline-block;
        width: 10px;
        height: 10px;
        margin-right: 10px;
        border-radius: 50%;
      }
    }
  }
  .dataInfo {
    bottom: 20px;
    padding: 10px;
    width: 250px;
    .dividingLin {
      border: none;
    }
  }
  .leftTopMenu {
    position: absolute;
    width: 30px;
    height: 30px;
    line-height: 22px;
    right: 9px;
    z-index: 1;
    color: #000;
    background-color: white;
    border-radius: 4px;
    padding: 4px;
    border: 1px solid #ddd;
    &:hover {
      cursor: pointer;
      background-color: #f0f0f0;
      .tooltip {
        display: block;
      }
    }
    .tooltip {
      position: absolute;
      right: 0;
      bottom: -4px;
      width: 120px;
      height: 25px;
      top: 34px;
      background: #fff;
      border: 1px solid #000;
      display: none;
    }
    .ivu-tooltip-inner {
      color: #000;
      background-color: #fff;
      border: 1px solid #000;
    }
    .ivu-tooltip-arrow {
      border-bottom-color: #fff;
    }
  }
  .showLegendBtn {
    position: absolute;
    right: 20px;
    bottom: 60px;
    z-index: 1;
  }
  .showDataInfoBtn {
    position: absolute;
    bottom: 20px;
    z-index: 1;
  }
  .ivu-icon-md-map {
    color: #000;
  }
  .ivu-btn-primary {
    color: #fff;
    background-color: #444966;
    border-color: #444966;
  }
  .disclaimerBG {
    background-color: rgba(255,255,255,0);
    display: box;
    position: fixed;
    z-index:  5;
    top: 0px;
    left: 0px;
    width: calc(~"100vw");
    height: calc(~"100vh");
    .disclaimerBox {
      background-color: rgba(255,255,255,0.5);
      display: box;
      position: fixed;
      top: 50%;
      left: 50%;
      -webkit-transform: translate(-50%,-50%);
      transform: translate(-50%,-50%);
      color: black;
      width: 600px;
      height: 370px;
      border-radius: 20px;
      font-size: 20px;
      padding-left: 50px;
      padding-right: 20px;
      .buttonDescLeft {
        float: left;
        width: 100px;
        height: 30px;
        line-height: 30px;
        background-color: rgb(130,130,130);
        vertical-align: middle;
        cursor: pointer;
      }
      .buttonDescRight {
        float: right;
        width: 100px;
        height: 30px;
        line-height: 30px;
        background-color: rgb(130,130,130);
        vertical-align: middle;
        cursor: pointer;
      }
    }
  }
  #arupLogo {
    position: absolute;
    right: 20px;
    bottom : 10px;
    img {
      opacity: 0.5;
    }
  }
}
@media (max-width: 1200px) {
  .legend,
  .dataInfo {
    max-height: 300px;
    overflow-y: auto;
  }
}
.itemDetail{
  position: absolute;
  top: 100px;
  right: 20px;
  width: 500px;
  height: 315px;
  background-color: #2d3849;
  border-radius: 10px;
  font-size: 12px;
  .itemTitle {
    display: block;
    background-color: #506382;
    font-size: 18px;
    font-weight:bold;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
  }
  .itemClose {
    position: absolute;
    top: 0;
    right: 10px;
    width: 30px;
    height: 30px;
    font-size: 15px;
    font-weight:bold;
    vertical-align: middle;
    padding-top: 5px;
    cursor: pointer;
  }
  .tg1 {
    margin: 10px;
    border-collapse:collapse;
    border-spacing:0;        
    font-weight:bold;
    td {
      border-color:#ffffff;
      border-style:solid;
      border-width:1px;
    }
    .colMonthWidth {
      width:40px
    }
    .titleBg {
      background-color:#506382;
    }
    .alignLeft{
      text-align: left;
    }
    .altRowBg1 {
      background-color:#7d90af;
    }
    .altRowBg2 {
      background-color:#cdd5e1;
    }
    .darkFont {
      color: #2D3849;
    }
  }
}

.itemDetail2{
  position: absolute;
  top: 100px;
  right: 20px;
  width: 500px;
  background-color: #2d3849;
  border-radius: 10px;
  font-size: 15px;
  .itemTitle {
    display: block;
    background-color: #506382;
    font-size: 15px;
    font-weight:bold;
    padding-top: 5px;
    padding-bottom: 2px;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
  }
  .itemClose {
    position: absolute;
    top: 0;
    right: 10px;
    width: 30px;
    height: 30px;
    font-size: 15px;
    font-weight:bold;
    vertical-align: middle;
    padding-top: 5px;
    cursor: pointer;
  }
  .content {
    margin-left: 50px;
    margin-top: 10px;
    margin-right: 10px;
    margin-bottom: 15px;
    text-align: justify;
  }
}

.itemDetail3 {
  position: absolute;
  bottom: 20px;
  right: 50px;
  width: 500px;
  background-color: #2d3849;
  border-radius: 10px;
  font-size: 15px;
  .itemTitle {
    display: block;
    background-color: #506382;
    font-size: 20px;
    font-weight:bold;
    padding-top: 5px;
    padding-bottom: 2px;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
  }
  .itemClose {
    position: absolute;
    top: 0;
    right: 10px;
    width: 30px;
    height: 30px;
    font-size: 15px;
    font-weight:bold;
    vertical-align: middle;
    padding-top: 5px;
    cursor: pointer;
  }
  .content {
    margin-left: 50px;
    margin-top: 10px;
    margin-right: 10px;
    margin-bottom: 15px;
    text-align: justify;
  }
  li{
    list-style-image: url(../assets/thumbicon.png);
    padding-left: 10px;
    span {
      display: inline-block;
      vertical-align: middle;
      padding-bottom: 10px;
    }
  }
}

@media(max-width:768px){
  .main {
    .subMenu {
      padding: 10px 0;
    }
    .content {
      left: 0!important;
      width: 100vw!important;  
    }
    .map {
      width: 100vw;
    }
  }
}

</style>