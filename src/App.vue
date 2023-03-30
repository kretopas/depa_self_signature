<template>
  <MainHeader />
  <router-view />
</template>

<script>
import MainHeader from '@/components/MainHeader.vue';
import EventBus from './common/EventBus';

export default {
  name: 'MainApp',
  components: {
    MainHeader
  },
  data() {
    return {
    }
  },
  methods: {
    logOut() {
      this.$store.dispatch('auth/logout');
      this.$store.push('/login');
    }
  },
  mounted() {
    EventBus.on("logout", () => {
      this.logOut()
    });
  },
  beforeUnmount() {
    EventBus.remove("logout");
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

.button-clear {
  margin-bottom: 5px;
}

.false-text {
  color: red;
}

.btn-right {
  float: right;
  margin: 10px;
}

.btn-left {
  float: left;
  margin: 10px;
}

.form-group {
  margin-left: 10px;
  margin-bottom: 10px;
}

.btn-block {
  margin-left: 20px;
}

/* nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
} */
</style>
