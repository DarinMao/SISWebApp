<template>
  <div>
    <form class="form-signin text-center" v-on:submit.prevent="signin" v-if="!error || error == 'Invalid user id or password'">
      <img src="../assets/signin.png" alt="StudentVUE" class="mb-3">
      <h1 class="h3 mb-3 font-weight-normal">Sign In</h1>
      <label for="inputEmail" class="sr-only">Username</label>
      <input type="text" id="inputEmail" class="form-control" v-bind:class="{'is-invalid': error}" placeholder="Username" required autofocus v-model="user.username" v-bind:disabled="!enableLogin">
      <label for="inputPassword" class="sr-only">Password</label>
      <input type="password" id="inputPassword" class="form-control" v-bind:class="{'is-invalid': error}" v-bind:placeholder="(error)?error:'Password'" required v-model="user.password" v-bind:disabled="!enableLogin">
      <button class="btn btn-lg btn-primary btn-block" type="submit" v-bind:disabled="!enableLogin">Sign in</button>
      <Copyright />
    </form>
    <div class="system-error" v-if="error && error !== 'Invalid user id or password'">
      <font-awesome-icon icon="exclamation-triangle" class="fa-2x" />
      <div class="system-error-text">
        {{ error }}
      </div>
    </div>
    <a href="https://github.com/DarinMao/SISWebApp" class="github-corner" aria-label="View source on GitHub"><svg width="80" height="80" viewBox="0 0 250 250" style="fill:#151513; color:#fff; position: absolute; top: 0; border: 0; right: 0;" aria-hidden="true"><path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path><path d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2" fill="currentColor" style="transform-origin: 130px 106px;" class="octo-arm"></path><path d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z" fill="currentColor" class="octo-body"></path></svg></a>
  </div>
</template>

<script>
  import Copyright from "../components/Copyright.vue";

  export default {
    name: "signin",
    components: {
      Copyright
    },
    props: ["next"],
    data() {
      return {
        user: {
          username: "",
          password: ""
        }
      }
    },
    created() {
      if (this.loggedIn) {
        this.$router.replace((this.next !== undefined) ? this.next : "/profile");
      }
    },
    computed: {
      loggedIn() {
        return this.$store.getters["user/loggedIn"];
      },
      enableLogin() {
        return this.$store.getters["page/enableLogin"];
      },
      error() {
        return this.$store.getters["page/error"];
      }
    },
    methods: {
      signin() {
        this.$store.dispatch("user/login", {user: this.user, next: this.next})
          .then(() => {
            this.user.password = "";
          });
      }
    }
  }
</script>

<style scoped>
  .main {
    display: flex;
    align-items: center;
  }

  .system-error {
    font-size: 2rem;
    text-align: center;
  }

  .form-signin, .system-error {
    flex-direction: column;
    width: 100%;
    max-width: 330px;
    padding: 15px;
    margin: 0 auto;
  }

  .form-signin .form-control {
    position: relative;
    box-sizing: border-box;
    height: auto;
    padding: 10px;
    font-size: 16px;
    margin-bottom: 1rem;
  }

  .form-signin .form-control:focus {
    z-index: 2;
  }

  @keyframes octocat-wave {
    0%, 100%{
      transform:rotate(0);
    }
    20%, 60% {
      transform:rotate(-25deg);
    }
    40%, 80% {
      transform:rotate(10deg);
    }
  }

  @media (min-width: 992px) {
    .github-corner:hover .octo-arm {
      animation: octocat-wave 560ms ease-in-out;
    }
  }
</style>
