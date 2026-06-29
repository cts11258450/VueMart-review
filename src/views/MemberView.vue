<script setup>
import { computed } from "vue"
import { RouterLink } from "vue-router"
import { useAuthStore } from "../stores/auth.js"
import { useOrderStore } from "../stores/order.js"

const authStore = useAuthStore()
const orderStore = useOrderStore()

const memberOrders = computed(() => {
  return orderStore.orders.filter((order) => {
    return order.userEmail === authStore.user?.email
  })
})

const orderCount = computed(() => {
  return memberOrders.value.length
})
</script>

<template>
  <section class="member-page">
    <div class="member-card">
      <h2>會員中心</h2>
      <p class="member-subtitle">
        這裡可以查看你的會員資料與訂單資訊
      </p>

      <div class="member-info">
        <div class="info-row">
          <span class="info-label">會員名稱</span>
          <span class="info-value">
            {{ authStore.user?.name }}
          </span>
        </div>

        <div class="info-row">
          <span class="info-label">Email</span>
          <span class="info-value">
            {{ authStore.user?.email }}
          </span>
        </div>

        <div class="info-row">
          <span class="info-label">我的訂單數量</span>
          <span class="info-value">
            {{ orderCount }} 筆
          </span>
        </div>
      </div>

      <div class="member-actions">
        <RouterLink to="/orders" class="orders-link">
          查看我的訂單
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.member-page {
  min-height: 70vh;
  padding: 48px 16px;
  background: #f5f7fb;
}

.member-card {
  max-width: 680px;
  margin: 0 auto;
  padding: 32px;
  border-radius: 20px;
  background: #ffffff;
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.12);
}

.member-card h2 {
  margin: 0;
  color: #111827;
  font-size: 30px;
  text-align: center;
}

.member-subtitle {
  margin: 12px 0 28px;
  color: #4b5563;
  text-align: center;
  line-height: 1.7;
}

.member-info {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 16px;
  border-radius: 14px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
}

.info-label {
  color: #374151;
  font-weight: 800;
}

.info-value {
  color: #111827;
  font-weight: 700;
  word-break: break-word;
}

.member-actions {
  margin-top: 28px;
  display: flex;
  justify-content: center;
}

.orders-link {
  display: inline-block;
  padding: 12px 18px;
  border-radius: 999px;
  color: #ffffff;
  background: #2563eb;
  font-weight: 800;
  text-decoration: none;
}

.orders-link:hover {
  background: #1d4ed8;
}

@media (max-width: 520px) {
  .member-card {
    padding: 24px;
  }

  .info-row {
    flex-direction: column;
    gap: 6px;
  }

  .orders-link {
    width: 100%;
    text-align: center;
  }
}
</style>