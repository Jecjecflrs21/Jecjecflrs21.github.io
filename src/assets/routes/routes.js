import { createRouter, createWebHistory } from 'vue-router';

import registration from '../../components/Registration.vue';
import HelloWorld from '../../components/HelloWorld.vue';

const routes = [
  {
    name: 'HelloWorld',
    path: '/',
    component: HelloWorld
  },
  {
    name: 'registration',
    path: '/register',
    component: registration
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
