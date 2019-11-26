import Vue from 'vue'
import App from './App.vue'
import store from './store'
import './styles/global.scss'
import VueRouter from 'vue-router'
import config from '@/config';
import axios from 'axios';

//pages
import Todos from './views/Todos'
import Login from './views/Login'

Vue.use(VueRouter);


Vue.config.productionTip = false


Object.assign(Vue.prototype, {
  $config: config, 
  $http: axios
});

var router = new VueRouter({
  routes:[
    {
      path:'/',
      component:Todos
    },
    {
      path:'/my',
      meta:{
        requireAuth:true
      },
      component:Todos
    },
    {
      path:'/login',
      component:Login
    }
  ]
});

router.beforeEach((to,from,next) => {
  //console.log("before router",to,from);
  //获取本地存储的token
  store.state.token = sessionStorage.getItem('token');
  //判断该路由是否需要登录
  if (to.meta.requireAuth) {
    if (store.state.token!=null && store.state.token !== "") {
      next();
    }else{
      //将跳转的路由path作为参数，登录成功后跳转到该路由
      next({
        path: '/login',
        query: {redirect: to.fullPath}  
      });
    }
  }else{
    next();
  }
});

// router.afterEach((to, from) => {
//   //路由结束调用
// });

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
