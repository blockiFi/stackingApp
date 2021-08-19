import Vue from 'vue'
import App from './App.vue'
import router from './router';
import store from "./store";
Vue.config.productionTip = false
import VueToast from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
import vuetify from '@/plugins/vuetify' // path to vuetify export

Vue.use(VueToast , {position : 'top-right'});


Vue.component('topmenu', require('./components/topmenu.vue').default);
Vue.component('loader', require('./components/loader.vue').default);
Vue.component('vault', require('./components/vault.vue').default);
new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
}).$mount('#app')
