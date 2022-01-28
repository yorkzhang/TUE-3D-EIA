<template>
    <div class="subDetail"> 
        <div class="subDetailContent" style="height: calc(100vh - 370px);">
            <div class="submenuTooltip" @click="closeSubMenu()"></div>
            <div class="subItem" :style="lightColor" >
                <div class="subTitle marginBottom10">Airborne Railway Noise</div>
                <div>
                    <hr/>
                    <div class="subTitle" style="font-weight: bold;">Operational Phase</div><br />
                    <div>Noise Level</div>
                    <div class="buttonTab" @click="openWithoutMitigation">Without Mitigation</div>
                    <div v-if="withoutMitigationTabOpen">
                        <hr/>
                        <select name="NoiseNoMitigation" id="NoiseNoMitigation" @change="onChangeNoMitigation($event)" >
                            <option value="" selected="selected" disabled="disabled"></option>
                            <option value="Leq_day_nomit">Leq <sub>(30min)</sub> (daytime & evening time)</option>
                            <option value="Leq_night_nomit">Leq <sub>(30min)</sub> (night-time)</option>
                            <option value="Lmax_nomit">Lmax</option>
                        </select>
                    </div>
                    
                    <div  class="buttonTab" @click="openMitigation">With Mitigation</div>                
                    <div v-if="withMitigationTabOpen">
                        <hr/>
                        <select name="NoiseMitigation" id="NoiseMitigation" @change="onChangeMitigation($event)" >
                            <option value="" selected="selected" disabled="disabled"></option>
                            <!-- <option value="Leq_day_mit">Leq (day)</option> -->
                            <option value="Leq_night_mit">Leq <sub>(30min)</sub> (night-time)</option>
                            <!-- <option value="Lmax_mit">Lmax</option> -->
                        </select>
                    </div>
                </div>
            </div>
        </div>
        <div class="subNotification" align="justify" style="height: 300px; font-size:100%;" >
            Note:<br>
•The information provided on this website is for reference only. Please refer to the Environmental Impact Assesssment (EIA) Report for more details, assumptions and assessment results.<br>
•The first layer of buildings facing the realigned track of TCE are of commercial uses and are not regarded as Noise Sensitive Receivers.<br>
•Modelling assumptions should refer to the Environmental Impact Assessment (EIA) Report.<br>
•The transparent buildings illustrated are planned developments which are indicative only and subject to change.
        </div>
    </div>
</template>

<script>
import myCesium from "@/libs/myCesium.js";
export default {
    data() {
        return {
            //subMenuDetails: subMenuDetailJSON,
            lightColor: "background-color: #61CED1",
            darkColor: "background-color: #30A9B6",
            withMitigationTabOpen: false,
            withoutMitigationTabOpen: false
            // year1On: false,
            // year2On: false,
            // year3On: false,
            // year4On: false
        };
    },
    methods:{
        openMitigation() {
            myCesium.zoomPDSub2Point1();
            if(this.withMitigationTabOpen) {
                //myCesium.switchNoiseLayerOffAll();
                this.withMitigationTabOpen = false
            }else {
                //this.resetSelectElement();
                myCesium.switchNoiseLayerOffAll();
                this.withMitigationTabOpen = true
                this.withoutMitigationTabOpen = false
                //this.withoutMitigationTabOpen = false
            }
            myCesium.switchWithoutBarrierOff();
            
            myCesium.switchWithBarrierOn();
        },
        openWithoutMitigation() {
            myCesium.zoomPDSub2Point1a();
            if(this.withoutMitigationTabOpen) {
                this.withoutMitigationTabOpen = false
            }else {
                //this.resetSelectElement();
                myCesium.switchNoiseLayerOffAll();
                this.withoutMitigationTabOpen = true
                this.withMitigationTabOpen = false
            }
            myCesium.switchWithBarrierOff();
            myCesium.switchWithoutBarrierOn();
        },
        resetSelectElement() {
            var select1 = document.getElementById("NoiseNoMitigation");
            select1.selectedIndex = 0;
            var select2 = document.getElementById("NoiseMitigation");
            select2.selectedIndex = 0;
        },

        onChangeNoMitigation: function(event){
            //console.log(event.target.value);
            // myCesium.switchNoiseLayerOffAll();
            // myCesium.switchNoiseLayerOn(event.target.value);
            // myCesium.moveMap();
            this.noiseChange(event.target.value);
        },
        onChangeMitigation: function(event){
            // //console.log(event.target.value);
            // this.turnOffNoiseLayers();
            // myCesium.switchNoiseLayerOn(event.target.value);
            // myCesium.moveMap();
            // this.$store.commit('updateNoise', true);
            // // if (event.target.value == "Leq_day")
            // // {
            // //     this.$store.commit('updateNoiseLeqdayBuilding1', true);
            // // }
            // // else if(event.target.value == "Leq_night")
            // // {
            // //     this.$store.commit('updateNoiseLeqnightBuilding1', true);
            // // }
            // // else if(event.target.value == "Lmax_night")
            // // {
            // //     this.$store.commit('updateNoiseLmaxnightBuilding1', true);
            // // }
            this.noiseChange(event.target.value);
        },
        noiseChange(key){            
            this.turnOffNoiseLayers();
            this.turnOffEcologyLayers();
            this.turnOffPDescriptionLayers();
            myCesium.switchNoiseLayerOn(key);
            myCesium.moveMap();            
            this.$store.commit('updateNoise', true);
        },
        turnOffNoiseLayers(){
            myCesium.switchNoiseLayerOffAll();
            this.$store.commit('updateNoise', false);
            // this.$store.commit('updateNoiseLeqdayBuilding1', false);
            // this.$store.commit('updateNoiseLeqnightBuilding1', false);
            // this.$store.commit('updateNoiseLmaxnightBuilding1', false);
        },
        turnOffEcologyLayers()
        {
            //submenu 1
            this.$store.commit("updateEcologySub1LayerValue", { 'arrIndex': 0, 'value' : false } );
            this.$store.commit("updateEcologySub1LayerValue", { 'arrIndex': 1, 'value' : false } );
            this.$store.commit("updateEcologySub1LayerValue", { 'arrIndex': 2, 'value' : false } );
            this.$store.commit("updateEcologySub1LayerValue", { 'arrIndex': 3, 'value' : false } );
            this.$store.commit("updateEcologySub1LayerValue", { 'arrIndex': 4, 'value' : false } );
            this.$store.commit("updateEcologySub1LayerValue", { 'arrIndex': 5, 'value' : false } );
            this.$store.commit('updateEcologySub1Layer', [false,false,false,false,false,false]);
            this.$store.commit('updateSurveyLocationOn', false);
            myCesium.switchLayerOff("sub1point1");
            this.$store.commit('updateHabitatMapOn', false);
            myCesium.switchLayerOff("sub1point3");
            this.$store.commit('updateSitesConservationOn', false);
            myCesium.switchLayerOff("sub1point4");
            myCesium.switchLayerOff("sub1point5");
            this.$store.commit('updateAssessment500mOn', false);
            myCesium.switchLayerOff("sub1point6");
            //submenu 2 & 3
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
        }
    }
}
</script>

<style lang='less'>
@import "@/my-theme/config.less";
select {
    background-color: #30A9B6;
    width: 240px;
    padding: 6px 10px;
    border-radius: 5px;
    color: white;
    cursor: pointer;
}

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
.imgInButton {
    display: block;
    margin-left: auto;
    margin-right: auto;
    width: 200px;
}
.buttonTab {
    display: block;
    /*border-radius: 10px;*/
    background-color: #30A9B6;
    padding: 10px;
    margin-top: 10px;  
    margin-right: 10px; 
    cursor: pointer;
}

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