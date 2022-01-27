<template>
  <!-- <div class="subDetail">The function is not open yet</div> -->
  <div class="subDetail">  
    <div class="subDetailContent" style="height: calc(100vh - 270px);"> 
      <div class="submenuTooltip" @click="closeSubMenu()"></div>
      <div class="subItem" :style="lightColor">
        <div class="subTitle marginBottom10" @click="openSub1" style="cursor: pointer;">Ecological Baseline & Survey Infomation</div>
        <div v-if="sub1Open">
          <hr/>
          <div  @click="switchLayer(5)" style="cursor: pointer;">
          <span class="switchIcon" v-if="layer6Visibility"><img src="img/button_on_30.png" height="10px"/></span>
          <span class="switchIcon" v-else><img src="img/button_off_30.png" height="10px"/></span>500m Assessment Area <!-- {{ ecologySub1Layer1 }} -->
          </div>
          <!-- <div  @click="switchLayer(0)" style="cursor: pointer;">
          <span class="switchIcon" v-if="layer1Visibility"><Icon type="ios-eye-outline" /></span>
          <span class="switchIcon" v-else><Icon type="ios-eye-off-outline" /></span>Survey Locations 
          </div> -->
          <div  @click="switchLayer(1)" style="cursor: pointer;">
          <span class="switchIcon" v-if="layer2Visibility"><img src="img/button_on_30.png" height="10px"/></span>
          <span class="switchIcon" v-else><img src="img/button_off_30.png" height="10px"/></span>Survey Programme <!-- {{ ecologySub1Layer }} -->
          </div>
          <div  @click="switchLayer(2)" style="cursor: pointer;">
          <span class="switchIcon" v-if="layer3Visibility"><img src="img/button_on_30.png" height="10px"/></span>
          <span class="switchIcon" v-else><img src="img/button_off_30.png" height="10px"/></span>Habitat Map  <!-- {{ layer1Visibility }} - {{ layer2Visibility }} - {{ layer3Visibility }} - {{ layer4Visibility }} - {{ layer5Visibility }} -->
          </div>
          <div  @click="switchLayer(3)" style="cursor: pointer;">
          <span class="switchIcon" v-if="layer4Visibility"><img src="img/button_on_30.png" height="10px"/></span>
          <span class="switchIcon" v-else><img src="img/button_off_30.png" height="10px"/></span>Sites of Conservation Importance  <!-- {{ layerVisibility }} -->
          </div>
          <!--<div  @click="switchLayer(4)" style="cursor: pointer;">
          <span class="switchIcon" v-if="layer5Visibility"><Icon type="ios-eye-outline" /></span>
          <span class="switchIcon" v-else><Icon type="ios-eye-off-outline" /></span>Species of Conservation Importance  
          </div> -->

          
        </div>
        <!--
        <Button
          icon="ios-basketball"
          long
          class="marginBottom10"
          @click="SwitchHabitatEntity"
        >
          Turn on/off habitat
        </Button>
        <Slider
          v-model="mapOpacity"
          :step="0.1"
          :max="1"
          :min="0"
          @on-input="changeMapOpacity"
        ></Slider>
        -->
      </div>
      <div class="subItem" @click.self="openSub2" :style="lightColor"  style="cursor: pointer;">
        <div class="subTitle marginBottom10" @click="openSub2">Avoidance, Minimisation & Mitigation Measures</div>
        <div v-if="sub2Open">
          <hr/>    
          <div class="sub2window">
            <div class="clickablePoint" @click="openDetail(2,1)" :style="darkColor">
              <span>1. Avoidance of Marine Works</span>
            </div>
            <div class="clickablePoint" @click="openDetail(2,2)" :style="darkColor">
              <span>2. Avoidance of Works within / Direct Impact upon Tung Chung River and its Estuary, and Tai Ho Wan</span>
            </div>
            <div class="clickablePoint" @click="openDetail(2,3)" :style="darkColor">
              <span>3. Avoidance of Works within Intertidal Zone</span>
            </div>
            <div class="clickablePoint" @click="openDetail(2,4)" :style="darkColor">
              <span>4. Avoidance of Works within Country Parks, Site of Special Scientific Interest (SSSI), Conservation Area (CA) and Costal Protection Area (CPA)</span>
            </div>
            <div class="clickablePoint" @click="openDetail(2,5)" :style="darkColor">
              <span>5. Avoidance of Works within Secondary Woodland</span>
            </div>
            <div class="clickablePoint" @click="openDetail(2,6)" :style="darkColor">
              <span>6. Avoidance of Re-diversion of Wong Lung Hang Nullah</span>
            </div>
            <div class="clickablePoint" @click="openDetail(2,12)" :style="darkColor">
              <span>7. Avoidance of Flora of Conservation Importance by Protection Zone</span>
            </div>
            <div class="clickablePoint" @click="openDetail(2,7)" :style="darkColor">
              <span>8. Minimisation of Surface Runoff and Provision of Necessary Treatment Facilities</span>
            </div>
            <div class="clickablePoint" @click="openDetail(2,8)" :style="darkColor">
              <span>9. Minimisation of Noise Disturbance during Construction</span>
            </div>
            <div class="clickablePoint" @click="openDetail(2,9)" :style="darkColor">
              <span>10. Minimisation of Air Quality Impacts during Construction</span>
            </div>
            <div class="clickablePoint" @click="openDetail(2,10)" :style="darkColor">
              <span>11. Minimisation of Human Disturbance during Construction</span>
            </div>
            <!-- <div class="clickablePoint" @click="openDetail(2,11)" :style="darkColor">
              <span>11. Minimisation of Potential Off-site Habitat Degradation</span>
            </div> -->
          </div>
        </div>
      </div>
      <div class="subItem" @click.self="openSub3" :style="lightColor" style="cursor: pointer;">
        <div class="subTitle marginBottom10" @click="openSub3">Ecological Outcome</div>
        <div v-if="sub3Open">
          <hr/>
          <div class="clickablePoint" @click="openDetail(3,1)" :style="darkColor">
            <span style="margin: auto; display:table;">Tung Chung East</span>
          </div>
          <div class="clickablePoint" @click="openDetail(3,2)" :style="darkColor">
            <span style="margin: auto; display:table;">Tung Chung West</span>
          </div>

          
        </div>
      </div>
      <!--
      <div class="subItem">
        <div class="subTitle marginBottom10">3D Building</div>
        <Button
          icon="ios-contrast"
          long
          class="marginBottom10"
          @click="switchBuildingsShow"
        >
          Turn on/off buildings
        </Button>
        <br />
        <br />
        <Button
          icon="ios-contrast"
          long
          class="marginBottom10"
          @click="swithchBuildingstransparency"
        >
          Turn on/off transparent buildings
        </Button>
      </div>-->
    </div>
     <div class="subNotification" align="justify" style="height: 300px; font-size:100%;" >
            Note: <br>
            •The information provided on this website is for reference only. Please refer to the Environmental Impact Assesssment (EIA) Report for more details, assumptions and assessment results.<br>
            •The transparent buildings illustrated are planned developments which are indicative only and subject to change.
     </div>
    
  </div>
</template>

<script>
//import x from ''
import myCesium from "@/libs/myCesium.js";
import subMenuDetailJSON from "@/config/submenuDetails.json";
export default {
  data() {
    return {
      mapOpacity: 1,
      turnOffEntity: true,
      sub1Open: true,
      sub2Open: false,
      sub3Open: false,
      layerVisibility: this.$store.state.ecologySub1Layer,
      layer1Visibility: this.$store.state.ecologySub1Layer[0],
      layer2Visibility: this.$store.state.ecologySub1Layer[1],
      layer3Visibility: this.$store.state.ecologySub1Layer[2],
      layer4Visibility: this.$store.state.ecologySub1Layer[3],
      layer5Visibility: this.$store.state.ecologySub1Layer[4],
      layer6Visibility: this.$store.state.ecologySub1Layer[5],
      subMenuDetails: subMenuDetailJSON,
      lightColor: "background-color: #3AC691",
      darkColor: "background-color: #2C986F"
    };
  },
  computed: {
    ecologySub1Layer() {
      let arrs = this.$store.getters.getEcologySub1LayerVisibility;
      return arrs
    },
    ecologySub1Layer1() {
      return this.$store.state.ecologySub1Layer[0]
    },
    ecologySub1Layer2() {
      return this.$store.state.ecologySub1Layer[1]
    },
    ecologySub1Layer3() {
      return this.$store.state.ecologySub1Layer[2]
    },
    ecologySub1Layer4() {
      return this.$store.state.ecologySub1Layer[3]
    },
    ecologySub1Layer5() {
      return this.$store.state.ecologySub1Layer[4]
    },
  },
  props: {},
  created() {
    window.switchLayer =this.switchLayer;
    window.openDetail = this.openDetail;
  },

  methods: {
    init() {
      //this.$store.commit("updateShowSubMenu", true);
      this.$store.commit("updateShowBasemapSwitch", false);
      this.$store.commit("updateEcologySub2Point", 1);
      this.$store.commit("updateEcologySub3Point", 1);
      // this.$store.commit("updateSpeciesUnImportantStatus", false);
      // speciesUnImportantMap
      // this.$store.commit("updateSpeciesStatus", false);
      // speciesMap
      // 修复不显示物种
      let dividingLin = document.getElementById("dividingLin");
      let dataInfo = document.getElementById("dataInfo");
      if (dividingLin) {
        dividingLin.style.display = "none";
      }
      if (dataInfo) {
        dataInfo.style.display = "none";
      }
      myVue.$on("switch_layer_sub1", this.switchLayer);
      myVue.$on("close_detail", this.openDetail);
    },
    closeSubMenu() {
      this.$store.commit("updateShowSubMenu", false);
    },
    SwitchHabitatEntity() {
      if (this.turnOffEntity) {
        myCesium.turnOffEntity(this.turnOffEntity);
        this.turnOffEntity = false;
      } else {
        myCesium.turnOffEntity(this.turnOffEntity);
        this.turnOffEntity = true;
      }
    },
    switchBuildingsShow() {
      myCesium.switch3dTileShow();
    },
    swithchBuildingstransparency() {
      myCesium.change3dTilesTransparency();
    },
    goMapping() {
      this.$router.push("mapping");
    },
    changeMapOpacity(opacity) {
      myCesium.switchEntityTransparency(opacity);
    },
    openSub1() {
      if(this.sub1Open) {
        this.sub1Open = false
      }else {
        this.sub1Open = true
        this.sub2Open = false
        this.sub3Open = false
      }
      // do opening / closing according to subopen
    },
    openSub2() {
      if(this.sub2Open) {
        this.sub2Open = false
      }else {
        this.sub1Open = false
        this.sub2Open = true
        this.sub3Open = false
      }
    },
    openSub3() {
      if(this.sub3Open) {
        this.sub3Open = false
      }else {
        this.sub1Open = false
        this.sub2Open = false
        this.sub3Open = true
      }
    },
    switchLayer(layerNo) {
      //var arrNo = layerNo - 1
      var currentValue = this.$store.state.ecologySub1Layer[layerNo]
      this.$store.commit("updateEcologySub1LayerValue", { 'arrIndex': layerNo, 'value' : !currentValue } )
      this.layerVisibility = this.$store.state.ecologySub1Layer
      this.turnOffSubMenu2Layers();
      this.turnOffPDescriptionLayers();
      this.turnOffNoiseLayers();
      //console.log("updateEcologySub2and3On should be false", this.$store.state.ecologySub2and3On);
      switch(layerNo) {
        case 0:
          this.layer1Visibility = !currentValue
          this.$store.commit('updateSurveyLocationOn', !currentValue)
          myCesium.switchLayer("sub1point1");
          myCesium.moveMap();
          break;
        case 1:
          this.layer2Visibility = !currentValue;
          //this.$store.commit('updateEcologySub2and3On', !currentValue);
          this.openDetail(1,2);
          break;
        case 2:
          this.layer3Visibility = !currentValue
          this.$store.commit('updateHabitatMapOn', !currentValue)
          //this.$store.commit('updateEcologySub2and3On', true)
          myCesium.switchLayer("sub1point3");
          myCesium.moveMap();
          break;
        case 3:
          this.layer4Visibility = !currentValue
          this.$store.commit('updateSitesConservationOn', !currentValue)
          myCesium.switchLayer("sub1point4");
          myCesium.moveMap();
          break;
        case 4:
          this.layer5Visibility = !currentValue
          myCesium.switchLayer("sub1point5");
          myCesium.moveMap();
          break;
        case 5:
          this.layer6Visibility = !currentValue
          this.$store.commit('updateAssessment500mOn', !currentValue)
          myCesium.switchLayer("sub1point6");
          myCesium.moveMap();
          break;
      }
      this.$store.commit('updateEcologySub1Layer', [this.layer1Visibility,this.layer2Visibility,this.layer3Visibility,this.layer4Visibility,this.layer5Visibility,this.layer6Visibility])
      //alert(this.$store.state.ecologySub1Layer[0])
    },
    turnOffSubMenu1Layers() {
      this.$store.commit("updateEcologySub1LayerValue", { 'arrIndex': 0, 'value' : false } );
      this.$store.commit("updateEcologySub1LayerValue", { 'arrIndex': 1, 'value' : false } );
      this.$store.commit("updateEcologySub1LayerValue", { 'arrIndex': 2, 'value' : false } );
      this.$store.commit("updateEcologySub1LayerValue", { 'arrIndex': 3, 'value' : false } );
      this.$store.commit("updateEcologySub1LayerValue", { 'arrIndex': 4, 'value' : false } );
      this.layer1Visibility = false;
      this.$store.commit('updateSurveyLocationOn', false);
      myCesium.switchLayerOff("sub1point1");
      this.layer2Visibility = false;
      this.layer3Visibility = false;
      this.$store.commit('updateHabitatMapOn', false);
      myCesium.switchLayerOff("sub1point3");
      this.layer4Visibility = false;
      this.$store.commit('updateSitesConservationOn', false);
      myCesium.switchLayerOff("sub1point4");
      this.layer5Visibility = false;
      myCesium.switchLayerOff("sub1point5");
      this.layer6Visibility = false;
      this.$store.commit('updateAssessment500mOn', false);
      myCesium.switchLayerOff("sub1point6");
    },
    turnOffSubMenu2Layers() {
      myCesium.switchLayerOff("sub2point1");
      myCesium.switchLayerOff("sub2point2");
      myCesium.switchLayerOff("sub2point3");
      myCesium.switchLayerOff("sub2point12");
      myCesium.switchLayerOff("sub2");
      myCesium.switchLayerOff("sub2tungchungriver");
      myCesium.switchLayerOff("sub2taihowan");
      myCesium.switchLayerOff("sub2wlhnullah");
      myCesium.switchLayerOff("sub2cp");
      this.$store.commit('updateEcologySub2and3On', false);
      this.$store.commit('updateEcologySub2_1', false);
      this.$store.commit('updateEcologySub2_2', false);
      this.$store.commit('updateEcologySub2_3', false);
      this.$store.commit('updateEcologySub2_4', false);
      this.$store.commit('updateEcologySub2_5', false);
      this.$store.commit('updateEcologySub2_6', false);
      this.$store.commit('updateEcologySub2_7', false);
      this.$store.commit('updateEcologySub2_8', false);
      this.$store.commit('updateEcologySub2_9', false);
      this.$store.commit('updateEcologySub2_10', false);
      this.$store.commit('updateEcologySub2_11', false);
      this.$store.commit('updateEcologySub2_12', false);
      //console.log("updateEcologySub2and3On should be false", this.$store.state.ecologySub2and3On);
      var itemDetailDiv = document.getElementById("itemDetail");
      var itemDetail2Div = document.getElementById("itemDetail2");
      //clearing the content
      while (itemDetailDiv.firstChild) {
        itemDetailDiv.removeChild(itemDetailDiv.lastChild);
      }
      while (itemDetail2Div.firstChild) {
        itemDetail2Div.removeChild(itemDetail2Div.lastChild);
      }
    },
    openDetail(subNo,pointNo)
    {
      //alert("Opening sub " + subNo + " point no " + pointNo)
      var currentKey = subNo.toString() +"-"+ pointNo.toString();
      console.log(currentKey);
      var itemDetailDiv = document.getElementById("itemDetail");
      var itemDetail2Div = document.getElementById("itemDetail2");

      //clearing the content
      while (itemDetailDiv.firstChild) {
        itemDetailDiv.removeChild(itemDetailDiv.lastChild);
      }
      while (itemDetail2Div.firstChild) {
        itemDetail2Div.removeChild(itemDetail2Div.lastChild);
      }
      this.turnOffSubMenu2Layers();
      this.turnOffPDescriptionLayers();
      this.turnOffNoiseLayers();
      if(currentKey == "3-1" || currentKey == "3-2")
      {
        myCesium.switchLayerOn("sub3");
      }
      else if (currentKey != "1-2")
      {
        myCesium.switchLayerOn("sub2");
        
      }      
      //console.log("updateEcologySub2and3On should be true", this.$store.state.ecologySub2and3On);
      if(currentKey === "2-1" ||currentKey === "2-2" ||currentKey === "2-3" ||currentKey === "2-6") {
        myCesium.switchLayerOn("sub2point1");
      }
      else if(currentKey === "2-5")
      {
        myCesium.switchLayerOn("sub2point2");
      }
      else if(currentKey === "2-8")
      {
        myCesium.switchLayerOn("sub2point3");
      }
      else if(currentKey === "2-12")
      {
        myCesium.switchLayerOn("sub2point12");
      }

      if(currentKey === "2-1" ||currentKey === "2-2" ||currentKey === "2-7" ||currentKey === "2-8" ||currentKey === "2-10") {
        myCesium.switchLayerOn("sub2tungchungriver");
      }      
      if(currentKey === "2-2")
      {
        myCesium.switchLayerOn("sub2taihowan");
      }
      if(currentKey === "2-4")
      {
        myCesium.switchLayerOn("sub2cp");
      }
      if(currentKey === "2-3" || currentKey === "2-6" ||currentKey === "2-7" ||currentKey === "2-8" ||currentKey === "2-10") {
        myCesium.switchLayerOn("sub2wlhnullah");
      }

      //zoom to certain area
      if(currentKey === "2-1")
      {
        myCesium.zoomSub2Point1();
      }
      else if(currentKey === "2-2")
      {
        myCesium.zoomSub2Point2();
      }
      else if(currentKey === "2-3")
      {
        myCesium.zoomSub2Point3();
      }
      else if(currentKey === "2-4")
      {
        myCesium.zoomSub2Point4();
      }
      else if(currentKey === "2-5")
      {
        myCesium.zoomSub2Point5();
      }
      else if(currentKey === "2-6")
      {
        myCesium.zoomSub2Point6();
      }
      else if(currentKey === "2-7")
      {
        myCesium.zoomSub2Point7();
      }
      else if(currentKey === "2-8")
      {
        myCesium.zoomSub2Point8();
      }
      else if(currentKey === "2-9")
      {
        myCesium.zoomSub2Point9();
      }
      else if(currentKey === "2-10")
      {
        myCesium.zoomSub2Point10();
      }
      else if(currentKey === "2-11")
      {
        myCesium.zoomSub2Point11();
      }
      else if(currentKey === "2-12")
      {
        myCesium.zoomSub2Point12();
      }
      else if(currentKey === "3-1")
      {
        myCesium.zoomSub3Point1();
      }
      else if(currentKey === "3-2")
      {
        myCesium.zoomSub3Point2();
      }

      switch(currentKey) {
        case "1-2":
          
          if(this.layer2Visibility)
          {
            var divWrapper = document.createElement("div");
            divWrapper.id = "contentWrapper";
            divWrapper.className = "itemDetail";
            itemDetailDiv.appendChild(divWrapper);

            //title
            var divTitle = document.createElement("div");
            divTitle.id = "itemTitle";
            divTitle.innerHTML = "Survey Programme";
            divTitle.className = "itemTitle";
            divWrapper.appendChild(divTitle);

            //X - Close
            var divXClose = document.createElement("div");
            divXClose.id="itemClose";
            divXClose.innerHTML = "X";
            divXClose.className = "itemClose";
            divXClose.onclick = function() {
              myVue.$emit('switch_layer_sub1',1);
            };
            divWrapper.appendChild(divXClose);

            //content
            var divTable = document.createElement("table");
            divTable.className = "tg1";
            divWrapper.appendChild(divTable);

            var divTHead = document.createElement("thead");
            var divtr1 = document.createElement("tr");
            var divtdLine1 = document.createElement("td");
            divtdLine1.rowSpan = "2";
            divtdLine1.className = "titleBg alignLeft";
            divtdLine1.innerHTML = "Survey Type";
            var divtdLine2 = document.createElement("td");
            divtdLine2.colSpan = "3";
            divtdLine2.className = "titleBg";
            divtdLine2.innerHTML = "2020";
            var divtdLine3 = document.createElement("td");
            divtdLine3.colSpan = "4";
            divtdLine3.className = "titleBg";
            divtdLine3.innerHTML = "2021";
            divtr1.appendChild(divtdLine1);
            divtr1.appendChild(divtdLine2);
            divtr1.appendChild(divtdLine3);
            var divtr2 = document.createElement("tr");
            var divtdCol1 = document.createElement("td");
            divtdCol1.className = "colMonthWidth altRowBg1";
            divtdCol1.innerHTML = "Aug";
            var divtdCol2 = document.createElement("td");
            divtdCol2.className = "colMonthWidth altRowBg1";
            divtdCol2.innerHTML = "Sep";
            var divtdCol3 = document.createElement("td");
            divtdCol3.className = "colMonthWidth altRowBg1";
            divtdCol3.innerHTML = "Oct";
            var divtdCol4 = document.createElement("td");
            divtdCol4.className = "colMonthWidth altRowBg1";
            divtdCol4.innerHTML = "Apr";
            var divtdCol5 = document.createElement("td");
            divtdCol5.className = "colMonthWidth altRowBg1";
            divtdCol5.innerHTML = "May";
            var divtdCol6 = document.createElement("td");
            divtdCol6.className = "colMonthWidth altRowBg1";
            divtdCol6.innerHTML = "Jun";
            var divtdCol7 = document.createElement("td");
            divtdCol7.className = "colMonthWidth altRowBg1";
            divtdCol7.innerHTML = "Jul";
            divtr2.appendChild(divtdCol1);
            divtr2.appendChild(divtdCol2);
            divtr2.appendChild(divtdCol3);
            divtr2.appendChild(divtdCol4);
            divtr2.appendChild(divtdCol5);
            divtr2.appendChild(divtdCol6);
            divtr2.appendChild(divtdCol7);
            divTHead.appendChild(divtr1);
            divTHead.appendChild(divtr2);
            divTable.appendChild(divTHead);

            var divTBody = document.createElement("tbody");
            var divtr3 = document.createElement("tr");
            divtdCol1 = document.createElement("td");
            divtdCol1.className = "titleBg alignLeft";
            divtdCol1.innerHTML = "Habitat mapping &amp; vegetation";
            divtdCol2 = document.createElement("td");
            divtdCol2.className = "altRowBg2 darkFont";
            divtdCol2.innerHTML = "✔";
            divtdCol3 = document.createElement("td");
            divtdCol3.className = "altRowBg2 darkFont";
            divtdCol3.innerHTML = "";
            divtdCol4 = document.createElement("td");
            divtdCol4.className = "altRowBg2 darkFont";
            divtdCol4.innerHTML = "";
            divtdCol5 = document.createElement("td");
            divtdCol5.className = "altRowBg2 darkFont";
            divtdCol5.innerHTML = "✔";
            divtdCol6 = document.createElement("td");
            divtdCol6.className = "altRowBg2 darkFont";
            divtdCol6.innerHTML = "";
            divtdCol7 = document.createElement("td");
            divtdCol7.className = "altRowBg2 darkFont";
            divtdCol7.innerHTML = "";
            var divtdCol8 = document.createElement("td");
            divtdCol8.className = "altRowBg2 darkFont";
            divtdCol8.innerHTML = "";
            divtr3.appendChild(divtdCol1);
            divtr3.appendChild(divtdCol2);
            divtr3.appendChild(divtdCol3);
            divtr3.appendChild(divtdCol4);
            divtr3.appendChild(divtdCol5);
            divtr3.appendChild(divtdCol6);
            divtr3.appendChild(divtdCol7);
            divtr3.appendChild(divtdCol8);
            divTBody.appendChild(divtr3);

            var divtr4 = document.createElement("tr");
            divtdCol1 = document.createElement("td");
            divtdCol1.className = "titleBg alignLeft";
            divtdCol1.innerHTML = "Avifauna (Bird)";
            divtdCol2 = document.createElement("td");
            divtdCol2.className = "altRowBg1 darkFont";
            divtdCol2.innerHTML = "✔";
            divtdCol3 = document.createElement("td");
            divtdCol3.className = "altRowBg1 darkFont";
            divtdCol3.innerHTML = "✔";
            divtdCol4 = document.createElement("td");
            divtdCol4.className = "altRowBg1 darkFont";
            divtdCol4.innerHTML = "✔";
            divtdCol5 = document.createElement("td");
            divtdCol5.className = "altRowBg1 darkFont";
            divtdCol5.innerHTML = "✔";
            divtdCol6 = document.createElement("td");
            divtdCol6.className = "altRowBg1 darkFont";
            divtdCol6.innerHTML = "✔";
            divtdCol7 = document.createElement("td");
            divtdCol7.className = "altRowBg1 darkFont";
            divtdCol7.innerHTML = "✔";
            divtdCol8 = document.createElement("td");
            divtdCol8.className = "altRowBg1 darkFont";
            divtdCol8.innerHTML = "✔";
            divtr4.appendChild(divtdCol1);
            divtr4.appendChild(divtdCol2);
            divtr4.appendChild(divtdCol3);
            divtr4.appendChild(divtdCol4);
            divtr4.appendChild(divtdCol5);
            divtr4.appendChild(divtdCol6);
            divtr4.appendChild(divtdCol7);
            divtr4.appendChild(divtdCol8);
            divTBody.appendChild(divtr4);

            var divtr4_1 = document.createElement("tr");
            divtdCol1 = document.createElement("td");
            divtdCol1.className = "titleBg alignLeft";
            divtdCol1.innerHTML = "Terrestrial Mammal";
            divtdCol2 = document.createElement("td");
            divtdCol2.className = "altRowBg1 darkFont";
            divtdCol2.innerHTML = "✔";
            divtdCol3 = document.createElement("td");
            divtdCol3.className = "altRowBg1 darkFont";
            divtdCol3.innerHTML = "";
            divtdCol4 = document.createElement("td");
            divtdCol4.className = "altRowBg1 darkFont";
            divtdCol4.innerHTML = "";
            divtdCol5 = document.createElement("td");
            divtdCol5.className = "altRowBg1 darkFont";
            divtdCol5.innerHTML = "✔";
            divtdCol6 = document.createElement("td");
            divtdCol6.className = "altRowBg1 darkFont";
            divtdCol6.innerHTML = "";
            divtdCol7 = document.createElement("td");
            divtdCol7.className = "altRowBg1 darkFont";
            divtdCol7.innerHTML = "";
            divtdCol8 = document.createElement("td");
            divtdCol8.className = "altRowBg1 darkFont";
            divtdCol8.innerHTML = "";
            divtr4_1.appendChild(divtdCol1);
            divtr4_1.appendChild(divtdCol2);
            divtr4_1.appendChild(divtdCol3);
            divtr4_1.appendChild(divtdCol4);
            divtr4_1.appendChild(divtdCol5);
            divtr4_1.appendChild(divtdCol6);
            divtr4_1.appendChild(divtdCol7);
            divtr4_1.appendChild(divtdCol8);
            divTBody.appendChild(divtr4_1);

            var divtr5 = document.createElement("tr");
            divtdCol1 = document.createElement("td");
            divtdCol1.className = "titleBg alignLeft";
            divtdCol1.innerHTML = "Herpetofauna (Amphibian &amp; Reptile)";
            divtdCol2 = document.createElement("td");
            divtdCol2.className = "altRowBg2 darkFont";
            divtdCol2.innerHTML = "";
            divtdCol3 = document.createElement("td");
            divtdCol3.className = "altRowBg2 darkFont";
            divtdCol3.innerHTML = "✔";
            divtdCol4 = document.createElement("td");
            divtdCol4.className = "altRowBg2 darkFont";
            divtdCol4.innerHTML = "";
            divtdCol5 = document.createElement("td");
            divtdCol5.className = "altRowBg2 darkFont";
            divtdCol5.innerHTML = "✔";
            divtdCol6 = document.createElement("td");
            divtdCol6.className = "altRowBg2 darkFont";
            divtdCol6.innerHTML = "✔";
            divtdCol7 = document.createElement("td");
            divtdCol7.className = "altRowBg2 darkFont";
            divtdCol7.innerHTML = "✔";
            divtdCol8 = document.createElement("td");
            divtdCol8.className = "altRowBg2 darkFont";
            divtdCol8.innerHTML = "✔";
            divtr5.appendChild(divtdCol1);
            divtr5.appendChild(divtdCol2);
            divtr5.appendChild(divtdCol3);
            divtr5.appendChild(divtdCol4);
            divtr5.appendChild(divtdCol5);
            divtr5.appendChild(divtdCol6);
            divtr5.appendChild(divtdCol7);
            divtr5.appendChild(divtdCol8);
            divTBody.appendChild(divtr5);

            var divtr6 = document.createElement("tr");
            divtdCol1 = document.createElement("td");
            divtdCol1.className = "titleBg alignLeft";
            divtdCol1.innerHTML = "Odonate (Dragonfly) &amp; butterfly";
            divtdCol2 = document.createElement("td");
            divtdCol2.className = "altRowBg1 darkFont";
            divtdCol2.innerHTML = "✔";
            divtdCol3 = document.createElement("td");
            divtdCol3.className = "altRowBg1 darkFont";
            divtdCol3.innerHTML = "✔";
            divtdCol4 = document.createElement("td");
            divtdCol4.className = "altRowBg1 darkFont";
            divtdCol4.innerHTML = "✔";
            divtdCol5 = document.createElement("td");
            divtdCol5.className = "altRowBg1 darkFont";
            divtdCol5.innerHTML = "✔";
            divtdCol6 = document.createElement("td");
            divtdCol6.className = "altRowBg1 darkFont";
            divtdCol6.innerHTML = "";
            divtdCol7 = document.createElement("td");
            divtdCol7.className = "altRowBg1 darkFont";
            divtdCol7.innerHTML = "✔";
            divtdCol8 = document.createElement("td");
            divtdCol8.className = "altRowBg1 darkFont";
            divtdCol8.innerHTML = "";
            divtr6.appendChild(divtdCol1);
            divtr6.appendChild(divtdCol2);
            divtr6.appendChild(divtdCol3);
            divtr6.appendChild(divtdCol4);
            divtr6.appendChild(divtdCol5);
            divtr6.appendChild(divtdCol6);
            divtr6.appendChild(divtdCol7);
            divtr6.appendChild(divtdCol8);
            divTBody.appendChild(divtr6);

            var divtr7 = document.createElement("tr");
            divtdCol1 = document.createElement("td");
            divtdCol1.className = "titleBg alignLeft";
            divtdCol1.innerHTML = "Freshwater communities";
            divtdCol2 = document.createElement("td");
            divtdCol2.className = "altRowBg2 darkFont";
            divtdCol2.innerHTML = "";
            divtdCol3 = document.createElement("td");
            divtdCol3.className = "altRowBg2 darkFont";
            divtdCol3.innerHTML = "✔";
            divtdCol4 = document.createElement("td");
            divtdCol4.className = "altRowBg2 darkFont";
            divtdCol4.innerHTML = "";
            divtdCol5 = document.createElement("td");
            divtdCol5.className = "altRowBg2 darkFont";
            divtdCol5.innerHTML = "";
            divtdCol6 = document.createElement("td");
            divtdCol6.className = "altRowBg2 darkFont";
            divtdCol6.innerHTML = "✔";
            divtdCol7 = document.createElement("td");
            divtdCol7.className = "altRowBg2 darkFont";
            divtdCol7.innerHTML = "";
            divtdCol8 = document.createElement("td");
            divtdCol8.className = "altRowBg2 darkFont";
            divtdCol8.innerHTML = "";
            divtr7.appendChild(divtdCol1);
            divtr7.appendChild(divtdCol2);
            divtr7.appendChild(divtdCol3);
            divtr7.appendChild(divtdCol4);
            divtr7.appendChild(divtdCol5);
            divtr7.appendChild(divtdCol6);
            divtr7.appendChild(divtdCol7);
            divtr7.appendChild(divtdCol8);
            divTBody.appendChild(divtr7);

            var divtr8 = document.createElement("tr");
            divtdCol1 = document.createElement("td");
            divtdCol1.className = "titleBg alignLeft";
            divtdCol1.innerHTML = "Intertidal community (including horseshoe crab &amp; mudskipper)";
            divtdCol2 = document.createElement("td");
            divtdCol2.className = "altRowBg1 darkFont";
            divtdCol2.innerHTML = "✔";
            divtdCol3 = document.createElement("td");
            divtdCol3.className = "altRowBg1 darkFont";
            divtdCol3.innerHTML = "✔";
            divtdCol4 = document.createElement("td");
            divtdCol4.className = "altRowBg1 darkFont";
            divtdCol4.innerHTML = "";
            divtdCol5 = document.createElement("td");
            divtdCol5.className = "altRowBg1 darkFont";
            divtdCol5.innerHTML = "";
            divtdCol6 = document.createElement("td");
            divtdCol6.className = "altRowBg1 darkFont";
            divtdCol6.innerHTML = "";
            divtdCol7 = document.createElement("td");
            divtdCol7.className = "altRowBg1 darkFont";
            divtdCol7.innerHTML = "✔";
            divtdCol8 = document.createElement("td");
            divtdCol8.className = "altRowBg1 darkFont";
            divtdCol8.innerHTML = "✔";
            divtr8.appendChild(divtdCol1);
            divtr8.appendChild(divtdCol2);
            divtr8.appendChild(divtdCol3);
            divtr8.appendChild(divtdCol4);
            divtr8.appendChild(divtdCol5);
            divtr8.appendChild(divtdCol6);
            divtr8.appendChild(divtdCol7);
            divtr8.appendChild(divtdCol8);
            divTBody.appendChild(divtr8);

            var divtr9 = document.createElement("tr");
            divtdCol1 = document.createElement("td");
            divtdCol1.className = "titleBg alignLeft";
            divtdCol1.innerHTML = "Coastal fish (in particular seahorse &amp; pipefish)";
            divtdCol2 = document.createElement("td");
            divtdCol2.className = "altRowBg2 darkFont";
            divtdCol2.innerHTML = "";
            divtdCol3 = document.createElement("td");
            divtdCol3.className = "altRowBg2 darkFont";
            divtdCol3.innerHTML = "✔";
            divtdCol4 = document.createElement("td");
            divtdCol4.className = "altRowBg2 darkFont";
            divtdCol4.innerHTML = "";
            divtdCol5 = document.createElement("td");
            divtdCol5.className = "altRowBg2 darkFont";
            divtdCol5.innerHTML = "✔";
            divtdCol6 = document.createElement("td");
            divtdCol6.className = "altRowBg2 darkFont";
            divtdCol6.innerHTML = "";
            divtdCol7 = document.createElement("td");
            divtdCol7.className = "altRowBg2 darkFont";
            divtdCol7.innerHTML = "";
            divtdCol8 = document.createElement("td");
            divtdCol8.className = "altRowBg2 darkFont";
            divtdCol8.innerHTML = "";
            divtr9.appendChild(divtdCol1);
            divtr9.appendChild(divtdCol2);
            divtr9.appendChild(divtdCol3);
            divtr9.appendChild(divtdCol4);
            divtr9.appendChild(divtdCol5);
            divtr9.appendChild(divtdCol6);
            divtr9.appendChild(divtdCol7);
            divtr9.appendChild(divtdCol8);
            divTBody.appendChild(divtr9);

            var divtr10 = document.createElement("tr");
            divtdCol1 = document.createElement("td");
            divtdCol1.className = "titleBg alignLeft";
            divtdCol1.innerHTML = "Benthic";
            divtdCol2 = document.createElement("td");
            divtdCol2.className = "altRowBg1 darkFont";
            divtdCol2.innerHTML = "";
            divtdCol3 = document.createElement("td");
            divtdCol3.className = "altRowBg1 darkFont";
            divtdCol3.innerHTML = "";
            divtdCol4 = document.createElement("td");
            divtdCol4.className = "altRowBg1 darkFont";
            divtdCol4.innerHTML = "✔";
            divtdCol5 = document.createElement("td");
            divtdCol5.className = "altRowBg1 darkFont";
            divtdCol5.innerHTML = "";
            divtdCol6 = document.createElement("td");
            divtdCol6.className = "altRowBg1 darkFont";
            divtdCol6.innerHTML = "";
            divtdCol7 = document.createElement("td");
            divtdCol7.className = "altRowBg1 darkFont";
            divtdCol7.innerHTML = "";
            divtdCol8 = document.createElement("td");
            divtdCol8.className = "altRowBg1 darkFont";
            divtdCol8.innerHTML = "";
            divtr10.appendChild(divtdCol1);
            divtr10.appendChild(divtdCol2);
            divtr10.appendChild(divtdCol3);
            divtr10.appendChild(divtdCol4);
            divtr10.appendChild(divtdCol5);
            divtr10.appendChild(divtdCol6);
            divtr10.appendChild(divtdCol7);
            divtr10.appendChild(divtdCol8);
            divTBody.appendChild(divtr10);
            divTable.appendChild(divTBody);
          }
          

          break;
        
        case "2-1":
        case "2-2":
        case "2-3":
        case "2-4":
        case "2-5":
        case "2-6":
        case "2-7":
        case "2-8":
        case "2-9":
        case "2-10":
        case "2-11":
        case "2-12":
        case "3-1":
        case "3-2":
          this.turnOffSubMenu1Layers();
          
          var currentMenu;
          for (let el of this.subMenuDetails) {
            if (el.key == currentKey)
            {
              currentMenu = el;
              break;
            }
          }
          var hasImg = false;
          if (currentMenu.Images.length > 0){
            hasImg = true;
          }
          var contentDetail = "<ul>";
          var currentRow = "";
          for (let el of currentMenu.Detail) {
            currentRow = el;
            if(hasImg)
            {
              currentRow += "<br/><br/><table style='width: 100%'><tr>";

              for(let imgUrl of currentMenu.Images)
              {
                currentRow += "<td style='text-align: center;'><img src='" + imgUrl + "' width='200px' height='150px' /></td>"
              }
              currentRow += "</tr></table>";
            }
            contentDetail += "<li><span>" + currentRow + "</span></li>";
          }
          contentDetail += "</ul>";


          var divWrapper = document.createElement("div");
          divWrapper.id = "contentWrapper";
          if (currentKey == "3-1" || currentKey == "3-2" )
          {
            divWrapper.className = "itemDetail3";
          }
          else
          {
            divWrapper.className = "itemDetail2";
            this.$store.commit('updateEcologySub2and3On', true);
            if (currentKey == "2-1")
            {
              this.$store.commit('updateEcologySub2_1', true);
            }
            else if (currentKey == "2-2")
            {
              this.$store.commit('updateEcologySub2_2', true);
            }
            else if (currentKey == "2-3")
            {
              this.$store.commit('updateEcologySub2_3', true);
            }
            else if (currentKey == "2-4")
            {
              this.$store.commit('updateEcologySub2_4', true);
            }
            else if (currentKey == "2-5")
            {
              this.$store.commit('updateEcologySub2_5', true);
            }
            else if (currentKey == "2-6")
            {
              this.$store.commit('updateEcologySub2_6', true);
            }
            else if (currentKey == "2-7")
            {
              this.$store.commit('updateEcologySub2_7', true);
            }
            else if (currentKey == "2-8")
            {
              this.$store.commit('updateEcologySub2_8', true);
            }
            else if (currentKey == "2-9")
            {
              this.$store.commit('updateEcologySub2_9', true);
            }
            else if (currentKey == "2-10")
            {
              this.$store.commit('updateEcologySub2_10', true);
            }
            else if (currentKey == "2-11")
            {
              this.$store.commit('updateEcologySub2_11', true);
            }
            else 
            {
              this.$store.commit('updateEcologySub2_12', true);
            }
          }
          itemDetailDiv.appendChild(divWrapper);

          //title
          var divTitle = document.createElement("div");
          divTitle.id = "itemTitle";
          divTitle.innerHTML = currentMenu.Name;
          divTitle.className = "itemTitle";
          divWrapper.appendChild(divTitle);

          //X - Close
          var divXClose = document.createElement("div");
          divXClose.id="itemClose";
          divXClose.innerHTML = "X";
          divXClose.className = "itemClose";
          divXClose.onclick = function() {
            myVue.$emit('close_detail',0,0);
          };
          divWrapper.appendChild(divXClose);

          var divDiv = document.createElement("div");
          //divDiv.className = "content";
          divDiv.style.marginLeft = "50px";
          divDiv.style.marginTop = "10px";
          divDiv.style.marginRight = "10px";
          divDiv.style.marginBottom = "15px";
          divDiv.style.textAlign = "justify";
          divDiv.innerHTML = contentDetail;
          divWrapper.appendChild(divDiv);


          break;
      }
      
      
    },
    turnOffPDescriptionLayers()
    {
      myCesium.switchProjectDescLayerOff("sub2point1");
      myCesium.switchProjectDescLayerOff("sub2point2");
      myCesium.switchProjectDescLayerOff("sub3point1");
      myCesium.switchProjectDescLayerOff("sub3point2");
      myCesium.switchProjectDescLayerOff("sub3point3");
      myCesium.switchProjectDescLayerOff("sub3point4");
      this.$store.commit('updatePDescSub2Point1', false); 
      this.$store.commit('updatePDescSub2Point2', false);
      this.$store.commit('updatePDescYearOff');
    },
    turnOffNoiseLayers(){
      myCesium.switchNoiseLayerOffAll();
      this.$store.commit('updateNoise', false);
      // this.$store.commit('updateNoiseLeqdayBuilding1', false);
      // this.$store.commit('updateNoiseLeqnightBuilding1', false);
      // this.$store.commit('updateNoiseLmaxnightBuilding1', false);
    }

  },
  components: {},
  mounted() {
    this.init();
  },
};
</script>

<style lang='less'>
@import "@/my-theme/config.less";
.subItem {
  margin-bottom: 10px;
}
.document {
  margin: 20px;
  width: calc(~"100vw - 200px");
  height: calc(~"100vh - 120px");
  background-color: @menu_bj;
  padding: 20px;
  .subDetail {
    font-size: 30px;
  }
}
.submenuTooltip {
    display: none;
}
/*.sub2window {
  height: calc(~"100vh - 400px");
  overflow-y: scroll;
}*/
@media(max-width:768px) {
    .submenuTooltip {
        display: block;
        width: 50vw;
        height: 10px;
        margin-left: auto;
        margin-right: auto;
        background-color: #f3f3f3;
        border-radius: 20px;
        margin-bottom: 10px;
        opacity: 0.8; 
    }
}
</style>