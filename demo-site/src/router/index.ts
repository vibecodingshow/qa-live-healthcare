import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import DemoPage from '../views/DemoPage.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/demo/:index',
    name: 'DemoPage',
    component: DemoPage,
    props: true
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router