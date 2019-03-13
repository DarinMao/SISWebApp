<template>
  <div class="page-calendar">
    <div class="page-calendar-content" v-if="!contentLoading">
      <h4>
        Calendar
      </h4>
      <p>
        As of now, the only thing this page can do is load your data. If you are curious, here is all the data retrieved:
      </p>
      <pre>
{{ JSON.stringify(calendar, undefined, 2) }}
      </pre>
    </div>
    <Loader class="content-loader" v-if="contentLoading" />
  </div>
</template>

<script>
import Loader from "../components/Loader.vue";
import ErrorAlert from "../components/Error.vue";

export default {
  name: "calendar",
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
      await this.$store.dispatch("data/getCalendar");
      this.$store.commit("page/setContentLoading", false);
    }
  },
  computed: {
    calendar() {
      return this.$store.getters["data/calendar"];
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
