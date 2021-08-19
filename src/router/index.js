import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '../views/home.vue'
import loader from '../components/loader.vue'
Vue.use(VueRouter)



let routes = [
    
  
  { path: '/', component: Home },
  { path: '/loader', component: loader },
    
   ]
   
   const router = new VueRouter({
       mode: 'history',
     routes // short for `routes: routes`
   })


export default router
