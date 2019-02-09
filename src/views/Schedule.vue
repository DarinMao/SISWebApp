<template>
  <div class="page-schedule">
    <div class="page-schedule-content" v-if="!contentLoading">
      <ul class="nav nav-tabs d-none d-lg-flex" role="navigation">
        <li class="nav-item" v-bind:key="term.index" v-for="term in termList">
          <router-link class="nav-link" v-bind:class="{active: term.index == schedule.termIndex}" v-bind:to="'/schedule/' + term.index">{{ term.name }}</router-link>
        </li>
      </ul>
      <div class="dropdown d-lg-none">
        <button class="btn btn-lg dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          Select term
        </button>
        <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
          <router-link class="dropdown-item" v-bind:key="term.index" v-for="term in termList" v-bind:class="{active: term.index == schedule.termIndex}" v-bind:to="'/schedule/' + term.index">{{ term.name }}</router-link>
        </div>
      </div>
      <ErrorAlert v-bind:error="error" />
      <div class="class-schedule" v-if="!error">
        <h4 class="border-bottom pb-2 mb-4">
          {{ schedule.termName }} Schedule
        </h4>
        <table class="table">
          <col span="1" class="col-period">
          <col span="1" class="col-class">
          <col span="1" class="col-room">
          <thead>
            <tr>
              <th>Period</th>
              <th>Class</th>
              <th>Room</th>
            </tr>
          </thead>
          <tbody v-bind:key="course.period" v-for="course in schedule.classList">
            <tr>
              <th scope="row" rowspan="2">{{ course.period }}</th>
              <td>{{ course.name }}</td>
              <td>{{ course.room }}</td>
            </tr>
            <tr>
              <td colspan="2" class="small"><a v-bind:href="'mailto:' + course.teacher.email">{{ course.teacher.name }}</a></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <Loader class="content-loader" v-if="contentLoading" />
  </div>
</template>

<script>
  import Loader from "../components/Loader.vue";
  import ErrorAlert from "../components/Error.vue";

  export default {
    name: "schedule",
    components: {
      Loader,
      ErrorAlert
    },
    created() {
      this.fetch();
    },
    watch: {
      "$route": "fetch"
    },
    methods: {
      async fetch() {
        this.$store.commit("page/setContentLoading", true);
        if (this.termList.length == 0) {
          await this.$store.dispatch("data/getTermList");
        }
        await this.$store.dispatch("data/getSchedule", this.$route.params.term);
        this.$store.commit("page/setContentLoading", false);
      }
    },
    computed: {
      schedule() {
        return this.$store.getters["data/schedule"];
      },
      termList() {
        return this.$store.getters["data/termList"];
      },
      contentLoading() {
        return this.$store.getters["page/contentLoading"];
      },
      error() {
        return this.$store.getters["page/error"];
      }
    }
  }
</script>

<style scoped>
  .nav-tabs, .dropdown {
    margin-bottom: 2rem;
  }

  .nav-tabs .nav-link:not(.active), .dropdown-menu .dropdown-item:not(.active) {
    cursor: pointer;
  }

  .table {
    table-layout: fixed;
  }

  .col-period {
    width: 20%;
  }

  .col-class {
    width: 50%;
  }

  .col-room {
    width: 30%;
  }
</style>
