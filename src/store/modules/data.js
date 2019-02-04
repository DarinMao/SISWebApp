function initialState() {
  return {
    activeModules: {},
    districtEvents: {},
    student: {},
    schedule: {},
    termList: [],
    health: {},
    grades: {}
  }
}

const state = initialState();

const getters = {
  activeModules: state => {
    return state.activeModules;
  },
  districtEvents: state => {
    return state.districtEvents;
  },
  student: state => {
    return state.student;
  },
  schedule: state => {
    return state.schedule;
  },
  termList: state => {
    return state.termList;
  },
  health: state => {
    return state.health;
  },
  grades: state => {
    return state.grades;
  }
}

const actions = {
  clear({commit}) {
    commit("setActiveModules", {});
    commit("setStudent", {});
    commit("setSchedule", {});
    commit("setTermList", []);
  },
  getActiveModules({rootState, commit}) {
    return rootState.user.svue.getActiveModules()
      .then(activeModules => {
        commit("setActiveModules", activeModules);
      })
      .catch(e => {
        // idk what to do here, think of something later
      });
  },
  getDistrictEvents({rootState, commit}) {
    return rootState.user.svue.getDistrictEvents()
      .then(districtEvents => {
        commit("setDistrictEvents", districtEvents);
      })
      .catch(e => {
        // idk what to do here, think of something later
      });
  },
  getStudent({rootState, commit}) {
    return rootState.user.svue.getStudent()
      .then(student => {
        commit("setStudent", student);
      })
      .catch(e => {
        // idk what to do here, think of something later
      });
  },
  getSchedule({rootState, commit}, term) {
    return rootState.user.svue.getClassSchedule(term)
      .then(schedule => {
        commit("setSchedule", schedule);
      })
      .catch(e => {
        commit("page/setError", e.message, { root: true });
      })
  },
  getTermList({rootState, commit}) {
    return rootState.user.svue.getTermList()
      .then(termList => {
        commit("setTermList", termList);
      })
      .catch(e => {
        // idk what to do here, think of something later
      });
  },
  getHealth({state, rootState, commit}) {
    const healthVisits = state.activeModules.healthVisits;
    const healthConditions = state.activeModules.healthConditions;
    const healthImmunizations = state.activeModules.healthImmunizations;
    return rootState.user.svue.getHealthInfo({healthVisits, healthConditions, healthImmunizations})
      .then(health => {
        commit("setHealth", health);
      })
      .catch(e => {

      });
  },
  getGrades({rootState, commit}, period) {
    return rootState.user.svue.getGrades(period)
      .then(grades => {
        commit("setGrades", grades);
      })
      .catch(e => {
        
      });
  }
}

const mutations = {
  reset (state) {
    const s = initialState()
    Object.keys(s).forEach(key => {
      state[key] = s[key]
    })
  },
  setActiveModules(state, activeModules) {
    state.activeModules = activeModules;
  },
  setDistrictEvents(state, districtEvents) {
    state.districtEvents = districtEvents;
  },
  setStudent(state, student) {
    state.student = student;
  },
  setSchedule(state, schedule) {
    state.schedule = schedule;
  },
  setTermList(state, termList) {
    state.termList = termList;
  },
  setHealth(state, health) {
    state.health = health;
  },
  setGrades(state, grades) {
    state.grades = grades;
  }
}

export default {
  namespaced: true,
  state, getters, actions, mutations
}
