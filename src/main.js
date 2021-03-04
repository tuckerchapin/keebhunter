import Vue from 'vue';
import Parse from 'parse';
import router from '@/router';
import store from '@/store';
import VModal from 'vue-js-modal';
import {
  Tag,
  Product,
  Tagline,
  KeyboardArt,
  User,
  Flag,
} from '@/lib';
import App from '@/App.vue';

Vue.config.productionTip = false;
Parse.serverURL = process.env.VUE_APP_PARSE_URL;
Parse.initialize(
  process.env.VUE_APP_PARSE_ID,
  process.env.VUE_APP_PARSE_KEY,
);

Parse.Object.registerSubclass('Tagline', Tagline);
Parse.Object.registerSubclass('KeyboardArt', KeyboardArt);
Parse.Object.registerSubclass('Tags', Tag);
Parse.Object.registerSubclass('Products', Product);
Parse.Object.registerSubclass('User', User);
Parse.Object.registerSubclass('Flag', Flag);
Vue.prototype.$parse = Parse;
Vue.use(VModal);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
