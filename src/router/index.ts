import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
    },
    {
      path: '/projects',
      name: 'Projects',
      component: () => import('../views/Projects.vue'),
    },
    {
      path: '/about',
      name: 'About',
      component: () => import('../views/About.vue'),
    },
    {
      path: '/contact',
      name: 'Contact',
      component: () => import('../views/Contact.vue'),
    },
  ],
});

export default router;
