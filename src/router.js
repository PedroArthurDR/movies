import { createRouter, createWebHistory } from 'vue-router';
import MainPage from './components/pages/MainPage.vue';
import MoviePage from './components/pages/MoviePage.vue';

const routes = [
  { path: '/', component: MainPage },
  { path: '/movie/:id',name: 'movie', component: MoviePage }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router