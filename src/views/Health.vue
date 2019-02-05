<template>
  <div class="page-health">
    <div class="page-health-content" v-if="!contentLoading">
      <div class="health-section" v-if="health.healthConditions.length > 0">
        <h4 class="health-section-head">
          Health Conditions
        </h4>
        <table class="table" v-for="healthCondition in health.healthConditions">
          <col span="1" class="headers">
          <tr>
            <th scope="row" colspan="2">{{ healthCondition.condition }}</th>
          </tr>
          <tr v-if="healthCondition.comment !== ''">
            <th scope="row">Comment</th>
            <td>{{ healthCondition.comment }}</td>
          </tr>
          <tr v-if="!isNaN(healthCondition.startDate)">
            <th scope="row">Start</th>
            <td>{{ healthCondition.startDate.toLocaleDateString() }}</td>
          </tr>
          <tr v-if="!isNaN(healthCondition.endDate)">
            <th scope="row">End</th>
            <td>{{  healthCondition.endDate.toLocaleDateString() }}</td>
          </tr>
        </table>
      </div>
      <div class="health-section" v-if="health.healthImmunizations.length > 0">
        <h4 class="health-section-head">
          Health Immunizations
        </h4>
        <table class="table" v-for="(healthImmunization, index) in health.healthImmunizations">
          <col span="1" class="headers">
          <tr>
            <th scope="row" colspan="2">{{ healthImmunization.name }}</th>
          </tr>
          <tr>
            <th scope="row">Compliance</th>
            <td>
              <font-awesome-icon icon="check" v-if="healthImmunization.compliant" />
              <font-awesome-icon icon="times" v-if="!healthImmunization.compliant" />
              {{ healthImmunization.complianceMessage }}
            </td>
          </tr>
          <tr data-toggle="collapse" v-bind:data-target="`#immunization-doses-${index}`" v-bind:aria-controls="`immunization-doses-${index}`" aria-expanded="false">
            <th scope="row">
              <font-awesome-icon icon="caret-right" class="collapse-icon" />
              Doses
            </th>
            <td>{{ healthImmunization.doses }}</td>
          </tr>
          <tr>
            <td colspan="2">
              <div class="collapse immunization-doses" v-bind:id="`immunization-doses-${index}`">
                <span class="immunization-dose" v-if="healthImmunization.immunizationDates.length == 0">
                  No Doses
                </span>
                <span class="immunization-dose" v-for="date in healthImmunization.immunizationDates">
                  {{ date.toLocaleDateString() }}
                </span>
              </div>
            </td>
          </tr>
        </table>
      </div>
    </div>
    <Loader class="content-loader" v-if="contentLoading" />
  </div>
</template>

<script>
  import Loader from "../components/Loader.vue";

  export default {
    name: "health",
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
        await this.$store.dispatch("data/getHealth");
        this.$store.commit("page/setContentLoading", false);
      }
    },
    computed: {
      health() {
        return this.$store.getters["data/health"];
      },
      contentLoading() {
        return this.$store.getters["page/contentLoading"];
      }
    }
  }
</script>

<style scoped>
  table {
    table-layout: fixed;
  }

  col {
    width: 40%;
  }

  .immunization-doses {
    padding: 0 1rem;
    flex-wrap: wrap;
  }

  .immunization-doses.show, .immunization-doses.collapsing {
    display: flex;
  }

  .immunization-doses > .immunization-dose {
    width: 100px;
  }

  .collapse-icon {
    transition: transform 0.35s ease;
  }

  [data-toggle="collapse"][aria-expanded="true"] .collapse-icon {
    transform: rotate(90deg);
  }
</style>
