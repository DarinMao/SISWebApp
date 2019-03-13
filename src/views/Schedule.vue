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
        <h4>
          {{ schedule.termName }} Schedule
        </h4>
        <div class="schedule-class" v-bind:key="course.period" v-for="course in schedule.classList">
          <div class="class-header">
            <h5>
              {{ course.period }}: {{ course.name }}
            </h5>
            <div class="class-details">
              <a v-bind:href="'mailto:' + course.teacher.email">{{ course.teacher.name }}</a>
              Room: {{ course.room }}
            </div>
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

  .schedule-class {
    background-color: white;
    padding: 1rem;
    margin-top: 1rem;
  }

  .class-header {
    display: flex;
    flex-direction: column;
  }

  .class-header .class-details {
    display: flex;
    flex-direction: column;
  }

  @media (min-width: 992px) {
    .class-header {
      flex-direction: row;
      justify-content: space-between;
    }

    .class-header .class-details {
      text-align: right;
    }
  }
</style>
