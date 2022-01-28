<template>
  <div class="fbdocument">
    <div class="subDetail">
      <!--
        <div class="itemTitle" >
            Send Your Feedback
        </div>
        <div class="commentItems">
          <div class="commentItem">
            <div class="commentImg"><img src="img/fb01.png" alt="" width="300px" /></div>
            <div class="commentTitle">Environmental-related Comments</div>
            <div class="commentLink"><a href="https://www.epd.gov.hk/eia/english/alpha/aspd_766.html" target="_blank">Link to Public Comment Form (Environmental Impact Assessment Ordinance Website)</a></div>
          </div>
        -->
          <!--
          <div class="commentItem">
            <div class="commentImg"><img src="img/fb02.png" alt="" width="300px" /></div>
            <div class="commentTitle">General Comments</div>
            <div class="commentLink"><a href="https://forms.office.com/r/79e5xbR3mx" target="_blank" >Link to Tung Chung Line Extension Virtual Information Centre</a></div>
          </div>
          
        </div>-->
    </div>
  </div>
</template>

<script>
//import x from ''
export default {
  data() {
    return {};
  },
  computed: {},
  props: {},
  created() {
    
  },
  methods: {
    init() {
      var itemDetailDiv = document.getElementById("itemDetail");
      var itemDetail2Div = document.getElementById("itemDetail2");
      //clearing the content
      while (itemDetailDiv.firstChild) {
        console.log("here itemDetailDiv");
        itemDetailDiv.removeChild(itemDetailDiv.lastChild);
      }
      while (itemDetail2Div.firstChild) {
        console.log("here itemDetail2Div");
        itemDetail2Div.removeChild(itemDetail2Div.lastChild);
      }
      this.setLegendOff();
    },
    setLegendOff() {
      this.$store.commit('updateSurveyLocationOn', false);
      this.$store.commit('updateHabitatMapOn', false);
      this.$store.commit('updateSitesConservationOn', false);
      this.$store.commit('updateAssessment500mOn', false);
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
      this.$store.commit('updatePDescSub2Point1', false); 
      this.$store.commit('updatePDescSub2Point2', false); 
      this.$store.commit('updatePDescYearOff');
    }
  },
  components: {},
  mounted() {
    this.init();
  },
};
</script>

<style lang='less'>
.fbdocument {
  width: 100%;
  height: 100%;
  background: rgba(255,255,255,0.7);
  position: fixed;
  top: 60px;
  left: 160px;
  z-index: 2;
  color: white;
  .subDetail {
    position:fixed;
    top:50%;
    left: calc(~"50% + 160px");
    transform: translate(calc(~"-50% - 80px"), -50%);
    background: #2d3849;
    text-align: center;
    font-size: 15px;
    border-radius: 10px;
    .itemTitle {
        display: block;
        background-color: #506382;
        font-size: 14px;
        height: 30px;
        vertical-align: middle;
        line-height: 30px;
        font-weight:bold;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
    }
    .commentItems{
      display: flex;
      padding-bottom: 20px;
    }
    .commentItem{
      padding-top: 15px;
      width: 325px;
    }
    .commentImg{
      width: 300px;
      margin-left: auto;
      margin-right: auto;
    }
    .commentTitle{
      font-weight: bold;
      padding-top: 10px; 
      padding-bottom: 10px;
    }
    .commentLink{
      color: white; 
      text-decoration: underline; 
      font-size: 12px;
    }
  }
}

@media(max-width:768px){
  .fbdocument {
    left: 0;
    height: calc(~"100vh - 140px");
    .subDetail{
      left: 50%;
      transform: translate(-50%, -50%);
      .commentItems{
        display: block!important;
      }
    }
  }
}
</style>