import { createRouter, createWebHistory } from 'vue-router';
import Catalog from '@/pages/Catalog.vue';
import Search from '@/pages/Search.vue';
import UserProfile from '@/pages/UserProfile.vue';
import MyTickets from '@/pages/MyTickets.vue';
import UserProfile2 from '@/pages/UserProfile2.vue';
import UserProfile3 from '@/pages/UserProfile3.vue';
import MyProfile from '@/pages/MyProfile.vue';
import Support from '@/pages/Support.vue'; 

const routes = [
  { path: '/', redirect: '/catalog' },
  { path: '/catalog', name: 'home', component: Catalog },
  { path: '/search', name: 'search', component: Search },
  { path: '/user/:id', name: 'user-profile', component: UserProfile },
  { path: '/user/juan/:id', name: 'user-profile-juan', component: UserProfile2 },
  { path: '/user/tech/:id', name: 'user-profile-tech', component: UserProfile3 },
  { path: '/my-tickets/:userId', name: 'my-tickets', component: MyTickets },
  { path: '/my-profile/:userId', name: 'my-profile', component: MyProfile },
  { path: '/support', name: 'support', component: Support },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});