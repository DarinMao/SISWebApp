<template>
  <nav class="navbar navbar-expand-lg navbar-dark">
    <a class="navbar-brand" href="https://www.fcps.edu/" target="_blank">
      <img src="../../assets/brand_lg.png" class="d-none d-lg-inline">
      <img src="../../assets/brand_sm.png" class="d-lg-none">
    </a>

    <div class="navbar-menu-wrapper d-flex ml-auto">
      <ul class="navbar-nav">
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" id="alertsDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <font-awesome-layers class="fa-lg">
              <font-awesome-icon icon="bell" />
              <span class="fa-layers-counter fa-lg" v-if="districtEvents.length > 0">{{ districtEvents.length }}</span>
            </font-awesome-layers>
          </a>
          <div class="dropdown-menu dropdown-menu-right" aria-labelledby="alertsDropdown">
            <h4 class="dropdown-header">Alerts</h4>
            <a class="dropdown-item" v-for="districtEvent in districtEvents">{{ districtEvent.title }}</a>
          </div>
        </li>
        <li class="nav-item user-profile d-none d-lg-flex">
          <span class="profile-name">{{ student.name }}</span>
          <img v-bind:src="'data:image/png;base64,' + student.photo" class="profile-image" alt="Profile Image">
        </li>
      </ul>
    </div>

    <button class="navbar-toggler mx-3" v-on:click="toggleOffCanvas" type="button" data-toggle="offcanvas" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
  </nav>
</template>

<script>
  export default {
    name: 'navbar',
    methods: {
      toggleOffCanvas() {
        this.$store.commit("page/toggleOffCanvas");
      }
    },
    computed: {
      student() {
        return this.$store.getters["data/student"];
      },
      districtEvents() {
        return this.$store.getters["data/districtEvents"];
      }
    }
  }
</script>

<style scoped>
  a {
    cursor: pointer;
  }

  nav {
    padding: 0;
    height: calc(50px + 0.625rem);
    background-color: #5983e8;
    position: fixed;
    top: 0;
    width: 100%;
  }

  nav img {
    height: 50px;
    width: auto;
  }

  .navbar-brand {
    width: 75px;
    background-color: white;
    padding: 0.3125rem;
    text-align: center;
  }

  .navbar-nav {
    flex-direction: row;
    alin-items: center;
  }

  .nav-item {
    display: flex;
    align-items: center;
    margin-left: 1rem;
    margin-right: 1rem;
    color: white;
  }

  .nav-item .nav-link.dropdown-toggle {
    color: white !important;
  }

  .nav-item .dropdown-menu-right {
    position: absolute;
  }

  .user-profile .profile-image {
    margin-left: 0.5rem;
    width: 40px;
    height: 40px;
    object-fit: cover;
    border-radius: 50%;
  }


  @media (min-width: 992px) {
    .navbar-brand {
      width: 250px;
    }
  }
</style>
