function initialState() {
  return {
    childList: {},
    student: {},
    schedule: {},
    termList: [],
    health: {},
    grades: {},
    calendar: {},
    attendance: {}
  }
}

const state = initialState();

const getters = {
  childList: state => {
    return state.childList;
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
  },
  calendar: state => {
    return state.calendar;
  },
  attendance: state => {
    return state.attendance;
  }
}

const actions = {
  clear({commit}) {
    commit("setActiveModules", {});
    commit("setStudent", {});
    commit("setSchedule", {});
    commit("setTermList", []);
  },
  getChildList({rootState, commit}) {
    return rootState.user.svue.getChildList()
      .then(childList => {
        commit("setChildList", childList);
      })
      .catch(e => {
        commit("page/setError", e.message, { root: true });
      });
  },
  getStudent({rootState, commit}) {
    return rootState.user.svue.getStudent()
      .then(student => {
        commit("setStudent", student);
      })
      .catch(e => {
        commit("page/setError", e.message, { root: true });
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
        commit("page/setError", e.message, { root: true });
      });
  },
  getHealth({state, rootState, commit}) {
    const healthVisits = state.childList.activeModules.healthVisits;
    const healthConditions = state.childList.activeModules.healthConditions;
    const healthImmunizations = state.childList.activeModules.healthImmunizations;
    return rootState.user.svue.getHealthInfo({healthVisits, healthConditions, healthImmunizations})
      .then(health => {
        commit("setHealth", health);
      })
      .catch(e => {
        commit("page/setError", e.message, { root: true });
      });
  },
  getGrades({rootState, commit}, period) {
    return rootState.user.svue.getGrades(period)
      .then(grades => {
        commit("setGrades", grades);
      })
      .catch(e => {
        commit("page/setError", e.message, { root: true });
      });
  },
  getCalendar({rootState, commit}, date) {
    return rootState.user.svue.getCalendar(date)
      .then(calendar => {
        commit("setCalendar", calendar);
      })
      .catch(e => {
        commit("page/setError", e.message, { root: true });
      })
  },
  getAttendance({rootState, commit}) {
    return rootState.user.svue.getAttendance()
      .then(attendance => {
        commit("setAttendance", attendance);
      })
      .catch(e => {
        commit("page/setError", e.message, { root: true });
      })
  }
}

const mutations = {
  reset (state) {
    const s = initialState()
    Object.keys(s).forEach(key => {
      state[key] = s[key]
    })
  },
  setChildList(state, childList) {
    state.childList = childList;
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
  },
  setCalendar(state, calendar) {
    state.calendar = calendar;
  },
  setAttendance(state, attendance) {
    state.attendance = attendance;
  }
}

export default {
  namespaced: true,
  state, getters, actions, mutations
}
