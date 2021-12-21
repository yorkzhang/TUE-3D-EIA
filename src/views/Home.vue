<template>
  <div class="home">
    <!-- <img alt="Vue logo" src="../assets/logo.png" /> -->
    <div id="min">
      <Button
        type="primary"
        id="draw"
        icon="md-square-outline"
        @click="drawPolygon"
        >draw</Button
      >
      <Button
        type="primary"
        id="clear"
        icon="ios-trash-outline"
        @click="editPolygon"
        >editPolygon</Button
      >
      <div id="mapBoxContainer" class="heightMy"></div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import MapBox from "@/libs/myMapBox.js";
import "@/style/mapbox-gl-draw.css";
import Cesium from "../libs/myCesium.js";
export default {
  name: "Home",
  data() {
    return {};
  },
  components: {},
  methods: {
    init() {
      MapBox.init();
    },
    drawPolygon() {
      MapBox.getHabitatMap();
    },
    editPolygon() {
      MapBox.editPolygon();
    },
  },
  mounted() {
    this.init();
  },
};
</script>
<style>
.heightMy {
  height: 900px;
  border: medium double rgb(24, 11, 24);
}
#draw {
  position: absolute;
  top: 10px;
  z-index: 2;
  left: 20px;
}
#clear {
  position: absolute;
  top: 10px;
  z-index: 2;
  left: 120px;
}
</style>