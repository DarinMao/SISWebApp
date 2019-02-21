<template>
  <div class="page-schedule">
    <div class="page-schedule-content" v-if="!contentLoading">
      <ul class="nav nav-tabs d-none d-lg-flex" role="navigation">
        <li class="nav-item" v-bind:key="term.index" v-for="term in termList">
          <router-link class="nav-link" v-bind:class="{active: term.index == schedule.termIndex}" v-bind:to="{name: 'schedule', params: {term: term.index}}">{{ term.name }}</router-link>
        </li>
      </ul>
      <div class="dropdown d-lg-none">
        <button class="btn btn-lg dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          Select term
        </button>
        <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
          <router-link class="dropdown-item" v-bind:key="term.index" v-for="term in termList" v-bind:class="{active: term.index == schedule.termIndex}" v-bind:to="{name: 'schedule', params: {term: term.index}}">{{ term.name }}</router-link>
        </div>
      </div>
      <ErrorAlert v-bind:error="error" />
      <div class="class-schedule" v-if="!error">
        <div class="card" v-bind:key="course.period" v-for="course in schedule.classList">
          <h4 class="card-header">
            {{ course.period }}. {{ course.name }}
          </h4>
          <div class="card-body">
            <h5 class="card-title">
              Room {{ course.room }}
            </h5>
            <a v-bind:href="'mailto:' + course.teacher.email">{{ course.teacher.name }}</a>
          </div>
        </div>
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

  .card {
    margin-bottom: 1rem;
  }
</style>
