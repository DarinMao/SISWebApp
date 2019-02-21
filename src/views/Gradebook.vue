<template>
  <div class="page-gradebook">
    <div class="page-gradebook-content" v-if="!contentLoading">
      <ul class="nav nav-tabs d-none d-lg-flex" role="navigation">
        <li class="nav-item" v-bind:key="reportPeriod.index" v-for="reportPeriod in grades.reportPeriods">
          <router-link class="nav-link" v-bind:class="{active: reportPeriod.name == grades.reportPeriod.name}" v-bind:to="{name: 'gradebook', params: {period: reportPeriod.index}}">{{ reportPeriod.name }}</router-link>
        </li>
      </ul>
      <div class="dropdown d-lg-none">
        <button class="btn btn-lg dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          Select report period
        </button>
        <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
          <router-link class="dropdown-item" v-bind:key="reportPeriod.index" v-for="reportPeriod in grades.reportPeriods" v-bind:class="{active: reportPeriod.name == grades.reportPeriod.name}" v-bind:to="{name: 'gradebook', params: {period: reportPeriod.index}}">{{ reportPeriod.name }}</router-link>
        </div>
      </div>
      <ErrorAlert v-bind:error="error" />
      <div class="gradebook" v-if="!error">
        <div class="card" v-bind:key="course.period" v-for="(course, courseIndex) in grades.courses">
          <router-link v-bind:to="{name: 'gradebookMark', params: {period: grades.reportPeriod.index, course: courseIndex}}" append>
            <h4 class="card-header">
              {{ course.period }}. {{ course.name }}
            </h4>
          </router-link>
          <div class="card-body">
            <h5 class="card-title">
              <a v-bind:href="'mailto:' + course.teacher.email">{{ course.teacher.name }}</a>
            </h5>
            <h6 class="card-subtitle">
              Room {{ course.room }}
            </h6>
            <table class="table">
              <col span="1" class="col-markname">
              <tr v-bind:key="mark.name" v-for="(mark, markIndex) in course.marks">
                <th scope="row">{{ mark.name }}</th>
                <td>
                  <router-link v-bind:to="{name: 'gradebookMark', params: {course: courseIndex, mark: markIndex}}" append>
                    {{ mark.calculatedScore }} ({{ mark.rawCalculatedScore.toFixed(1) }})
                  </router-link>
                </td>
              </tr>
            </table>
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
    margin-bottom: 2rem;
  }

  .table {
    table-layout: fixed;
    margin-top: 0.5rem;
  }

  .col-markname {
    width: 40%;
  }

  .gradebook {
    display: flex;
    flex-wrap: wrap;
  }

  .card {
    margin-bottom: 1rem;
    flex-basis: 100%;
  }

  .card > a, .card > a:hover {
    color: inherit;
  }

  @media (min-width: 992px) {
    .card {
      margin-right: 1rem;
      flex-basis: calc(25% - 1rem);
      min-width: 400px;
    }
  }
</style>
