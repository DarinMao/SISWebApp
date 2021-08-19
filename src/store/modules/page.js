function initialState() {
  return {
    pageLoading: false,
    contentLoading: false,
    offCanvas: false,
    enableLogin: true,
    stayLoggedIn: false,
    error: ""
  }
}

const state = initialState();

const getters = {
  pageLoading: state => {
    return state.pageLoading;
  },
  contentLoading: state => {
    return state.contentLoading;
  },
  offCanvas: state => {
    return state.offCanvas;
  },
  enableLogin: state => {
    return state.enableLogin;
  },
  error: state => {
    return state.error;
  }
}

const actions = {}

const mutations = {
  reset (state) {
    const s = initialState()
    Object.keys(s).forEach(key => {
      state[key] = s[key]
    })
  },
  setPageLoading(state, pageLoading) {
    state.pageLoading = pageLoading;
  },
  setContentLoading(state, contentLoading) {
    state.contentLoading = contentLoading;
  },
  setOffCanvas(state, offCanvas) {
    state.offCanvas = offCanvas;
  },
  toggleOffCanvas(state) {
    state.offCanvas = !state.offCanvas;
  },
  setEnableLogin(state, enableLogin) {
    state.enableLogin = enableLogin;
  },
  setError(state, error) {
    state.error = error;
  }
}

export default {
  namespaced: true,
  state, getters, actions, mutations
}
