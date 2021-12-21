import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ViewUI from 'view-design';
import './config/apiRouter'
// import 'view-design/dist/styles/iview.css';
import './my-theme/index.less';
Vue.config.productionTip = false
Vue.use(ViewUI);
window.myVue = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
