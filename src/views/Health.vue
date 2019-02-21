<template>
  <div class="page-health">
    <div class="page-health-content" v-if="!contentLoading">
      <ErrorAlert v-bind:error="error" />
      <div class="health-section" v-if="health.healthConditions.length > 0">
        <h4 class="health-section-head">
          Health Conditions
        </h4>
        <div class="cards">
          <div class="card" v-for="healthCondition in health.healthConditions">
            <div class="card-body">
              <h5 class="card-title">
                {{ healthCondition.condition }}
              </h5>
              <table class="table">
                <col span="1" class="headers">
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
          </div>
        </div>
      </div>
      <div class="health-section" v-if="health.healthImmunizations.length > 0">
        <h4 class="health-section-head">
          Health Immunizations
        </h4>
        <div class="cards">
          <div class="card" v-for="(healthImmunization, index) in health.healthImmunizations">
            <div class="card-body">
              <h5 class="card-title">
                {{ healthImmunization.name }}
              </h5>
              <table class="table">
                <col span="1" class="headers">
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
    name: "health",
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
        await this.$store.dispatch("data/getHealth");
        this.$store.commit("page/setContentLoading", false);
      }
    },
    computed: {
      childList() {
        return this.$store.getters["data/childList"];
      },
      health() {
        return this.$store.getters["data/health"];
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
  .table {
    table-layout: fixed;
    margin-bottom: 0;
  }

  col {
    width: 50%;
  }

  .cards {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  .card {
    margin-bottom: 1rem;
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

  @media (min-width: 992px) {
    .card {
      flex-basis: calc(50% - 0.5rem);
    }
  }
</style>
