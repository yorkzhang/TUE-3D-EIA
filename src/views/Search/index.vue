<template>
  <div class="subDetail search">
    <div class="subItem marginBottom10">
      <div class="subTitle marginBottom10">Search</div>
      <div id="geocoder" class="geocoder"></div>
    </div>
  </div>
</template>

<script>
import MapBox from "@/libs/myMapBox.js";
export default {
  data() {
    return {};
  },
  methods: {
    init() {
      MapBox.AddSeartDiv();
    },
  },
  components: {},
  mounted() {
    this.init();
  },
};
</script>

<style lang='less'>
.search {
  .geocoder {
    .mapboxgl-ctrl-geocoder {
      background-color: transparent;
    }
    .mapboxgl-ctrl-geocoder--button {
      background: #2d3849;
    }
    .mapboxgl-ctrl-geocoder .suggestions > li > a {
      color: #ffffff;
      &:hover {
        background-color: #2d384999;
      }
    }
    .mapboxgl-ctrl-geocoder .suggestions {
      background-color: #2d3849;
    }
    .mapboxgl-ctrl-geocoder .suggestions > .active > a,
    .mapboxgl-ctrl-geocoder .suggestions > li > a:hover {
      // color: #404040;
      background-color: #1b212b66;
    }
    input {
      background-color: #2d3849;
      color: #ffffff;
      border: 1px solid #fff;
      border-radius: 2px;
      &:focus {
        outline: none;
      }
    }
  }
}
</style>