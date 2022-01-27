import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  /*{
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: "/login",
    name: "Login",
    // component: Login,
    component: () => import('../views/login.vue')
  },*/
  {
    path: "/",
    name: "Main",
    // component: Login,
    component: () => import('../views/main.vue'),
    children: [
      /*
      {
        path: '',
        name: 'ProjectDescription2',
        component: () => import('../views/PDescription/index.vue')
      },
      */
      {
        path: '',
        name: 'ProjectDescription',
        component: () => import('../views/PDescription/index.vue')
      },
      {
        path: '/pdesc',
        name: 'ProjectDescription',
        component: () => import('../views/PDescription/index.vue')
      },
      {
        path: '/mapping',
        name: 'Mapping',
        component: () => import('../views/Mapping/index.vue')
      },
      {
        path: '/2DView',
        name: '2DView',
        component: () => import('../views/2Dview/index.vue')
      },
      {
        path: '/Noise',
        name: 'Noise',
        component: () => import('../views/Noise/index.vue')
      },
      {
        path: '/export',
        name: 'Export',
        component: () => import('../views/Export/index.vue')
      },
      {
        path: '/3DView',
        name: '3DView',
        component: () => import('../views/Ecology/index.vue')
      },
      {
        path: '/help',
        name: 'Help',
        component: () => import('../views/Help/index.vue')
      }
      //{
      //  path: '/feedback',
      //  name: 'Feedback',
      //  component: () => import('../views/Feedback/index.vue')
     // }
    ]
  }

]

const router = new VueRouter({
  routes
})

export default router
