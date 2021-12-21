<template>
  <!-- <div class="subDetail">The function is not open yet</div> -->
  <div class="subDetail">
    <Alert
      type="warning"
      show-icon
      style="text-align: left"
      v-if="!$store.state.habitatMap"
    >
      Reminder
      <span slot="desc" style="color: #000">
        Please first create project extent and habitat map in “Mapping”
        function. Click <a href="#" @click="goMapping">here</a> to create.
      </span>
    </Alert>
    {{ $store.state.speciesUnImportantMap }}-- {{ $store.state.speciesMap }}--
    <div class="subItem">
      <div class="subTitle marginBottom10">Habitat Map</div>
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
    </div>
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
    </div>
  </div>
</template>

<script>
//import x from ''
import myCesium from "@/libs/myCesium.js";
export default {
  data() {
    return {
      mapOpacity: 1,
      turnOffEntity: true,
    };
  },
  computed: {},
  props: {},

  methods: {
    init() {
      this.$store.commit("updateShowSubMenu", true);
      this.$store.commit("updateShowBasemapSwitch", false);
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