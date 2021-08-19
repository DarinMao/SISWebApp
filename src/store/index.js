import Vue from "vue";
import Vuex from "vuex";
import VuexPersist from "vuex-persist";


import page from "./modules/page";
import user from "./modules/user";
import data from "./modules/data";

Vue.use(Vuex);

const vuexStorage = new VuexPersist({
  storage: sessionStorage,
  reducer: (state) => ({user: state.user})
})

export default new Vuex.Store({
  modules: {
    page, user, data
  },
  actions: {
    reset({commit}) {
      commit("data/reset");
      commit("page/reset");
      commit("user/reset");
    }
  },
  plugins: [vuexStorage.plugin]
});
