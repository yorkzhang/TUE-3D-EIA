<template>
  <div class="home">
    <!-- <img alt="Vue logo" src="../assets/logo.png" /> -->
    <Row type="flex" justify="center" align="bottom" class="row">
      <Col span="14">
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
            @click="cleawPolygon"
            >clear</Button
          >
          <div id="cesiumContainer" class="heightMy"></div>
        </div>
      </Col>
      <Col span="10" class="heightMy">
        <iframe
          :src="iframeSrc1"
          frameborder="0"
          width="100%"
          height="100%"
          scrolling="no"
        ></iframe>
      </Col>
    </Row>
    <Row type="flex" justify="center" align="bottom" class="row">
      <Col span="24" class="heightMy">
        <iframe
          :src="iframeSrc2"
          frameborder="0"
          width="100%"
          height="100%"
          scrolling="no"
          seamless
          allowtransparency
        ></iframe>
      </Col>
    </Row>
  </div>
</template>

<script>
// @ is an alias to /src
import Map from "../libs/myCesium.js";
export default {
  name: "Home",
  data() {
    return {
      iframeSrc1:
        "http://localhost:3000/public/dashboard/5eeb000c-dbd0-406b-a351-52300ef0685f#fullscreen&titled=false",
      iframeSrc2:
        "http://localhost:3000/public/dashboard/8e241842-bc8a-48a9-bc17-fd67eb42c595#fullscreen&titled=false",
    };
  },
  components: {},
  methods: {
    init() {
      Map.initCesium();
    },
    drawPolygon() {
      Map.draw();
    },
    updateMetabase() {
      console.log("emit");
      this.$set(this, "iframeSrc1", "");
      this.$set(this, "iframeSrc2", "");
      setTimeout(() => {
        this.$set(
          this,
          "iframeSrc1",
          "http://localhost:3000/public/dashboard/5eeb000c-dbd0-406b-a351-52300ef0685f#fullscreen&titled=false"
        );
        this.$set(
          this,
          "iframeSrc2",
          "http://localhost:3000/public/dashboard/8e241842-bc8a-48a9-bc17-fd67eb42c595#fullscreen&titled=false"
        );
      }, 500);
    },
    cleawPolygon() {
      Map.clearDraw();
    },
  },
  mounted() {
    this.init();
    this.cleawPolygon();
    setTimeout(() => {
      myVue.$on("postgres", this.updateMetabase);
    }, 1000);
  },
};
</script>
<style>
/* #cesiumContainer {
  height: 700px;
} */
.heightMy {
  height: 700px;
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