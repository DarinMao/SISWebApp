<template>
  <div class="page-profile">
    <div class="page-profile-content" v-if="!contentLoading">
      <div class="profile-main">
        <img v-bind:src="'data:image/png;base64,' + student.photo" class="profile-image" alt="Profile Image">
        <ul class="profile-list">
          <li><h4>{{ childList.user.name }}</h4></li>
          <li>{{ childList.user.id }}</li>
          <li>Grade {{ childList.user.grade }}</li>
        </ul>
      </div>
      <div class="cards">
        <div class="card">
          <h4 class="card-header">
            Basic Information
          </h4>
          <div class="card-body">
            <table class="table">
              <col span="1" class="headers">
              <tr>
                <th scope="row">Full Name</th>
                <td>{{ student.name }}
                </td>
              </tr>
              <tr>
                <th scope="row">Birthday</th>
                <td>{{ student.birthdate.toLocaleDateString() }}</td>
              </tr>
              <tr>
                <th scope="row">Gender</th>
                <td>{{ student.gender }}</td>
              </tr>
              <tr>
                <th scope="row">School</th>
                <td>{{ student.school }}</td>
              </tr>
            </table>
          </div>
        </div>
        <div class="card">
          <h4 class="card-header">
            Contact Information
          </h4>
          <div class="card-body">
            <table class="table">
              <col span="1" class="headers">
              <tr>
                <th scope="row">Phone</th>
                <td>{{ student.phone }}</td>
              </tr>
              <tr>
                <th scope="row">Address</th>
                <td v-html="student.address"></td>
              </tr>
              <tr>
                <th scope="row">Email</th>
                <td>{{ student.email }}</td>
              </tr>
            </table>
          </div>
        </div>
        <div class="card">
          <h4 class="card-header">
            Emergency Contacts
          </h4>
          <div class="card-body">
            <table class="table" v-for="emergencyContact in student.emergencyContacts">
              <col span="1" class="headers">
              <tr>
                <th scope="row" colspan="2">{{ emergencyContact.name }}</th>
              </tr>
              <tr v-if="emergencyContact.homePhone !== ''">
                <th scope="row">Home</th>
                <td>{{ emergencyContact.homePhone }}</td>
              </tr>
              <tr v-if="emergencyContact.workPhone !== ''">
                <th scope="row">Work</th>
                <td>{{ emergencyContact.workPhone }}</td>
              </tr>
              <tr v-if="emergencyContact.otherPhone !== ''">
                <th scope="row">Other</th>
                <td>{{ emergencyContact.otherPhone }}</td>
              </tr>
            </table>
          </div>
        </div>
        <div class="card" v-if="student.physician.name != ''">
          <h4 class="card-header">
            Physician
          </h4>
          <div class="card-body">
            <table class="table">
              <col span="1" class="headers">
              <tr>
                <th scope="row" colspan="2">{{ student.physician.name }}</th>
              </tr>
              <tr v-if="student.physician.hospital !== ''">
                <th scope="row">Hospital</th>
                <td>{{ student.physician.hospital }}</td>
              </tr>
              <tr v-if="student.physician.phone !== ''">
                <th scope="row">Phone</th>
                <td>{{ student.physician.phone }}</td>
              </tr>
              <tr v-if="student.physician.extension !== ''">
                <th scope="row">Extension</th>
                <td>{{ student.physician.extension }}</td>
              </tr>
            </table>
          </div>
        </div>
        <div class="card" v-if="student.dentist.name != ''">
          <h4 class="card-header">
            Dentist
          </h4>
          <div class="card-body">
            <table class="table">
              <col span="1" class="headers">
              <tr>
                <th scope="row" colspan="2">{{ student.dentist.name }}</th>
              </tr>
              <tr v-if="student.dentist.office !== ''">
                <th scope="row">Office</th>
                <td>{{ student.dentist.office }}</td>
              </tr>
              <tr v-if="student.dentist.phone !== ''">
                <th scope="row">Phone</th>
                <td>{{ student.dentist.phone }}</td>
              </tr>
              <tr v-if="student.dentist.extension !== ''">
                <th scope="row">Extension</th>
                <td>{{ student.dentist.extension }}</td>
              </tr>
            </table>
          </div>
        </div>
        <div class="card" v-for="(customItemGroup, groupName) in student.customItemGroups">
          <h4 class="card-header">
            {{ groupName }}
          </h4>
          <div class="card-body">
            <table class="table">
              <col span="1" class="headers">
              <tr v-for="(value, key) in customItemGroup">
                <th scope="row">{{ key }}</th>
                <td>{{ value }}</td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>
    <Loader class="content-loader" v-if="contentLoading" />
  </div>
</template>

<script>
  import Loader from "../components/Loader.vue";

  export default {
    name: "profile",
    components: {
      Loader
    },
    computed: {
      childList() {
        return this.$store.getters["data/childList"];
      },
      student() {
        return this.$store.getters["data/student"];
      },
      contentLoading() {
        return this.$store.getters["page/contentLoading"];
      }
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
        await this.$store.dispatch("data/getStudent");
        this.$store.commit("page/setContentLoading", false);
      }
    }
  }
</script>

<style scoped>
  .page-profile-content {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .table {
    table-layout: fixed;
  }

  col {
    width: 40%;
  }

  .cards {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  .card {
    flex-basis: 100%;
    margin-bottom: 1rem;
  }

  .profile-main {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 1rem;
  }

  .profile-main h4 {
    word-break: break-all;
  }

  .profile-image {
    margin-right: 1rem;
  }

  .profile-list {
    list-style-type: none;
    margin: 0;
    padding: 0;
  }

  .profile-list .profile-name {
    font-weight: 700;
  }

  @media (min-width: 992px) {
    .page-profile-content {
      flex-direction: row;
    }
    .card {
      flex-basis: calc(50% - 0.5rem);
      min-width: 400px;
    }

    .cards {
      flex-basis: calc(100% - 120px - 1rem);
    }

    .profile-main {
      flex-direction: column;
      align-items: flex-start;
      flex-basis: 120px;
    }

    .profile-image {
      margin-right: 0;
      margin-bottom: 1rem;
    }
  }
</style>
