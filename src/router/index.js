import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store/index'

Vue.use(VueRouter)

const routes = [
  { path: '/reg', component: () => import('@/views/Reg/Reg.vue') },
  { path: '/login', component: () => import('@/views/Login/Login.vue') },
  {
    path: '/',
    component: () => import('@/views/Main/Main.vue'),
    redirect: '/home',
    children: [
      { path: 'home', component: () => import('@/views/Menus/Home/Home.vue') }
    ]
  }
]

const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {
  const whiteList = ['/login', '/reg']
  const token = store.state.user.token
  if (!token && !whiteList.includes(to.path)) {
    Vue.prototype.$message.error('请先登录')
    next('/login')
  } else {
    next()
  }
})
export default router
