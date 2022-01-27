<template>
  <div class="login">
    <div class="title">
      <!-- <img src="img/arup-logo.png" alt="" /> -->
      <span>Environmental Intelligence System</span>
    </div>
    <div class="content">
      <div class="formBox">
        <div class="formTitle">Sign In</div>
        <Form ref="loginForm" :model="loginForm" :rules="loginValidate">
          <FormItem label="Username" prop="username">
            <Input
              v-model="loginForm.username"
              placeholder="Enter your name"
            ></Input>
          </FormItem>
          <FormItem label="Password" prop="password">
            <Input
              v-model="loginForm.password"
              type="password"
              placeholder="Enter your password"
            ></Input>
          </FormItem>
          <FormItem prop="password">
            <Checkbox v-model="loginForm.remeber"
              >Remember the password</Checkbox
            >
          </FormItem>
          <FormItem prop="password">
            <Button type="primary" long :loading="loading" @click="doLogin"
              >Sign in</Button
            >
          </FormItem>
        </Form>
      </div>
    </div>
  </div>
</template>

<script>
//import x from ''
export default {
  data() {
    return {
      loginForm: {
        username: "",
        password: "",
        remeber: false,
      },
      loginValidate: {
        username: [
          {
            required: true,
            message: "The name cannot be empty",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "The password cannot be empty",
            trigger: "blur",
          },
        ],
      },
      loading: false,
    };
  },
  computed: {},
  props: {},

  methods: {
    init() {
      let username = localStorage.getItem("username");
      let password = localStorage.getItem("password");
      let remeber = localStorage.getItem("remeber");
      this.loginForm.remeber = remeber === "true" ? true : false;
      if (remeber == "true") {
        this.loginForm.username = username || "";
        this.loginForm.password = password || "";
      }
    },
    doLogin() {
      let self = this;
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          self.loading = true;
          setTimeout(() => {
            if (self.loginForm.remeber == true) {
              localStorage.setItem("username", self.loginForm.username);
              localStorage.setItem("password", self.loginForm.password);
              localStorage.setItem(
                "remeber",
                self.loginForm.remeber.toString()
              );
            } else {
              localStorage.removeItem("username");
              localStorage.removeItem("password");
              localStorage.setItem("remeber", "false");
            }
            self.$store.commit("updateUserName", self.loginForm.username);
            sessionStorage.setItem("username", self.loginForm.username);
            self.$router.push("main");
            self.loading = false;
          }, 1000);
        }
      });
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
.login {
  text-align: left;
  .title {
    height: @title_height;
    width: 100%;
    background-color: @login_title_bj;
    padding-left: 20px;
    display: flex;
    align-items: center;
    img {
      width: 110px;
      height: auto;
    }
    span {
      margin-left: 20px;
      font-size: 32px;
      padding-left: 20px;
      border-left: 2px solid @left_border_color;
    }
  }
  .content {
    height: @content_height;
    display: flex;
    align-items: center;
    .formBox {
      margin: 0 auto;
      width: 467px;
      padding: 20px;
      border: 1px solid #fff;
      .formTitle,
      .ivu-form-item-label,
      .ivu-checkbox-default {
        color: #fff;
      }
      .formTitle {
        font-size: 30px;
        text-align: center;
        padding: 20px 0;
      }
      .ivu-input {
        background-color: @input_background_color;
        border: none;
      }
      input::-webkit-input-placeholder {
        color: @input_Placeholder_color;
      }
    }
  }
}
</style>