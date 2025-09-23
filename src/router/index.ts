import { createRouter, createWebHistory } from 'vue-router';
import Catalog from '@/pages/Catalog.vue';

const routes = [
  { path: '/', redirect: '/catalog' },
  { path: '/catalog', name: 'home', component: Catalog },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
