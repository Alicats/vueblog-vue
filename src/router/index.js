import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import BlogDetail from '../views/BlogDetail.vue'
import BlogEdit from '../views/BlogEdit.vue'
import Blogs from '../views/Blogs.vue'
import BackManage from '../views/back/BackManage'
import UserManage from '../views/back/user/UserManage'
import ProductManage from '../views/back/product/ProductManage'
import UserInfo from '../views/back/UserInfo'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Index',
    redirect: {name: "Blogs"}
  },
  {
    path: '/blogs',
    name: 'Blogs',
    component: Blogs
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/blog/add',
    name: 'BlogAdd',
    component: BlogEdit,
    meta: {
        requireAuth: true
    }
  },
  {
    path: '/blog/:blogId',
    name: 'BlogDetail',
    component: BlogDetail
  },
  {
    path: '/blog/:blogId/edit',
    name: 'BlogEdit',
    component: BlogEdit,
    meta: {
        requireAuth: true
    }
  },
  {
    path: '/back',
    name: 'BackManage',
    component: BackManage,
    meta: {
      requireAuth: true
    },
    children: [
      {
        path: '/userManage',
        name: 'UserManage',
        component: UserManage
      },
      {
        path: '/productManage',
        name: 'ProductManage',
        component: ProductManage
      },
      {
        path: '/userInfo',
        name: 'UserInfo',
        component: UserInfo
      }
    ]
  }

]

// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
