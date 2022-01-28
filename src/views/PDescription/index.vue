<template>
    <div class="subDetail"> 
        <div class="subDetailContent" style="overflow:auto; height: calc(100vh - 270px);">
            <div class="submenuTooltip scrollable" @click="closeSubMenu()"></div>
            <div class="subItem scrollable" :style="lightColor" >
                <div class="subTitle marginBottom10">Stations of Tung Chung Line Extension</div>
                <div>
                    <hr/>
                    <div class="clickablePoint" @click="openDetail(1,1)" :style="darkColor">
                    <span style="margin: auto; display:table;">Tung Chung East</span>
                    </div>
                    <div class="clickablePoint" @click="openDetail(1,2)" :style="darkColor">
                    <span style="margin: auto; display:table;">Tung Chung West</span>
                    </div>
                </div>
            </div>
            <!-- <div class="subItem" :style="lightColor"> -->
            <div class="subItem scrollable" :style="lightColor">
                <div class="subTitle marginBottom10">Alignment of Tung Chung Line Extension</div>
                <div>
                    <hr/>
                    <div class="clickablePoint" @click="openDetail(2,1)"  :style="darkColor">
                        <table cellspacing="0" style="border:none; margin-right:auto; margin-left:auto;">
                            <tr>
                                <td style="width: 93px; text-align: center;">Tung Chung East</td>
                                <td><img src="img/mtrIntersectionWhite.png" alt="" width="50px" /></td>
                                <td style="width: 93px; text-align: center;">Tung Chung</td>
                            </tr>
                        </table>
                    <!-- <img src="img/tceIntersectionWhite.png" alt="" class="imgInButton" /> -->
                    </div>
                    <div class="clickablePoint" @click="openDetail(2,2)"  :style="darkColor">
                    <!-- <span style="margin: auto; display:table;">Tung Chung - Tung Chung West</span> -->
                    <!-- <img src="img/tcwIntersectionWhite.png" alt="" class="imgInButton" /> -->
                        <table cellspacing="0" style="border:none; margin-right:auto; margin-left:auto;">
                            <tr>
                                <td style="width: 93px; text-align: center;">Tung Chung</td>
                                <td><img src="img/mtrIntersectionWhite.png" alt="" width="50px" /></td>
                                <td style="width: 93px; text-align: center;">Tung Chung West</td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
            <!-- <div class="subItem" :style="lightColor">
                <div class="subTitle marginBottom10">Major Construction Activities</div>
                <div>
                    <hr/> -->
                    <!-- <div class="clickablePoint" > -->
                    <!-- <span style="margin: auto; display:table;">Years</span> -->                    
                    <!-- </div> -->
                    <!-- <table cellspacing="0" class="clickableTable"  style="border:none; margin-right:auto; margin-left:auto;">
                        <tr>
                            <td style="width:58px;"  @click="openDetail(3,1)">
                                <div>
                                    <div v-if="$store.state.pDescYear1On == true"><img src="img/siteYearAOn.png" alt=""/></div>
                                    <div v-else><img src="img/siteYearAOff.png" alt=""/></div>
                                    <div style="text-align: center;">2023</div>
                                </div>
                            </td>
                            <td style="width:58px;" @click="openDetail(3,2)">
                                <div>
                                    <div v-if="$store.state.pDescYear2On == true"><img src="img/siteYearBOn.png" alt=""/></div>
                                    <div v-else><img src="img/siteYearBOff.png" alt=""/></div>
                                    <div style="text-align: center;">2027</div>
                                </div>
                            </td>
                            <td style="width:58px;" @click="openDetail(3,3)">
                                <div>
                                    <div v-if="$store.state.pDescYear3On == true"><img src="img/siteYearBOn.png" alt=""/></div>
                                    <div v-else><img src="img/siteYearBOff.png" alt=""/></div>
                                    <div style="text-align: center;">2029</div>
                                </div>
                            </td>
                            <td style="width:58px;" @click="openDetail(3,4)">
                                <div>
                                    <div v-if="$store.state.pDescYear4On == true"><img src="img/siteYearCOn.png" alt=""/></div>
                                    <div v-else><img src="img/siteYearCOff.png" alt=""/></div>
                                    <div style="text-align: center;">≥ 2031</div>
                                </div>
                            </td>
                        </tr>
                    </table> -->
                    <!-- <table cellspacing="0" class="clickableTable"  style="border:none; margin-right:auto; margin-left:auto;">
                        <tr>
                            <td style="width:77px; cursor:pointer;"  @click="openDetail(3,1)">
                                <div>
                                    <div v-if="$store.state.pDescYear1On == true"><img src="img/siteYearAOn_77.png" alt=""/></div>
                                    <div v-else><img src="img/siteYearAOff_77.png" alt=""/></div>
                                    <div style="text-align: center;">2023</div>
                                </div>
                            </td>
                            <td style="width:78px; cursor:pointer;" @click="openDetail(3,2)">
                                <div>
                                    <div v-if="$store.state.pDescYear2On == true"><img src="img/siteYearBOn_77.png" alt=""/></div>
                                    <div v-else><img src="img/siteYearBOff_77.png" alt=""/></div>
                                    <div style="text-align: center;">2027</div>
                                </div>
                            </td>
                            <td style="width:77px; cursor:pointer;" @click="openDetail(3,3)">
                                <div>
                                    <div v-if="$store.state.pDescYear3On == true"><img src="img/siteYearCOn_77.png" alt=""/></div>
                                    <div v-else><img src="img/siteYearCOff_77.png" alt=""/></div>
                                    <div style="text-align: center;">2029</div>
                                </div>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
            <div class="subItem" :style="lightColor">
                <div class="subTitle marginBottom10">Environmental Initiatives (to be further reviewed and developed during detailed design stage)</div>
                <div>
                    <hr/>
                    <div class="clickablePoint"  @click="openDetail(4,1)" :style="darkColor">
                        <span style="margin: auto; display:table;">PV Panels</span>
                    </div>
                    <div class="clickablePoint"  @click="openDetail(4,2)" :style="darkColor">
                        <span style="margin: auto; display:table;">Solar Tubes</span>
                    </div>
                    <div class="clickablePoint"  @click="openDetail(4,3)" :style="darkColor">
                        <span style="margin: auto; display:table;">Rainwater Harvesting</span>
                    </div>
                    <div class="clickablePoint"  @click="openDetail(4,4)" :style="darkColor">
                        <span style="margin: auto; display:table;">Greywater Recycling</span>
                    </div> -->
                <!-- </div>
            </div> --> 
        </div>
        <!--<div class="subNotification">-->
        <div class="subNotification" align="justify" style="height: 300px; font-size:100%;" >
            Note: <br>
            •The information provided on this website is for reference only. Please refer to the Environmental Impact Assesssment (EIA) Report for more details, assumptions and assessment results.<br>
            •The transparent buildings illustrated are planned developments which are indicative only and subject to change.
        </div>
        
    </div>
    
</template>

<script>
import myCesium from "@/libs/myCesium.js";
import subMenuDetailJSON from "@/config/submenuDetails.json";
export default {
    
    data() {
        return {
            subMenuDetails: subMenuDetailJSON,
            lightColor: "background-color: #FFB953",
            darkColor: "background-color: #FF9551"
            // year1On: false,
            // year2On: false,
            // year3On: false,
            // year4On: false
        };
    },
    props: {},
    created() {
        window.openDetail = this.openDetail;
    },
    methods: {
        init() {
            myVue.$on("close_detail_pd", this.openDetail);
        },
        closeSubMenu() {
            this.$store.commit("updateShowSubMenu", false);
        },
        openDetail(subNo, pointNo)
        {
            //alert("Clicked SubNo: " + subNo + ", pointNo: " + pointNo);
            this.turnOffEcologyLayers();
            this.turnOffProjectDescLayers();
            this.turnOffNoiseLayers();
            this.turnOffYearLayerSelection();
            this.resetItemDetailPanel();
            myCesium.switchTCETCWOn();

            var itemDetailDiv = document.getElementById("itemDetail");

            if (subNo == 1 && pointNo == 1)
            {
                myCesium.zoomPDSub1Point1();
            }
            else if(subNo == 1 && pointNo == 2 )
            {
                myCesium.zoomPDSub1Point2();
            }
            else if(subNo == 2 && pointNo == 1 )
            {
                myCesium.zoomPDSub2Point1();
                myCesium.switchProjectDescLayerOn("sub2point1");
                this.$store.commit('updatePDescSub2Point1', true);
            }
            else if(subNo == 2 && pointNo == 2 )
            {
                myCesium.zoomPDSub2Point2();
                myCesium.switchProjectDescLayerOn("sub2point2");
                this.$store.commit('updatePDescSub2Point2', true);
            }
            else if(subNo == 3 && pointNo == 1 )
            {
                // this.year1On = true;
                this.$store.commit('updatePDescYearOn', 1);
                myCesium.zoomPDSub3();
                myCesium.switchProjectDescLayerOn("sub3point1");
                myCesium.switchTCETCWOff();
            }
            else if(subNo == 3 && pointNo == 2 )
            {
                // this.year2On = true;
                this.$store.commit('updatePDescYearOn', 2);
                myCesium.zoomPDSub3();
                myCesium.switchProjectDescLayerOn("sub3point2");
                myCesium.switchTCETCWOff();
            }
            else if(subNo == 3 && pointNo == 3 )
            {
                // this.year3On = true;
                this.$store.commit('updatePDescYearOn', 3);
                myCesium.zoomPDSub3();
                myCesium.switchProjectDescLayerOn("sub3point3");
                //myCesium.switchTCETCWOff();
            }
            else if(subNo == 3 && pointNo == 4 )
            {
                // this.year4On = true;
                this.$store.commit('updatePDescYearOn', 4);
                myCesium.zoomPDSub3();
                myCesium.switchProjectDescLayerOn("sub3point4");
            }
            else if(subNo == 4 && pointNo == 1 )
            {
                myCesium.zoomPDSub4();

            }
            else if(subNo == 4 && pointNo == 2 )
            {
                //myCesium.zoomPDSub4();
                myCesium.zoomPDSub2Point2(); // change zoom to Tung CHhung West
            }
            else if(subNo == 4 && pointNo == 3 )
            {
                //myCesium.zoomPDSub4();
                myCesium.zoomPDSub2Point2(); // change zoom to Tung CHhung West
            }
            else if(subNo == 4 && pointNo == 4 )
            {
                myCesium.zoomPDSub4Point4();
            }

            if ((subNo == 4 && pointNo == 1 ) || (subNo == 4 && pointNo == 2 ) || (subNo == 4 && pointNo == 3 ) || (subNo == 4 && pointNo == 4 )) {
                var currentMenu;
                var currentKey = "PD" + subNo.toString() + "-" + pointNo.toString();
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
                    // if(hasImg)
                    // {
                    //     currentRow += "<br/><br/><table style='width: 100%'><tr>";

                    //     for(let imgUrl of currentMenu.Images)
                    //     {
                    //         currentRow += "<td style='text-align: center;'><img src='" + imgUrl + "' width='200px' height='150px' /></td>"
                    //     }
                    //     currentRow += "</tr></table>";
                    // }
                    contentDetail += "<li><span>" + currentRow + "</span></li>";
                }
                contentDetail += "</ul>";


                var divWrapper = document.createElement("div");
                divWrapper.id = "contentWrapper";
                divWrapper.className = "itemDetail3";
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
                    myVue.$emit('close_detail_pd',0,0);
                    //myVue.$emit('close_detail_pd');
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
                
            }
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
        turnOffProjectDescLayers(){
            myCesium.switchProjectDescLayerOff("sub2point1");
            myCesium.switchProjectDescLayerOff("sub2point2");
            myCesium.switchProjectDescLayerOff("sub3point1");
            myCesium.switchProjectDescLayerOff("sub3point2");
            myCesium.switchProjectDescLayerOff("sub3point3");
            myCesium.switchProjectDescLayerOff("sub3point4");
            this.$store.commit('updatePDescSub2Point1', false); 
            this.$store.commit('updatePDescSub2Point2', false); 
        },
        turnOffYearLayerSelection(){
            // this.year1On = false;
            // this.year2On = false;
            // this.year3On = false;
            // this.year4On = false;
            this.$store.commit('updatePDescYearOff');            
        },
        turnOffNoiseLayers(){
            myCesium.switchNoiseLayerOffAll();
            this.$store.commit('updateNoise', false);
            // this.$store.commit('updateNoiseLeqdayBuilding1', false);
            // this.$store.commit('updateNoiseLeqnightBuilding1', false);
            // this.$store.commit('updateNoiseLmaxnightBuilding1', false);
        },
        resetItemDetailPanel()
        {
            var itemDetailDiv = document.getElementById("itemDetail");
            var itemDetail2Div = document.getElementById("itemDetail2");

            //clearing the content
            while (itemDetailDiv.firstChild) {
                itemDetailDiv.removeChild(itemDetailDiv.lastChild);
            }
            while (itemDetail2Div.firstChild) {
                itemDetail2Div.removeChild(itemDetail2Div.lastChild);
            }
        }
    },
    components: {},
    mounted() {
        this.init();
    },
}
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
.imgInButton {
    display: block;
    margin-left: auto;
    margin-right: auto;
    width: 200px;
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