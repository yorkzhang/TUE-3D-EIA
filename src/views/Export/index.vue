<template>
  <div class="subDetail">
    <div class="subItem marginBottom10">
      <div class="subTitle marginBottom10">Export</div>
      <Button
        icon="ios-cloud-upload-outline"
        long
        class="marginBottom10"
        @click="extractHabitatMap"
      >
        Extract Habitat Map
      </Button>
      <Button
        icon="ios-cloud-upload-outline"
        long
        class="marginBottom10"
        :disabled="!showExport"
        @click="extractShapefile"
      >
        Export shapefile
      </Button>
      <Button
        icon="ios-create-outline"
        long
        class="marginBottom10"
        :disabled="!showExport"
        @click="extractGeojson"
      >
        Export geojson
      </Button>
    </div>
  </div>
</template>

<script>
//@XR
let exportGeojsonUrl = "http://localhost:1111/downloadhabitatGeojson";
let exportShapefileUrl = "http://localhost:1111/downloadhabitatShp";
import MapBox from "@/libs/myMapBox.js";
export default {
  data() {
    return {
      showExport: false,
    };
  },
  methods: {
    init() {
      // @@a 事件用（get-shapefile-generation-status）这个名字，值返回 true 或 false
      myVue.$on(
        "get-shapefile-generation-status",
        this.getShapefileGenerationStatus
      );
      this.$store.commit("updateShowSubMenu", true);
    },
    extractHabitatMap() {
      MapBox.extractHabitatMap();
    },

    extractShapefile() {
      this.downloadFile(exportShapefileUrl);
    },
    extractGeojson() {
      this.downloadFile(exportGeojsonUrl);
    },
    downloadFile(url) {
      var a = document.createElement("a");
      a.href = url;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    },
    getShapefileGenerationStatus(status) {
      if (status === false) {
        this.$Message.error(
          "ShapeFile generation failed, please try again later"
        );
      }
      this.showExport = status;
    },
  },
  components: {},
  mounted() {
    this.init();
  },
};
</script>

<style lang='less'>
.marginBottom10 {
  margin-bottom: 10px;
}
</style>