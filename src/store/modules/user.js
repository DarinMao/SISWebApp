import StudentVUE from "../../api/sis";
import router from "../../router";

function initialState() {
  return {
    svue: new StudentVUE("", ""),
    loggedIn: false
  }
}

const state = initialState();

const getters = {
  loggedIn: state => {
    return state.loggedIn;
  }
}

const actions = {
  login({state, commit}, data) {
    commit("setSVUE",  new StudentVUE(data.user.username, data.user.password));
    commit("page/setEnableLogin", false, { root: true });
    return state.svue.authenticate()
      .then(() => {
        commit("setLoggedIn", true);
        router.push((data.next !== undefined) ? data.next : "/profile");
        if (data.persistLogin) {
          // yup, this is bad, I know that, please tell me to fix it AFTER sis adds user tokens
          // or when I feel like adding a server-side keystore
          localStorage.setItem("username", data.user.username)
          localStorage.setItem("password", data.user.password)
        }
      })
      .catch(e => {
        commit("page/setError", e.message, { root: true });
        commit("page/setEnableLogin", true, { root: true });
        localStorage.removeItem("username")
        localStorage.removeItem("password")
      });
  },
  logout({dispatch}) {
    dispatch("reset", null, { root: true });
    localStorage.removeItem("username")
    localStorage.removeItem("password")
    router.push("/login");
  }
}

const mutations = {
  reset (state) {
    const s = initialState()
    Object.keys(s).forEach(key => {
      state[key] = s[key]
    })
  },
  setSVUE(state, svue) {
    state.svue = svue;
  },
  setLoggedIn(state, loggedIn) {
    state.loggedIn = loggedIn;
  }
}

export default {
  namespaced: true,
  state, getters, actions, mutations
}
