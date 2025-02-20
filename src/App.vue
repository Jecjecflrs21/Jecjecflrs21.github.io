<template>
  <v-app :height="height">
    <Header @toggle-sheet="toggleSheet" />
    <div id="app">
      <HelloWorld v-if="showHelloWorld && !$route.path.includes('/register') && !$route.path.includes('/confirmation') && !$route.path.includes('/raffle') && !$route.path.includes('/INGCOdashboard')" />
      <router-view />
      <router-view v-if="$route.path.includes('/register')" name="ConfirmRegistration" />
    </div>
  </v-app>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue';
import Header from './components/Header.vue';
import './assets/css/scrollbar.css';

export default {
  components: {
    HelloWorld,
    Header,
  },
  name: 'App',
  data: () => ({
    sheet: false,
    showHelloWorld: true, // Initially set to true to show HelloWorld
  }),
  computed: {
    height() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return 220;
        case 'sm': return 400;
        case 'md': return 500;
        case 'lg': return 600;
        case 'xl': return 800;
      }
    },
  },
  methods: {
    toggleSheet() {
      if (this.$route.path.includes('/confirmation || /raffle')) {
        this.showHelloWorld = false; // Hide HelloWorld when confirm registration button is clicked on /confirmation route
      } else {
        this.sheet = !this.sheet;
        this.toggleHelloWorld();
      }
    },
    closeSheet() {
      this.sheet = false;
    },
    toggleHelloWorld() {
      this.showHelloWorld = !this.showHelloWorld; // Toggle the showHelloWorld flag
    },
  },
};
</script>
