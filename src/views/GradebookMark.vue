<template>
  <div class="page-gradebookmark">
    <div class="page-gradebookmark-content" v-if="!contentLoading">
      <router-link class="btn btn-lg btn-light back-btn" v-bind:to="{name: 'gradebook', params: {period: grades.reportPeriod.index}}"><font-awesome-icon icon="angle-left" class="back-icon" />Back to gradebook</router-link>
      <h4>
        {{ grades.reportPeriod.name }} Grades - {{ grades.courses[course].name }}
      </h4>
      <ul class="nav nav-tabs d-none d-lg-flex" role="navigation">
        <li class="nav-item" v-bind:key="mark.name" v-for="(mark, index) in marks">
          <router-link class="nav-link" v-bind:class="{active: index == markIndex}" v-bind:to="{name: 'gradebookMark', params: {period: grades.reportPeriod.index, course: course, mark: index}}">{{ mark.name }}</router-link>
        </li>
      </ul>
      <div class="dropdown d-lg-none">
        <button class="btn btn-lg dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          Select mark
        </button>
        <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
          <router-link class="dropdown-item" v-bind:key="mark.name" v-for="(mark, index) in marks" v-bind:class="{active: index == markIndex}" v-bind:to="{name: 'gradebookMark', params: {period: grades.reportPeriod.index, course: course, mark: index}}">{{ mark.name }}</router-link>
        </div>
      </div>
      <ErrorAlert v-bind:error="error" />
      <div class="mark-summary">
        <h4 class="mark-summary-head">
          Grade Summary
        </h4>
        <p v-if="mark.gradeSummary.length == 0">
          No grade calculations posted.
        </p>
        <div class="calculation" v-bind:key="calculation.type" v-for="calculation in mark.gradeSummary">
          <h5>
            {{ calculation.type }}
          </h5>
          <table class="table">
            <col span="1" class="col-weight">
            <col span="1" class="col-points">
            <col span="1" class="col-weighted">
            <tr>
              <th scope="column">Weight</th>
              <th scope="column">Points</th>
              <th scope="column">Weighted</th>
            </tr>
            <tr>
              <td>{{ calculation.weightPercent.toFixed(2) }}%</td>
              <td>{{ calculation.points }} / {{ calculation.pointsPossible }}</td>
              <td>{{ calculation.weightedPercent.toFixed(2) }}%</td>
            </tr>
          </table>
        </div>
      </div>
      <div class="assignments">
        <h4 class="assignments-head">
          Assignments
        </h4>
        <p v-if="Object.keys(mark.assignments).length == 0">
          No grades posted.
        </p>
        <div class="assignment" v-bind:key="assignmentIndex" v-for="(assignment, assignmentIndex) in mark.assignments">
          <h5>
            {{ assignment.name }}
          </h5>
          <h6>
            {{ assignment.type }}
          </h6>
          <table class="table">
            <col span="1" class="col-date">
            <col span="1" class="col-points">
            <col span="1" class="col-weighted">
            <tr>
              <th scope="column">Date</th>
              <th scope="column">Points</th>
              <th scope="column">Score</th>
            </tr>
            <tr>
              <td>{{ assignment.date.toLocaleDateString() }}</td>
              <td>{{ assignment.points }}</td>
              <td>{{ assignment.score }}<br>{{ assignment.scoreType }}</td>
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
    name: "gradebookMark",
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
        if (typeof this.grades.reportPeriod == "undefined" || typeof this.grades.reportPeriods == "undefined" || (typeof this.grades.reportPeriod.index !== "undefined" && this.grades.reportPeriod.index !== this.period)) {
          await this.$store.dispatch("data/getGrades", this.period);
        }
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
      },
      period() {
        return this.$route.params.period;
      },
      course() {
        return this.$route.params.course;
      },
      mark() {
        return this.marks[this.markIndex];
      },
      markIndex() {
        return (typeof this.$route.params.mark !== "undefined") ? this.$route.params.mark : 0;
      },
      marks() {
        return this.grades.courses[this.course].marks;
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
  }

  .mark-summary {
    margin-bottom: 1rem;
  }

  .calculation, .assignment {
    background-color: white;
    padding: 1rem;
    margin-top: 1rem;
  }

  .col-weight, .col-points, .col-weighted {
    width: 33.333333%;
  }

  .back-btn {
    margin-bottom: 1rem;
  }

  .back-btn > .back-icon {
    margin-right: 0.5rem;
  }
</style>
