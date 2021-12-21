import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    showBasemapSwitch: true,
    showSubMenu: false,
    showMap: true,
    username: "",
    loading: false,
    habitatMap: false,
    speciesMap: false,
    mapDrawToolsShow: false,
    speciesUnImportantMap: false,
    speciesOfConservationImportance: [],
    speciesOfConservationUnImportance: [],
    ecologyMenu: false,
    ecologySub1Layer:[false,false,false,false,false,false],
    ecologySub1Layer1: false,
    ecologySub1Layer2: false,
    ecologySub1Layer3: false,
    ecologySub1Layer4: false,
    ecologySub1Layer5: false,
    ecologySub2Point: 1,
    ecologySub3Point: 1,
    surveyLocationOn: false,
    habitatMapOn: false,
    sitesConservationOn: false,
    assessment500mOn: false,
    ecologySub2and3On: false,
    ecologySub2_1:false,
    ecologySub2_2:false,
    ecologySub2_3:false,
    ecologySub2_4:false,
    ecologySub2_5:false,
    ecologySub2_6:false,
    ecologySub2_7:false,
    ecologySub2_8:false,
    ecologySub2_9:false,
    ecologySub2_10:false,
    ecologySub2_11:false,
    ecologySub2_12:false,
    pDescYear1On: false,
    pDescYear2On: false,
    pDescYear3On: false,
    pDescYear4On: false,
    pDescSub2Point1On: false,
    pDescSub2Point2On: false,
    noiseOn: false,
    noiseLeqdayBuilding1On: false,
    noiseLeqnightBuilding1On: false,
    noiseLmaxnightBuilding1On: false,
    language: 1 //1 = English, 2 = Chinese
  },
  mutations: {
    updateShowBasemapSwitch(state, value) {
      state.showBasemapSwitch = value;
    },
    updateShowSubMenu(state, value) {
      state.showSubMenu = value;
    },
    updateUserName(state, value) {
      state.username = value;
    },
    updateShowMap(state, value) {
      state.showMap = value;
    },
    updateLoading(state, value) {
      state.loading = value;
    },
    updateMapDrawToolsShow(state, value) {
      state.mapDrawToolsShow = value;
    },
    updateHabitatMapStatus(state, value) {
      state.habitatMap = value;
    },
    updateSpeciesStatus(state, value) {
      state.speciesMap = value;
    },
    updateSurveyLocationOn(state, value) {
      state.surveyLocationOn = value;
    },
    updateHabitatMapOn(state, value) {
      state.habitatMapOn = value;
    },
    updateSitesConservationOn(state, value) {
      state.sitesConservationOn = value;
    },
    updateAssessment500mOn(state, value) {
      state.assessment500mOn = value;
    },
    updateEcologySub2and3On(state, value) {
      state.ecologySub2and3On = value;
    },
    updateEcologySub2_1(state, value) {
      state.ecologySub2_1 = value;
    },
    updateEcologySub2_2(state, value) {
      state.ecologySub2_2 = value;
    },
    updateEcologySub2_3(state, value) {
      state.ecologySub2_3 = value;
    },
    updateEcologySub2_4(state, value) {
      state.ecologySub2_4 = value;
    },
    updateEcologySub2_5(state, value) {
      state.ecologySub2_5 = value;
    },
    updateEcologySub2_6(state, value) {
      state.ecologySub2_6 = value;
    },
    updateEcologySub2_7(state, value) {
      state.ecologySub2_7 = value;
    },
    updateEcologySub2_8(state, value) {
      state.ecologySub2_8 = value;
    },
    updateEcologySub2_9(state, value) {
      state.ecologySub2_9 = value;
    },
    updateEcologySub2_10(state, value) {
      state.ecologySub2_10 = value;
    },
    updateEcologySub2_11(state, value) {
      state.ecologySub2_11 = value;
    },
    updateEcologySub2_12(state, value) {
      state.ecologySub2_12 = value;
    },
    updateSpeciesUnImportantStatus(state, value) {
      state.speciesUnImportantMap = value;
    },
    changeEcologySub2and3On(state){
      state.ecologySub2and3On = true;
    },
    changeEcologySub2and3Off(state){
      state.ecologySub2and3On = false;
    },
    changeLanguageToEnglish(state) {
      state.language = 1;
    },
    changeLanguageToChinese(state) {
      state.language = 2;
    },
    updatePDescYearOff(state)
    {
      state.pDescYear1On = false;
      state.pDescYear2On = false;
      state.pDescYear3On = false;
      state.pDescYear4On = false;
    },
    updatePDescYearOn(state, yearId)
    {
      if (yearId == 1) {
        state.pDescYear1On = true;
      }
      else if (yearId == 2) {
        state.pDescYear2On = true;
      }
      else if (yearId == 3) {
        state.pDescYear3On = true;
      }
      else if (yearId == 4) {
        state.pDescYear4On = true;
      }
    },
    updatePDescSub2Point1(state,value)
    {
      state.pDescSub2Point1On = value;
    },
    updatePDescSub2Point2(state,value)
    {
      state.pDescSub2Point2On = value;
    },
    updatePDescSub3Point1(state,value)
    {
      state.pDescYear1On = value;
    },
    updatePDescSub3Point2(state,value)
    {
      state.pDescYear2On = value;
    },
    updatePDescSub3Point3(state,value)
    {
      state.pDescYear3On = value;
    },
    updatePDescSub3Point4(state,value)
    {
      state.pDescYear4On = value;
    },
    updateSpeciesOfConservationImportance(state, arr) {
      let speciesOfConservationImportance = state.speciesOfConservationImportance;
      speciesOfConservationImportance.splice(0, speciesOfConservationImportance.length);
      arr.map(item => {
        speciesOfConservationImportance.push(JSON.parse(JSON.stringify(item)));
      });
    },
    updateSpeciesOfConservationUnImportance(state, arr) {
      let speciesOfConservationUnImportance = state.speciesOfConservationUnImportance;
      speciesOfConservationUnImportance.splice(0, speciesOfConservationUnImportance.length);
      arr.map(item => {
        speciesOfConservationUnImportance.push(JSON.parse(JSON.stringify(item)));
      });
    },
    updateEcologyMenu(state, value) {
      state.ecologyMenu = value;
    },
    updateEcologySub1Layer(state, arr){
      state.ecologySub1Layer = arr;
    },
    updateEcologySub1LayerValue(state, {arrIndex, value}){
      state.ecologySub1Layer[arrIndex] = value;
    },
    updateEcologySub1Layer1(state, value){
      state.ecologySub1Layer1 = value;
    },
    updateEcologySub1Layer2(state, value){
      state.ecologySub1Layer2 = value;
    },
    updateEcologySub1Layer3(state, value){
      state.ecologySub1Layer3 = value;
    },
    updateEcologySub1Layer4(state, value){
      state.ecologySub1Layer4 = value;
    },
    updateEcologySub1Layer5(state, value){
      state.ecologySub1Layer5 = value;
    },
    updateEcologySub2Point(state, value) {
      state.ecologySub2Point = value;
    },
    updateEcologySub3Point(state, value) {
      state.ecologySub3Point = value;
    },
    updateNoise(state,value)
    {
      state.noiseOn = value;
    },
    updateNoiseLeqdayBuilding1(state,value)
    {
      state.noiseLeqdayBuilding1On = value;
    },
    updateNoiseLeqnightBuilding1(state,value)
    {
      state.noiseLeqnightBuilding1On = value;
    },
    updateNoiseLmaxnightBuilding1(state,value)
    {
      state.noiseLmaxnightBuilding1On = value;
    }
  },
  actions: {
    updateSpeciesOfConservationImportance({ commit }, arr) {
      commit('updateSpeciesOfConservationImportance', arr)
    },
    updateSpeciesOfConservationUnImportance({ commit }, arr) {
      commit('updateSpeciesOfConservationUnImportance', arr)
    }
  },
  modules: {
  },
  getters: {
    getSpeciesData(state) {
      return state.speciesOfConservationImportance
    },
    getSpeciesUnImportantData(state) {
      return state.speciesOfConservationUnImportance
    },
    getEcologySub1LayerVisibility(state) {
      return state.ecologySub1Layer
    }
  }
})
