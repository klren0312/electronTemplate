import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '@/views/Layout.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [
      {
        path: '/',
        name: 'Home',
        component: () => import(/* webpackChunkName: "home" */ '../views/Home.vue')
      },
      {
        path: '/about',
        name: 'About',
        component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
      }
    ]
  },
  {
    path: '/single',
    name: 'Single',
    component: () => import(/* webpackChunkName: "single" */ '../views/Single.vue')
  },
  {
    path: '/update',
    name: 'Update',
    component: () => import(/* webpackChunkName: "update" */ '../views/Update.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
