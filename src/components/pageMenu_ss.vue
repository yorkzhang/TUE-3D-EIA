<template>
  <div class="pageMenu">
    <div class="logo">
      <img src="img/mtr-dew-logo.png" />
    </div>
    <div class="menu">
      <div
        class="menuItem"
        v-for="(item, index) in menuList"
        :key="index"
        @click="checkMenu(item.path)"
        :class="{ active: activeMenu === item.path }"
        :style="item.style"
      >
        <!-- <Icon :type="item.icon" size="21" /> -->
        <span class="menuIcon"><img :src="item.icon" width="21px" height="21px"/></span>
        <span class="menuText">{{ item.text }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeMenu: "",
      menuList: [
        {
          // icon: "ios-search",
          icon: "img/menu_icons/mnProjectDesc.png",
          text: "Project Description",
          path: "pdesc",
          style: "background-color: #FFB953; cursor: pointer"
        },
        // {
        //   icon: "ios-map-outline",
        //   text: "Mapping",
        //   path: "mapping",
        // },
        {
          //icon: "md-eye",
          icon: "img/menu_icons/mnRailNoise.png",
          text: "Airborne Rail Noise",
          path: "Noise",
          style: "background-color: #61CED1; cursor: pointer"
        },

        {
          //icon: "ios-leaf-outline",
          icon: "img/menu_icons/mnEcology.png",
          text: "Ecology",
          path: "3DView",
          style: "background-color: #3AC691; cursor: pointer"
        },
        // {
        //   icon: "md-download",
        //   text: "Export",
        //   path: "export",
        // },
        {
          //icon: "md-help-circle",
          icon: "img/menu_icons/mnEIAReport.svg",
          text: "EIA Report",
          path: "help",
          style: "background-color: #D76663; cursor: pointer"
        },
        {
          //icon: "ios-alert-outline",
          icon: "img/menu_icons/mnFeedback.png",
          text: "Feedback",
          path: "feedback",
          style: "background-color: #D9BD7D; cursor: pointer"
        },
      ],
    };
  },
  watch: {
    "$route.path"(path) {
      this.activeMenu = path.substring(1);
    },
  },
  props: {},
  methods: {
    init() {
      let path = this.$route.path;
      path = path.substring(1);
      if (path === "" || path === "main") {
        this.activeMenu = "pdesc";
      } else {
        this.activeMenu = path;
      }
      this.checkMapShow(path);
    },
    checkMenu(path) {
      if (path ==="help") {
        window.open("https://www.epd.gov.hk/eia/english/alpha/aspd_766.html","_blank").focus();
      } else if (this.activeMenu === path) {
        this.$store.commit("updateShowSubMenu", !this.$store.state.showSubMenu);
      } else {
        this.$store.commit("updateShowSubMenu", true);
        this.checkMapShow(path);
        this.activeMenu = path;
        this.$router.push(path);
      }
    },
    checkMapShow(path) {
      let showMap;
      // if (path === "about" || path === "help" || path === "settings") {
      // if (path === "3DView") {
      //   showMap = false;
      // } else {
      //   showMap = true;
      // }
      showMap = false;
      this.$store.commit("updateShowMap", showMap);
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
.pageMenu {
  width: @menu_widhth;
  height: calc(100vh);
  background-color: @menu_bj;
  .logo {
    background-color: #F3F3F3;
    padding-top: 12px;
    padding-bottom: 8px;
    img {
      width: 120px;
      height: auto;
    }
  }
  .menu {
    height: @content_height;
    overflow-y: auto;
    //padding-top: 8px;
    .menuItem {
      height: 75px;
      display: flex;
      align-items: center;
      margin: 0;
      .ivu-icon {
        margin-left: 20px;
      }
      img {
        margin-left: 20px;
      }
      .menuText {
        font-size: 16px;
        margin-left: 16px;
        text-align: left;
      }
      &:hover {
        background: @menu_hover_background;
      }
    }
    .active {
      background: @menu_hover_background;
    }
  }
}

@media (max-width:768px){
  .pageMenu {
    width: 100vw;
    height: 80px;
    position: fixed;
    bottom: 0;
    z-index: 3;
    //top: calc(~"100% - 80px");
    .logo {
      display: none;
    }
    .menu {
      display: flex;
      height: 500px;
      width: 100vw;
    }
    .menuItem {
      width: calc(~"100vw / 5");
      height: 80px!important;
      .menuIcon {
        width: calc(~"100vw / 5");
        display: block;
        position: fixed;
        height: 80px;
      }
      img {
        display: block;
        margin-top: 10px;
        margin-left: auto!important;;
        margin-right: auto;
      }
      .menuText {
        text-align: center!important;
        font-size: 14px!important;
        margin-left: 0!important;
        line-height: 1.2!important;
        margin-top: 20px;
        width: calc(~"100vw / 5");
        position: fixed;
      }
    }
    
  }
  
}
</style>