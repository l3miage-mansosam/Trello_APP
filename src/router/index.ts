import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import BoardPage from '../pages/BoardPage.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'board',
    component: BoardPage
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router