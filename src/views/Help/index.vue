<template>
  <div class="document">
    <div class="subDetail">Help</div>
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

  methods: {
    init() {},
  },
  components: {},
  mounted() {
    this.init();
  },
};
</script>

<style lang='less'>
.document {
  width: 100vw;
  height: 100vh;
  background: #1f2d3a;
  position: absolute;
  padding: 20px;
  top: 0;
  left: 0;
  z-index: 2;
  .subDetail {
    height: calc(~"100vh - 20px");
    background: #2d3849;
    padding: 10px;
    text-align: left;
    font-size: 20px;
  }
}
</style>