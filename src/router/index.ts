import { createRouter, createWebHistory } from 'vue-router';
import Catalog from '@/pages/Catalog.vue';
import Search from '@/pages/Search.vue';
import UserProfile from '@/pages/UserProfile.vue';

const routes = [
  { path: '/', redirect: '/catalog' },
  { path: '/catalog', name: 'home', component: Catalog },
  { path: '/search', name: 'search', component: Search },
  { path: '/:id', name: 'user-profile', component: UserProfile }, 
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});