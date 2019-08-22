<template>
  <div class="page-attendance">
    <div class="page-attendance-content" v-if="!contentLoading">
      <h4>
        Attendance
      </h4>
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
