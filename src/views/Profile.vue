<template>
  <div class="page-profile">
    <div class="page-profile-content" v-if="!contentLoading">
      <div class="profile-head">
        <img v-bind:src="'data:image/png;base64,' + student.photo" class="profile-image" alt="Profile Image">
        <ul class="profile-list">
          <li><h4 class="profile-name">{{ student.name }}</h4></li>
          <li>{{ student.id }}</li>
          <li>Grade {{ student.grade }}</li>
          <li>{{ student.school }}</li>
        </ul>
      </div>
      <div class="profile-body">
        <div class="profile-section">
          <h4 class="profile-section-head">
            Basic Information
          </h4>
          <table class="table">
            <col span="1" class="headers">
            <tr>
              <th scope="row">Birthday</th>
              <td>{{ student.birthdate.toLocaleDateString() }}</td>
            </tr>
            <tr>
              <th scope="row">Gender</th>
              <td>{{ student.gender }}</td>
            </tr>
          </table>
        </div>
        <div class="profile-section">
          <h4 class="profile-section-head">
            Contact Information
          </h4>
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
        <div class="profile-section">
          <h4 class="profile-section-head">
            Emergency Contacts
          </h4>
          <table class="table" v-for="emergencyContact in student.emergencyContacts">
            <col span="1" class="headers">
            <tr>
              <th scope="row" colspan="2">{{ emergencyContact.name }}</th>
            </tr>
            <tr v-if="emergencyContact.homePhone !== ''">
              <th scope="row">Home Phone</th>
              <td>{{ emergencyContact.homePhone }}</td>
            </tr>
            <tr v-if="emergencyContact.workPhone !== ''">
              <th scope="row">Work Phone</th>
              <td>{{ emergencyContact.workPhone }}</td>
            </tr>
            <tr v-if="emergencyContact.otherPhone !== ''">
              <th scope="row">Other Phone</th>
              <td>{{ emergencyContact.otherPhone }}</td>
            </tr>
          </table>
        </div>
        <div class="profile-section" v-if="student.physician.name != ''">
          <h4 class="profile-section-head">
            Physician
          </h4>
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
        <div class="profile-section" v-if="student.dentist.name != ''">
          <h4 class="profile-section-head">
            Dentist
          </h4>
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
        <div class="profile-section" v-for="(customItemGroup, groupName) in student.customItemGroups">
          <h4 class="profile-section-head">
            {{ groupName }}
          </h4>
          <table class="table" style="word-wrap: break-word;">
            <col span="1" class="headers">
            <tr v-for="(value, key) in customItemGroup">
              <th scope="row">{{ key }}</th>
              <td>{{ value }}</td>
            </tr>
          </table>
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
  table {
    table-layout: fixed;
  }

  col {
    width: 30%;
  }

  .profile-section {
    background-color: white;
    padding: 1rem;
    margin-top: 1rem;
  }

  .profile-head {
    display: flex;
    align-items: flex-start;
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
</style>
