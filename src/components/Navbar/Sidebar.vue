<template>
  <nav class="sidebar sidebar-offcanvas" v-bind:class="{open: offCanvasOpen}" v-on:toggleOffCanvas="this.offCanvasOpen = !this.offCanvasOpen">
    <ul class="nav">
      <li class="nav-item nav-profile">
        <div class="nav-link">
          <div class="user-wrapper">
            <img v-bind:src="'data:image/png;base64,' + childList.user.photo" class="profile-image" alt="Profile Image">
            <div class="text-wrapper">
              <p class="profile-name">{{ childList.user.name }}</p>
              <small class="profile-id text-muted">{{ childList.user.id }}</small>
            </div>
          </div>
          <button class="btn btn-primary btn-block" v-on:click="logout">Sign out</button>
        </div>
      </li>
      <li class="nav-item">
        <router-link class="nav-link" active-class="active" to="/profile">
          <font-awesome-icon icon="user" />
          <span class="nav-text">Profile</span>
        </router-link>
      </li>
      <li class="nav-item" v-if="childList.activeModules.calendar">
        <router-link class="nav-link" active-class="active" to="/calendar">
          <font-awesome-icon icon="calendar-alt" />
          <span class="nav-text">Calendar</span>
        </router-link>
      </li>
      <li class="nav-item" v-if="false">
        <router-link class="nav-link" active-class="active" to="/attendance">
          <font-awesome-icon icon="clipboard-check" />
          <span class="nav-text">Attendance</span>
        </router-link>
      </li>
      <li class="nav-item" v-if="childList.activeModules.schedule">
        <router-link class="nav-link" active-class="active" to="/schedule">
          <font-awesome-icon icon="list" />
          <span class="nav-text">Schedule</span>
        </router-link>
      </li>
      <li class="nav-item" v-if="childList.activeModules.gradebook">
        <router-link class="nav-link" active-class="active" to="/gradebook">
          <font-awesome-icon icon="book" />
          <span class="nav-text">Gradebook</span>
        </router-link>
      </li>
      <li class="nav-item" v-if="childList.activeModules.healthInfo">
        <router-link class="nav-link" active-class="active" to="/health">
          <font-awesome-icon icon="medkit" />
          <span class="nav-text">Health</span>
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script>
  export default {
    name: 'sidebar',
    computed: {
      offCanvasOpen() {
        return this.$store.getters["page/offCanvas"];
      },
      childList() {
        return this.$store.getters["data/childList"];
      }
    },
    methods: {
      logout() {
        this.$store.dispatch("user/logout");
      }
    }
  }
</script>

<style scoped>
  .sidebar-offcanvas {
    width: 250px;
    background-color: white;
    position: fixed;
    top: calc(50px + 0.625rem);
    bottom: 0;
    left: 100%;
    text-align: left;
    transform: translateX(0);
    transition: transform .3s ease-in-out;
    overflow-y: auto;
  }

  .sidebar-offcanvas.open {
    transform: translateX(-100%);
  }

  .nav {
    margin-top: 1rem;
  }

  .nav-item {
    width: 100%;
  }

  .nav-item .nav-link {
    padding: 16px 35px;
    color: #4a4a4a;
  }

  .nav .nav-item > .nav-link.active {
    color: #308ee0;
  }

  .nav-item:hover:not(.nav-profile) > .nav-link {
    background-color: #fafafa;
    color: #4a4a4a;
  }

  .nav-item:not(.nav-profile) > .nav-link {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .nav-item > .nav-link > .nav-text {
    width: 75%;
  }

  .user-wrapper {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  }

  .user-wrapper .profile-image {
    max-width: 100%;
    object-fit: cover;
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }

  .user-wrapper .text-wrapper {
    margin-left: 15px;
  }

  .user-wrapper .text-wrapper .profile-name {
    margin-bottom: 0;
  }

  @media (min-width: 992px) {
    .sidebar-offcanvas {
      position: absolute;
      left: 0;
    }

    .sidebar-offcanvas.open {
      transform: translateX(0);
    }
  }
</style>
