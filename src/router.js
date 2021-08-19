import Vue from "vue";
import Router from "vue-router";
import Page from "./views/Page.vue";
import Signin from "./views/Signin.vue";
import Profile from "./views/Profile.vue";
import Calendar from "./views/Calendar.vue";
import Attendance from "./views/Attendance.vue";
import Schedule from "./views/Schedule.vue";
import Gradebook from "./views/Gradebook.vue";
import GradebookMark from "./views/GradebookMark.vue";
import Health from "./views/Health.vue";
import NotFound from "./components/NotFound.vue";

Vue.use(Router)

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      redirect: "/profile",
      name: "page",
      component: Page,
      children: [
        {
          path: "profile",
          name: "profile",
          component: Profile
        },
        {
          path: "calendar",
          name: "calendar",
          component: Calendar
        },
        {
          path: "attendance",
          name: "attendance",
          component: Attendance
        },
        {
          path: "schedule/:term?",
          name: "schedule",
          component: Schedule
        },
        {
          path: "gradebook/:period(\\d)?",
          name: "gradebook",
          component: Gradebook
        },
        {
          path: "gradebook/:period(\\d)?/course/:course(\\d)/:mark(\\d)?",
          name: "gradebookMark",
          component: GradebookMark
        },
        {
          path: "health",
          name: "health",
          component: Health
        }
      ]
    },
    {
      path: "/login",
      name: "login",
      component: Signin,
      props: (route) => ({ next: route.query.next })
    },
    {
      path: "*",
      name: "notFound",
      components: {
        error: NotFound
      }
    }
  ]
})
