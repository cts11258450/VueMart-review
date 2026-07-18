import { createRouter, createWebHashHistory } from "vue-router"

import HomeView from "../views/HomeView.vue"
import ProductView from "../views/ProductView.vue"
import CartView from "../views/CartView.vue"
import ProductDetailView from "../views/ProductDetailView.vue"
import CheckoutView from "../views/CheckoutView.vue"
import OrderSuccessView from "../views/OrderSuccessView.vue"
import NotFoundView from "../views/NotFoundView.vue"
import LoginView from "../views/LoginView.vue"
import MemberView from "../views/MemberView.vue"
import OrderHistoryView from "../views/OrderHistoryView.vue"
import OrderDetailView from "../views/OrderDetailView.vue"
import AdminProductsView from "../views/AdminProductsView.vue"
import RegisterView from "../views/RegisterView.vue"

import { useAuthStore } from "../stores/auth.js"

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      component: HomeView,
    },
    {
      path: "/product",
      component: ProductView,
    },
    {
      path: "/product/:id",
      component: ProductDetailView,
    },
    {
      path: "/cart",
      component: CartView,
    },
    {
      path: "/checkout",
      component: CheckoutView,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/member",
      component: MemberView,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/orders",
      component: OrderHistoryView,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/orders/:id",
      component: OrderDetailView,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/order-success/:id",
      component: OrderSuccessView,
    },
    {
      path: "/login",
      component: LoginView,
      meta: {
        guestOnly: true,
      },
    },
    {
      path: "/admin/products",
      name: "admin-products",
      component: AdminProductsView,
      meta: {
        requiresAuth: true,
        requiresAdmin: true,
      },
    },
    {
      path:"/register",
      component:RegisterView,
      meta:{
        guestOnly: true,
      }
    },
    {
      path: "/:pathMatch(.*)*",
      component: NotFoundView,
    },
  ],
})

router.beforeEach((to) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isLogin) {
    return {
      path: "/login",
      query: {
        redirect: to.fullPath
      }
    }
  }

  if(to.meta.requiresAdmin && !authStore.isAdmin){
    return "/"
  }

  if (to.meta.guestOnly && authStore.isLogin) {
    return "/"
  }
})

export default router

//不要一開始就在最外層寫：

// const authStore = useAuthStore()

// 因為 router/index.js 載入時，Pinia 可能還沒被 app.use(pinia) 安裝完成。

//你之前遇過這個錯誤：

//getActivePinia() was called but there was no active Pinia

//所以這次我們放在 beforeEach 裡，等路由真正執行守衛時再取得 store，會比較安全。

