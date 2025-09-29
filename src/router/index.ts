import { createRouter, createWebHistory } from 'vue-router';
import Catalog from '@/pages/Catalog.vue';
import Search from '@/pages/Search.vue';
import UserProfile from '@/pages/UserProfile.vue';
import MyTickets from '@/pages/MyTickets.vue';

const routes = [
  { path: '/', redirect: '/catalog' },
  { path: '/catalog', name: 'home', component: Catalog },
  { path: '/search', name: 'search', component: Search },
  { path: '/:id', name: 'user-profile', component: UserProfile },
  { path: '/my-tickets/:userId', name: 'my-tickets', component: MyTickets },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});