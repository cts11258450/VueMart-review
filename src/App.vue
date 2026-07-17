<script setup>
import { RouterLink, RouterView } from "vue-router"
import { useCartStore } from "./stores/cart.js"
import ToastList from "./components/ToastList.vue"
import { useAuthStore } from "./stores/auth.js"
import { handleShowToast } from "./utils/toastHelper.js"

const cartStore = useCartStore()
const authStore = useAuthStore()

const handleLogout = () => {
  const result = authStore.logout()
  handleShowToast(result)
}
</script>

<template>
  <div class="app">
    <header class="site-header">
      <div class="header-inner">
        <RouterLink to="/" class="logo">
          VueMart
        </RouterLink>

        <nav class="nav-links">
          <RouterLink to="/">
            首頁
          </RouterLink>

          <RouterLink to="/product">
            商品列表
          </RouterLink>

          <RouterLink to="/cart" class="cart-link">
            購物車
            <span v-if="cartStore.totalQty > 0" class="cart-badge">
              {{ cartStore.totalQty }}
            </span>
          </RouterLink>

          <RouterLink
            v-if="authStore.isLogin"
            to="/member"
          >
            會員中心
          </RouterLink>

          <RouterLink
            v-if="authStore.isLogin"
            to="/orders"
          >
            我的訂單
          </RouterLink>

          <RouterLink 
            v-if="authStore.isLogin" 
            to="/admin/products"
            class="nav-link"
          >
            <p>後臺管理</p>
          </RouterLink>

          <RouterLink
            v-if="!authStore.isLogin"
            to="/login"
            class="auth-link"
          >
            登入
          </RouterLink>

          <div v-else class="user-box">
            <span class="user-name">
              {{ authStore.user?.name }}
            </span>

            <button
              class="logout-button"
              type="button"
              @click="handleLogout"
            >
              登出
            </button>
          </div>
        </nav>
      </div>
    </header>

    <RouterView />

    <ToastList />
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  background-color: #f7f7f7;
  color: #222;
}

.site-header {
  position: sticky;
  top: 0;
  z-index: 20;
  border-bottom: 1px solid #eeeeee;
  background-color: rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(8px);
}

.header-inner {
  max-width: 1180px;
  margin: 0 auto;
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.logo {
  color: #222;
  font-size: 24px;
  font-weight: 800;
  text-decoration: none;
  white-space: nowrap;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
}

.nav-links a {
  position: relative;
  color: #333;
  text-decoration: none;
  font-weight: 700;
  padding: 8px 10px;
  border-radius: 999px;
}

.nav-links a:hover {
  background-color: #f0f0f0;
}

.nav-links a.router-link-active {
  background-color: #222;
  color: white;
}

.cart-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.cart-badge {
  min-width: 22px;
  height: 22px;
  padding: 0 7px;
  border-radius: 999px;
  background-color: #e53935;
  color: white;
  font-size: 13px;
  line-height: 22px;
  text-align: center;
}

.auth-link {
  color: #1d4ed8;
}

.user-box {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding-left: 4px;
}

.user-name {
  color: #111827;
  font-weight: 800;
  white-space: nowrap;
}

.logout-button {
  padding: 8px 12px;
  border: none;
  border-radius: 999px;
  color: #ffffff;
  background-color: #dc2626;
  font-weight: 700;
  cursor: pointer;
}

.logout-button:hover {
  background-color: #b91c1c;
}

@media (max-width: 768px) {
  .header-inner {
    padding: 14px 16px;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .logo {
    font-size: 22px;
  }

  .nav-links {
    width: 100%;
    gap: 8px;
  }

  .nav-links a {
    padding: 8px 10px;
    font-size: 14px;
  }

  .user-box {
    gap: 8px;
  }

  .user-name {
    font-size: 14px;
  }

  .logout-button {
    padding: 8px 10px;
    font-size: 14px;
  }
}

@media (max-width: 420px) {
  .nav-links {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  .nav-links a {
    text-align: center;
  }

  .cart-link {
    justify-content: center;
  }

  .user-box {
    justify-content: center;
    padding: 8px 10px;
    border-radius: 999px;
    background-color: #f3f4f6;
  }
}
</style>