<template>
  <div class="pageTitle">
    <div class="title">Tung Chung Line Extension Environmental Impact Assessment</div>
    <div class="title_mobile">
      <div class="title_mobile_logo"><img src="img/mtr_logo_mobile.png" /></div>
      <div class="title_mobile_title">Tung Chung Line Extension EIA</div>
    </div>
    <div class="titleRight">
      <!--
      <div class="titleMenu">
        中
      </div>      
      <div class="titleMenu">
        ENG
      </div>
      -->
      <div class="titleMenu">
        <img src="img/infoIconWhite.png" />
      </div>
      <!-- <div class="project">
        <Icon type="ios-folder-open-outline" />
        <span>Project:</span>
        <Select v-model="project" style="width: 200px">
          <Option
            v-for="item in projectList"
            :value="item.value"
            :key="item.value"
            >{{ item.label }}</Option
          >
        </Select>
      </div>
      <div class="user">
        <Icon type="md-person" size="36" />
        <Dropdown @on-click="userMenuClick">
          <a href="javascript:void(0)">
            <span>{{ $store.state.username }}</span>
            <Icon type="ios-arrow-down"></Icon>
          </a>
          <DropdownMenu slot="list">
            <DropdownItem name="login out">Login Out</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div> -->
    </div>
  </div>
</template>

<script>
//import x from ''
export default {
  data() {
    return {
      project: "1",
      projectList: [
        {
          label: "20001",
          value: "1",
        },
        {
          label: "20002",
          value: "2",
        },
      ],
    };
  },
  computed: {},
  props: {},

  methods: {
    init() {},
    userMenuClick(name) {
      this.$router.push("login");
    },
  },
  components: {},
  mounted() {},
};
</script>

<style lang='less'>
@import "@/my-theme/config.less";
.pageTitle {
  height: 60px;
  width: @content_width;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  position: absolute;
  right: 0;
  .title {
    font-size: 20px;
  }
  .title_mobile {
    display: none;
    img{
      width: 23px;
    }
  }
  .titleRight {
    display: flex;
    align-items: center;
    .titleMenu {
      margin-left: 5px;
      width: 30px;
      img {
        width: 20px;
        height:20px;
        margin-left: 5px;
      }
    }
    .ivu-dropdown-rel {
      a {
        color: #fff;
      }
    }
    .project {
      span {
        margin-right: 10px;
        margin-left: 4px;
      }
    }
    .user {
      margin-left: 20px;
      padding-left: 20px;
      height: 80px;
      border-left: 1px solid #b2b1b1;
      display: flex;
      align-items: center;
      .ivu-dropdown-item {
        color: #000;
      }
      span {
        margin: 0 10px;
      }
    }
  }
}

@media (max-width:768px){
  .pageTitle {
    height: 60px;
    width: 100vw;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    position: absolute;
    right: 0;
    .title {
      font-size: 24px;
      display: none;
    }
    .title_mobile{
      display: flex;
      padding-left: 28px;
      .title_mobile_logo{
        margin-top: auto;
        margin-bottom: auto;
        transform: translate(-30px, 2px);
        img{
          width: 40px;
          margin-right: -15px;
          //transform: translate(-30px, 7px);
        }
      }
      .title_mobile_title{
        font-size: 16px;
        margin-top: auto;
        margin-bottom: auto;
      }
    }
    .titleRight {
      display: flex;
      align-items: center;
      .titleMenu {
        margin-left: 5px;
        width: 30px;
        img {
          width: 20px;
          height:20px;
          margin-left: 5px;
        }
      }
      .ivu-dropdown-rel {
        a {
          color: #fff;
        }
      }
      .project {
        span {
          margin-right: 10px;
          margin-left: 4px;
        }
      }
      .user {
        margin-left: 20px;
        padding-left: 20px;
        height: 80px;
        border-left: 1px solid #b2b1b1;
        display: flex;
        align-items: center;
        .ivu-dropdown-item {
          color: #000;
        }
        span {
          margin: 0 10px;
        }
      }
    }
  }
}
</style>