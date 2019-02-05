<template>
  <div class="page-gradebook">
    <div class="page-schedule-content" v-if="!contentLoading">
      <ul class="nav nav-tabs d-none d-lg-flex" role="navigation">
        <li class="nav-item" v-bind:key="reportPeriod.index" v-for="reportPeriod in grades.reportPeriods">
          <router-link class="nav-link" v-bind:class="{active: reportPeriod.name == grades.reportPeriod.name}" v-bind:to="'/gradebook/' + reportPeriod.index">{{ reportPeriod.name }}</router-link>
        </li>
      </ul>
      <div class="dropdown d-lg-none">
        <button class="btn btn-lg dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          Select report period
        </button>
        <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
          <router-link class="dropdown-item" v-bind:key="reportPeriod.index" v-for="reportPeriod in grades.reportPeriods" v-bind:class="{active: reportPeriod.name == grades.reportPeriod.name}" v-bind:to="'/gradebook/' + reportPeriod.index">{{ reportPeriod.name }}</router-link>
        </div>
      </div>
      <div class="alert alert-danger" role="alert" v-if="error">
        {{ error }}
      </div>
      <div class="gradebook" v-if="!error">
        <h4 class="border-bottom pb-2 mb-4">
          {{ grades.reportPeriod.name }} Grades
        </h4>
        <div class="gradebook-class" v-for="(course, index) in grades.courses">
          <div class="class-header">
            <h5>
              {{ course.period }}: {{ course.name }}
            </h5>
            <div class="class-details">
              <a v-bind:href="'mailto:' + course.teacher.email">{{ course.teacher.name }}</a>
              Room: {{ course.room }}
            </div>
          </div>
          <table class="table">
            <col span="1" class="col-markname">
            <tr v-for="mark in course.marks">
              <th scope="row">{{ mark.name }}</th>
              <td>{{ mark.calculatedScore }} ({{ mark.rawCalculatedScore.toFixed(1) }})</td>
            </tr>
          </table>
        </div>
      </div>
    </div>
    <Loader class="content-loader" v-if="contentLoading" />
  </div>
</template>

<script>
  import Loader from "../components/Loader.vue";

  export default {
    name: "gradebook",
    components: {
      Loader
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
        await this.$store.dispatch("data/getGrades", this.$route.params.period);
        this.$store.commit("page/setContentLoading", false);
      }
    },
    computed: {
      grades() {
        return this.$store.getters["data/grades"];
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

  .col-markname {
    width: 40%;
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
