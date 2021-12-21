<template>
  <div class="subDetail">
    <div class="subItem marginBottom10">
      <div class="subTitle marginBottom10">Edit Project Extent</div>
      <div>
        <Button
          icon="ios-cloud-upload-outline"
          long
          class="marginBottom10"
          @click="showUploadForm"
        >
          Upload Project Extent
        </Button>
        <Button
          icon="ios-create-outline"
          long
          class="marginBottom10"
          @click="showMapDrawTools"
        >
          Draw Project Extent
        </Button>
        <span v-if="showDrawRemander && !selectArea" class="alertMsg">
          Please click the polygon draw tool on the right side of the map to
          draw a region
        </span>
      </div>
      <div class="subButton" v-if="selectArea">
        <Button
          long
          class="marginBottom10 optionBTn"
          type="primary"
          @click="showMapBufferForm"
        >
          Create buffer distance
        </Button>
        <Button
          type="primary"
          long
          class="marginBottom10 optionBTn"
          @click="ShowSpatialInformation"
        >
          Create habitat map
        </Button>
      </div>
    </div>
    <div
      class="subItem"
      v-if="completeSpaceCalculation || $store.state.habitatMap"
    >
      <div class="subTitle marginBottom10">Edit Habitat Extent</div>
      <Button
        type="primary"
        long
        class="marginBottom10 optionBTn"
        @click="SelectPolygonToEdit"
      >
        Select polygon to edit
      </Button>
      <div class="dataAttributeInformation" v-if="editHabitant">
        <div class="attrTitle">Data Attribute Information</div>
        <Form ref="attrForm" :model="attrForm" :rules="ruleAttr">
          <FormItem v-for="(item, key) in attrForm" :key="key" :label="key">
            <Input v-model="item.value"></Input>
          </FormItem>
          <FormItem>
            <Button
              type="primary"
              long
              class="marginBottom10 optionBTn"
              @click="saveAttrData"
            >
              Save
            </Button>
          </FormItem>
        </Form>
      </div>
    </div>
    <Modal v-model="showUpload" title="Upload Project Extent" footer-hide>
      <div class="uploadForm">
        <div class="marginBottom10">File</div>
        <Upload
          multiple
          type="drag"
          :action="uploadApi"
          :headers="uploadHeaders"
          :on-progress="onProgress"
          :on-success="onSuccess"
          :on-error="onError"
        >
          <div style="padding: 20px 0">
            <Icon
              type="ios-cloud-upload"
              size="52"
              style="color: #3399ff"
            ></Icon>
            <p>Click or drag files here to upload</p>
          </div>
        </Upload>
      </div>
    </Modal>
    <Modal v-model="showBuffer" title="Create buffer distance" footer-hide>
      <div class="uploadForm">
        <Form
          @submit.native.prevent="notSubmitForm"
          ref="bufferForm"
          :model="bufferForm"
          :rules="ruleValidate"
        >
          <FormItem prop="bufferNumber">
            <Input
              search
              enter-button="Enter"
              v-model="bufferForm.bufferNumber"
              placeholder="Please input a buffer distance in metres"
              @on-click="createBufferDistance"
              @on-blur="createBufferDistance"
            />
          </FormItem>
        </Form>
        <!-- <Input
          search
          enter-button="Enter"
          v-model="bufferNumber"
          placeholder="Please input a buffer distance in metres"
          @on-enter="createBufferDistance"
          @on-click="createBufferDistance"
          @on-blur="createBufferDistance"
        /> -->
      </div>
    </Modal>
  </div>
</template>

<script>
//import x from ''
import MapBox from "@/libs/myMapBox.js";
export default {
  data() {
    return {
      // is select area
      selectArea: false,
      // complete the space calculation
      completeSpaceCalculation: false,
      // is edit Habitant
      editHabitant: false,
      // show upload window
      showUpload: false,
      // show buffer window
      showBuffer: false,
      showDrawRemander: false,
      showHabitantExtentDetail: false,
      AreaFile: null,
      bufferForm: {
        bufferNumber: 0,
      },
      ruleValidate: {
        bufferNumber: [
          {
            required: true,
            pattern: /^[0-9]+$/,
            message: "Please enter a number",
            trigger: "change",
          },
          { validator: this.validateBufferNumber, trigger: "blur" },
        ],
      },
      uploadHeaders: {},
      attrForm: {},
      habitantData: null,
      ruleAttr: {
        id: [
          {
            required: true,
            message: "The item cannot be empty",
            trigger: "blur",
          },
        ],
        area: [
          {
            required: true,
            message: "The item cannot be empty",
            trigger: "blur",
          },
        ],
        description: [
          {
            required: true,
            message: "The item cannot be empty",
            trigger: "blur",
          },
        ],
      },
      uploadApi: APIROUTER.projecttextent.uploadjsonfile,
    };
  },
  computed: {},
  props: {},

  methods: {
    init() {
      this.$store.commit("updateShowSubMenu", true);
      this.$store.commit("updateShowBasemapSwitch", true);
      myVue.$on("draw_creat", this.drawCreat);
      myVue.$on("compute_complete", this.computeComplete);
      myVue.$on("select_intersect_polygon", this.selectIntersectPolygon);
    },
    drawCreat() {
      this.selectArea = true;
      this.showDrawRemander = false;
    },
    computeComplete() {
      // show Habitant edit button
      this.completeSpaceCalculation = true;
    },
    selectIntersectPolygon(obj) {
      this.$set(this, "habitantData", obj);
      this.editHabitant = true;
      let attrForm = {};
      for (let k in obj) {
        if (k != "st_asgeojson" && k != "userid" && k != "id")
          attrForm[k] = {
            lable: k,
            value: obj[k],
          };
      }
      this.$set(this, "attrForm", attrForm);
    },
    showUploadForm() {
      this.showUpload = true;
    },
    onProgress(event, file, fileList) {
      this.$store.commit("updateLoading", true);
    },
    onSuccess(res, file, fileList) {
      // 关闭弹窗
      this.showUpload = false;
      this.$store.commit("updateLoading", false);
      if (res && res.data && res.data[0] && res.data[0].st_asgeojson) {
        MapBox.uploadFile(res.data[0].st_asgeojson);
      } else {
        this.$Message.error({
          content: res.message,
          duration: 10,
        });
      }
    },
    onError(error, file, fileList) {
      this.$Message.error("File upload failed, please try again later");
    },
    showMapDrawTools() {
      this.showDrawRemander = true;
      this.$store.commit("updateMapDrawToolsShow", true);
      MapBox.addDraw();
    },
    showMapBufferForm() {
      this.showBuffer = true;
    },
    createBufferDistance() {
      let self = this;
      this.$refs.bufferForm.validate((valid) => {
        if (valid) {
          let bufferNumber = self.bufferForm.bufferNumber;
          MapBox.bufferAnalysis(bufferNumber);
          // 完成后关闭弹窗
          self.showBuffer = false;
        }
      });
    },
    notSubmitForm() {
      return false;
    },
    validateBufferNumber(rule, value, callback) {
      if (value === "") {
        callback(new Error("Please enter a number"));
      } else if (this.bufferForm.bufferNumber <= 0) {
        callback(new Error("Please enter a number greater than 0"));
      } else {
        callback();
      }
    },
    ShowSpatialInformation() {
      MapBox.getHabitatMap();
    },
    SelectPolygonToEdit() {
      MapBox.editPolygon();
    },
    saveAttrData() {
      let habitantAttrObj = JSON.parse(JSON.stringify(this.habitantData));
      for (let k in this.attrForm) {
        habitantAttrObj[k] = this.attrForm[k];
      }
      MapBox.updatePolygon(habitantAttrObj);
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
.subButton {
  margin-left: 20px;
}
.marginBottom10 {
  margin-bottom: 10px;
}
.subItem {
  .dataAttributeInformation {
    margin-top: 30px;
    .attrTitle {
      font-size: 18px;
      padding-bottom: 10px;
      margin-bottom: 10px;
      border-bottom: 1px solid @left_border_color;
    }
    .ivu-input {
      background-color: @input_background_color;
      color: #a0a6af;
      border: none;
    }
    input::-webkit-input-placeholder {
      color: @input_Placeholder_color;
    }
  }
}
.uploadForm {
  color: #000;
  padding: 10px;
}
.ivu-input,
.ive-message,
.ivu-message-notice-content,
.ivu-alert-message {
  color: #000;
}
.alertMsg {
  color: #ccc;
  padding: 10px 0 10px 10px;
  display: block;
}
</style>