<template>
  <div class="max-w-full">
    <Navbar v-if="loggedIn && !pageLoading" />
    <div class="container-fluid page-body-wrapper" v-if="loggedIn && !pageLoading">
      <Sidebar />
      <router-view class="content" />
    </div>
    <Loader class="page-loader" v-if="pageLoading" />
  </div>
</template>

<script>
  import Navbar from "../components/Navbar/Navbar.vue";
  import Sidebar from "../components/Navbar/Sidebar.vue";
  import Loader from "../components/Loader.vue";

  export default {
    components: {
      Navbar,
      Sidebar,
      Loader
    },
    computed: {
      loggedIn() {
        return this.$store.getters["user/loggedIn"];
      },
      pageLoading() {
        return this.$store.getters["page/pageLoading"];
      }
    },
    methods: {
      checkLoggedIn() {
        if (!this.loggedIn) {
          this.$router.replace({ path: "/login", query: {next: this.$route.path}});
          return false;
        }
        return true;
      },
      async fetch() {
        this.$store.commit("page/setPageLoading", true);
        if (!this.checkLoggedIn()) {
          return;
        }
        await this.$store.dispatch("data/getChildList");
        this.$store.commit("page/setPageLoading", false);
      }
    },
    created() {
      this.fetch();
    },
    watch: {
      $route() {
        this.$store.commit("page/setOffCanvas", false);
      }
    }
  }
</script>

<style>
  .page-loader {
    z-index: 1030;
  }

  .navbar {
    z-index: 1000;
  }

  .sidebar {
    z-index: 999;
  }

  .content-loader {
    z-index: 700;
  }

  .content {
    z-index: 500;
  }
</style>
