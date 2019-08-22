<template>
  <div id="app">
    <router-view class="error" name="error" />
    <router-view class="main" />
  </div>
</template>

<script>
  export default {
    name: "app",
    watch: {
      $route() {
        this.$store.commit("page/setError", "");
      }
    }
  }
</script>

<style>
  * {
    box-sizing: border-box;
  }

  html, body, #app, .main {
    height: 100%;
    width: 100%;
    overflow-x: hidden;
  }

  #app {
    display: flex;
    align-items: center;
  }

  .page-body-wrapper {
    padding: 0 !important;
    margin: 0 !important;
  }

  .error {
    margin: auto;
  }

  .content {
    width: 100%;
    min-height: calc(100vh - 50px - 0.625rem);
    position: absolute;
    top: calc(50px + 0.625rem);
    left: 0;
    padding: 1rem;
    background-color: #f2f8f9;
  }

  @media (min-width: 992px) {
    .content {
      width: calc(100% - 250px);
      left: 250px;
      padding: 2rem;
    }
  }
</style>
