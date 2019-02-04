<template>
  <div>
    <div class="error-wrapper">
      <h1 class="error-code display-1">404</h1>
      <div class="error-details">
        <h2 class="error-details-header">
          Not Found
        </h2>
        <h3 class="error-details-body font-weight-light">
          The page you're looking for was not found.
        </h3>
      </div>
    </div>
    <Copyright />
  </div>
</template>

<script>
  import Copyright from "./Copyright.vue";

  export default {
    name: "notfound",
    components: {
      Copyright
    }
  }
</script>

<style scoped>
  .error {
    text-align: center;
  }

  .error-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-wrap: wrap;
    justify-content: center;
  }

  .error-details {
    text-align: center;
  }

  .error-details-header {
    text-transform: uppercase;
  }

  @media (min-width: 992px) {
    .error-wrapper {
      flex-direction: row;
    }

    .error-details {
      margin-left: 3rem;
      text-align: left;
    }
  }
</style>
