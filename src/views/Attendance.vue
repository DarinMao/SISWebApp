<template>
  <div class="page-attendance">
    <div class="page-attendance-content">
      <h4 class="border-bottom pb-2 mb-4">
        Attendance
      </h4>
      <p>
        As of now, the only thing this page can do is load your data. If you are curious, here is all the data retrieved:
      </p>
      <pre>
{{ JSON.stringify(attendance, undefined, 2) }}
      </pre>
    </div>
    <Loader class="content-loader" v-if="contentLoading" />
  </div>
</template>

<script>
  import Loader from "../components/Loader.vue";
  import ErrorAlert from "../components/Error.vue";

  export default {
    name: "attendance",
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
        await this.$store.dispatch("data/getAttendance");
        this.$store.commit("page/setContentLoading", false);
      }
    },
    computed: {
      attendance() {
        return this.$store.getters["data/attendance"];
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
