import Vue from "vue";
import Vuex from "vuex";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faBell, faUser, faCalendarAlt, faClipboardCheck, faList, faBook, faMedkit, faCheck, faTimes, faCaretRight, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon, FontAwesomeLayers } from "@fortawesome/vue-fontawesome";


Vue.config.productionTip = true;
Vue.use(Vuex);

library.add(faBell);
library.add(faUser);
library.add(faCalendarAlt);
library.add(faClipboardCheck);
library.add(faList);
library.add(faBook);
library.add(faMedkit);
library.add(faCheck);
library.add(faTimes);
library.add(faCaretRight);
library.add(faExclamationTriangle);

Vue.component("font-awesome-icon", FontAwesomeIcon);
Vue.component("font-awesome-layers", FontAwesomeLayers);

new Vue({
  el: "#app",
  router,
  store,
  render: h => h(App)
});
