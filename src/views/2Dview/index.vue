<template>
  <div class="subDetail">
    <div class="submenuTooltip" @click="closeSubMenu()"></div>
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
    <div class="subItem marginBottom10">
      <Button
        icon="ios-git-commit"
        long
        class="marginBottom10"
        @click="Measure"
      >
        Measure
      </Button>
      <span class="alertMsg" v-if="showMeasureResult">
        {{ this.measureResultInfo }}
      </span>
      <div v-if="$store.state.habitatMap">
        <div>
          <Button
            icon="ios-eye"
            long
            class="marginBottom10"
            @click="viewSpecies"
          >
            View Species
          </Button>
        </div>
        <div class="categoryList" v-if="$store.state.speciesMap">
          <h2>Categorys</h2>
          <div class="categoryItem">
            <i-switch
              v-model="checkAllCategory"
              size="small"
              @on-change="categoryChangeAll"
            />
            <img :src="'img/category/all.png'" alt="" />
            <span class="categoryItemText">All</span>
          </div>
          <div
            class="categoryItem"
            v-for="(item, key) in categoryObj"
            :key="key"
          >
            <i-switch
              v-model="item.checked"
              size="small"
              @on-change="categoryChange"
            />
            <img :src="'img/category/' + item.key + '.png'" alt="" />
            <span class="categoryItemText">{{ item.category }}</span>
          </div>
        </div>
        <div class="categoryList">
          <h2>Map Opacity</h2>
          <Slider
            v-model="mapOpacity"
            :step="0.1"
            :max="1"
            :min="0"
            @on-input="changeMapOpacity"
          ></Slider>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MapBox from "@/libs/myMapBox.js";
let categoryKey = {
  Flora: "flora",
  Avifauna: "avifauna",
  Butterflies: "butterflies",
  Mammals: "mammals",
  "Aquatic fauna": "aquaticFauna",
  Herpetofauna: "herpetofauna",
  "Intertidal communities": "intertidalCommunities",
  Odonata: "odonata",
};
//import x from ''
export default {
  data() {
    return {
      categoryList: [],
      categoryObj: null,
      checkAllCategory: true,
      showMeasureResult: true,
      measureResultInfo:
        "Please click the draw tool on the right side of the map to measure",
      mapOpacity: 1,
    };
  },
  methods: {
    init() {
      //this.$store.commit("updateShowSubMenu", true);
      this.$store.commit("updateShowBasemapSwitch", true);
      myVue.$on("species-data", this.getCategoryData);
      myVue.$on("click-map-species", this.clickSpeciesMap);
      myVue.$on("measure", this.updateMeasureResultInfo);
      myVue.$on("draw_delete", this.restore);
    },
    closeSubMenu() {
      this.$store.commit("updateShowSubMenu", false);
    },
    getCategoryData(list, status) {
      if (!list) {
        return;
      }
      if (!status) {
        this.checkCategory(list);
      }

      let categoryObj = {};
      let categoryList = this.categoryList;
      categoryList.splice(0, categoryList.length);
      for (let i = 0; i < list.length; i++) {
        let item = list[i];
        categoryList.push(item);
        if (!categoryObj[item.category]) {
          categoryObj[item.category] = {
            category: item.category,
            color: item.color,
            important: item.important,
            abbreviati: item.abbreviati,
            speciesid: item.speciesid,
            checked: true,
            key: categoryKey[item.category],
          };
        }
      }
      this.$set(this, "categoryObj", categoryObj);
      this.$store.commit("updateSpeciesStatus", true);
    },
    goMapping() {
      this.$router.push("mapping");
    },
    viewSpecies() {
      MapBox.addImportantSpecies();
      // show category
      this.showCategory = true;
    },
    checkCategory(list) {
      let temp = [];
      for (let i = 0; i < list.length; i++) {
        let row = list[i];
        if (row.important == "1") {
          temp.push({
            color: row.color,
            species: row.species,
            category: row.category,
            important: row.important,
            abbreviati: row.abbreviati,
            speciesid: row.speciesid,
          });
        }
      }
      this.$store.dispatch("updateSpeciesOfConservationImportance", temp);
    },
    categoryChange() {
      let categoryObj = this.categoryObj;
      let num = 0;
      let arr = [];
      let keys = Object.keys(categoryObj);
      for (let k in categoryObj) {
        let item = categoryObj[k];
        if (item.checked) {
          num++;
          arr.push(item);
        }
      }
      if (num === keys.length) {
        this.checkAllCategory = true;
      } else {
        this.checkAllCategory = false;
      }
      this.getMapBoxCategory(arr);
      this.updateSpeciesImportantLegend(arr);
    },
    categoryChangeAll() {
      let status = this.checkAllCategory;
      let categoryObj = this.categoryObj;
      let arr = [];
      for (let k in categoryObj) {
        let item = categoryObj[k];
        item.checked = status;
        if (status) {
          arr.push(item);
        }
      }
      this.$set(this, "categoryObj", categoryObj);
      this.getMapBoxCategory(arr);
    },
    updateSpeciesImportantLegend(arr) {
      let obj = {},
        importantArr = [];
      for (let i = 0; i < arr.length; i++) {
        obj[arr[i].category] = arr[i].category;
      }
      let categoryList = this.categoryList;
      for (let j = 0; j < categoryList.length; j++) {
        let item = categoryList[j];
        if (item.important && obj[item.category]) {
          importantArr.push(item);
        }
      }
      this.$store.dispatch(
        "updateSpeciesOfConservationImportance",
        importantArr
      );
    },
    getMapBoxCategory(arr) {
      // update legend species list
      this.updateSpeciesImportantLegend(arr);
      MapBox.categorysFilte(arr);
    },
    // click map callback function
    clickSpeciesMap(data) {
      this.$store.commit("updateSpeciesUnImportantStatus", true);
      let arr = [];
      for (let i = 0; i < data.length; i++) {
        let row = data[i];
        // if (row.important == "0") {
        //   arr.push(row);
        // }
        arr.push({
          color: "ffffff",
          species: "",
          category: row[2],
          important: "0",
          species: row[3],
        });
      }
      this.$store.dispatch("updateSpeciesOfConservationUnImportance", arr);
    },
    Measure(params) {
      MapBox.measure();
      this.showMeasureResult = true;
      this.measureResultInfo =
        "Please click the draw tool on the right side of the map to measure";
      this.$store.commit("updateMapDrawToolsShow", true);
    },
    updateMeasureResultInfo(params) {
      this.showMeasureResult = true;
      this.measureResultInfo = params;
    },
    restore() {
      this.updateMeasureResultInfo = "";
      this.showMeasureResult = false;
    },
    changeMapOpacity(opacity) {
      MapBox.switchTransparency(opacity);
    },
    closeSubMenu() {
      this.$store.commit("updateShowSubMenu", false);
    }
  },
  components: {},
  mounted() {
    this.init();
  },
};
</script>

<style lang='less'>
.subDetail {
  .categoryList {
    margin-top: 20px;
    h2 {
      border-bottom: 1px solid #b2b1b1;
      margin-bottom: 10px;
      padding-bottom: 10px;
    }
    .categoryItem {
      height: 30px;
      line-height: 30px;
      display: flex;
      align-items: center;
      img {
        width: 20px;
        height: auto;
        margin-left: 6px;
      }
      .categoryItemText {
        margin-left: 6px;
      }
    }
  }
}
.alertMsg {
  color: #ccc;
  padding: 10px 0 10px 10px;
  display: block;
}
.submenuTooltip {
  display: none;
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