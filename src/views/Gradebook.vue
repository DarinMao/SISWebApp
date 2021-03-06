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
      <ErrorAlert v-bind:error="error" />
      <div class="gradebook" v-if="!error">
        <h4>
          {{ grades.reportPeriod.name }} Grades
        </h4>
        <a v-bind:href="'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(grades, undefined, 3))" v-bind:download="grades.reportPeriod.name + '.json'">Export</a>
        <div class="gradebook-class" v-for="(course, courseIndex) in grades.courses">
          <div class="class-header">
            <h5>
              <router-link v-bind:to="{name: 'gradebookMark', params: {period: grades.reportPeriod.index, course: courseIndex, mark: 0}}">
                {{ course.period }}: {{ course.name }}
              </router-link>
            </h5>
            <div class="class-details">
              <a v-bind:href="'mailto:' + course.teacher.email">{{ course.teacher.name }}</a>
              Room: {{ course.room }}
            </div>
          </div>
          <table class="table">
            <col span="1" class="col-markname">
            <tr v-bind:key="mark.name" v-for="(mark, markIndex) in course.marks">
              <th scope="row">{{ mark.name }}</th>
              <td>
                <router-link v-bind:to="{name: 'gradebookMark', params: {period: grades.reportPeriod.index, course: courseIndex, mark: markIndex}}">
                  {{ mark.calculatedScore }} ({{ mark.rawCalculatedScore.toFixed(1) }})
                </router-link>
              </td>
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
  import ErrorAlert from "../components/Error.vue";

  export default {
    name: "gradebook",
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
    margin-bottom: 1rem;
  }

  .nav-tabs .nav-link:not(.active), .dropdown-menu .dropdown-item:not(.active) {
    cursor: pointer;
  }

  .table {
    table-layout: fixed;
  }

  .gradebook-class {
    background-color: white;
    padding: 0.5rem;
    margin-top: 2px;
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
    font-size: 0.25rem;
  }

  @media (min-width: 992px) {
    .gradebook-class {
      padding: 1rem;
      margin-top: 1rem;
    }

    .class-header {
      flex-direction: row;
      justify-content: space-between;
    }

    .class-header .class-details {
      text-align: right;
    }
  }
</style>
