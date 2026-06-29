<script setup>
import { computed } from "vue"
import { RouterLink } from "vue-router"

import { useOrderStore } from "../stores/order.js"
import { useAuthStore } from "../stores/auth.js"

import { formatPrice } from "../utils/formatPrice.js"
import { formatDate } from "../utils/formatDate.js"

const orderStore = useOrderStore()
const authStore = useAuthStore()

const getOrderTime = (order) => {
  if (!order.createdAt) {
    return 0
  }

  return new Date(order.createdAt).getTime()
}

const getPaymentText = (payment) => {
  if (payment === "credit-card") {
    return "信用卡付款"
  }

  if (payment === "atm") {
    return "ATM 轉帳"
  }

  if (payment === "cash-on-delivery") {
    return "貨到付款"
  }

  return "未知付款方式"
}

const orders = computed(() => {
  const memberOrders = orderStore.orders.filter((order) => {
    return order.userEmail === authStore.user?.email
  })

  return [...memberOrders].sort((a, b) => {
    return getOrderTime(b) - getOrderTime(a)
  })
})
</script>

<template>
  <section class="orders-page">
    <div class="orders-container">
      <div class="orders-header">
        <h2>我的訂單</h2>
        <p>查看你目前建立過的訂單紀錄</p>
      </div>

      <div v-if="orders.length === 0" class="empty-orders">
        <div class="empty-orders-icon">
          🧾
        </div>

        <p class="empty-label">
          Empty Orders
        </p>

        <h3>目前沒有訂單</h3>

        <p class="empty-description">
          你還沒有建立任何訂單。可以先前往商品列表挑選商品，
          或回首頁瀏覽推薦內容。
        </p>

        <div class="empty-actions">
          <RouterLink to="/product" class="primary-link">
            前往商品列表
          </RouterLink>

          <RouterLink to="/" class="secondary-link">
            回首頁
          </RouterLink>
        </div>
      </div>

      <div v-else class="order-list">
        <article
          v-for="order in orders"
          :key="order.id"
          class="order-card"
        >
          <div class="order-card-header">
            <div>
              <h3>訂單編號：{{ order.id }}</h3>

              <p class="order-customer">
                訂購人：{{ order.customer.name }}
              </p>

              <p class="order-date">
                成立時間：{{ formatDate(order.createdAt) }}
              </p>

              <p class="order-payment">
                付款方式：{{ getPaymentText(order.payment) }}
              </p>

              <p class="order-qty">
                商品數量：{{ order.totalQty }} 件
              </p>
            </div>

            <span class="order-status">
              已成立
            </span>
          </div>

          <div class="order-items">
            <div
              v-for="item in order.items"
              :key="item.id"
              class="order-item"
            >
              <img
                :src="item.image"
                :alt="item.name"
                class="order-item-image"
              >

              <div class="order-item-info">
                <h4>{{ item.name }}</h4>
                <p>
                  {{ formatPrice(item.price) }} × {{ item.qty }}
                </p>
              </div>

              <strong class="item-subtotal">
                {{ formatPrice(item.price * item.qty) }}
              </strong>
            </div>
          </div>

          <div class="order-footer">
            <RouterLink
              :to="`/orders/${order.id}`"
              class="detail-link"
            >
              查看詳情
            </RouterLink>

            <div class="order-total">
              <span>訂單總金額</span>
              <strong>{{ formatPrice(order.totalPrice) }}</strong>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.orders-page {
  min-height: 70vh;
  padding: 48px 16px;
  background: #f5f7fb;
}

.orders-container {
  max-width: 900px;
  margin: 0 auto;
}

.orders-header {
  margin-bottom: 28px;
  text-align: center;
}

.orders-header h2 {
  margin: 0;
  color: #111827;
  font-size: 32px;
}

.orders-header p {
  margin: 10px 0 0;
  color: #4b5563;
  line-height: 1.7;
  font-weight: 600;
}

.empty-orders {
  max-width: 760px;
  margin: 0 auto;
  padding: 48px 28px;
  border: 1px solid #e5e7eb;
  border-radius: 24px;
  background: #ffffff;
  text-align: center;
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.1);
}

.empty-orders-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 68px;
  height: 68px;
  margin: 0 auto 18px;
  border-radius: 50%;
  color: #1d4ed8;
  background-color: #eff6ff;
  font-size: 34px;
  font-weight: 900;
}

.empty-label {
  margin: 0 0 8px;
  color: #2563eb;
  font-size: 13px;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.empty-orders h3 {
  margin: 0 0 12px;
  color: #111827;
  font-size: 32px;
}

.empty-description {
  max-width: 520px;
  margin: 0 auto 28px;
  color: #4b5563;
  line-height: 1.7;
  font-weight: 700;
}

.empty-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}

.primary-link,
.secondary-link {
  display: inline-block;
  min-width: 140px;
  padding: 12px 20px;
  border-radius: 999px;
  text-align: center;
  text-decoration: none;
  font-weight: 800;
}

.primary-link {
  color: #ffffff;
  background-color: #222222;
}

.secondary-link {
  border: 1px solid #d1d5db;
  color: #111827;
  background-color: #ffffff;
}

.primary-link:hover {
  background-color: #444444;
}

.secondary-link:hover {
  background-color: #f3f4f6;
}

.order-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.order-card {
  padding: 24px;
  border-radius: 20px;
  background: #ffffff;
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.1);
}

.order-card-header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: flex-start;
  padding-bottom: 18px;
  border-bottom: 1px solid #e5e7eb;
}

.order-card-header h3 {
  margin: 0;
  color: #111827;
  font-size: 20px;
}

.order-customer,
.order-date,
.order-payment,
.order-qty {
  margin: 8px 0 0;
  color: #4b5563;
  font-weight: 700;
}

.order-status {
  padding: 6px 12px;
  border-radius: 999px;
  color: #166534;
  background: #dcfce7;
  font-weight: 800;
  white-space: nowrap;
}

.order-items {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 18px 0;
}

.order-item {
  display: grid;
  grid-template-columns: 72px 1fr auto;
  gap: 14px;
  align-items: center;
}

.order-item-image {
  width: 72px;
  height: 72px;
  border-radius: 14px;
  object-fit: cover;
  background: #e5e7eb;
}

.order-item-info h4 {
  margin: 0;
  color: #111827;
  font-size: 16px;
}

.order-item-info p {
  margin: 6px 0 0;
  color: #4b5563;
  font-weight: 700;
}

.item-subtotal {
  color: #111827;
  font-size: 16px;
  white-space: nowrap;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 14px;
  padding-top: 18px;
  border-top: 1px solid #e5e7eb;
}

.detail-link {
  display: inline-block;
  padding: 10px 14px;
  border-radius: 999px;
  color: #ffffff;
  background: #2563eb;
  font-weight: 800;
  text-decoration: none;
  white-space: nowrap;
}

.detail-link:hover {
  background: #1d4ed8;
}

.order-total {
  display: flex;
  align-items: center;
  gap: 14px;
  color: #111827;
  font-size: 18px;
}

.order-total strong {
  color: #dc2626;
  font-size: 22px;
}

@media (max-width: 640px) {
  .orders-page {
    padding: 40px 16px;
  }

  .orders-header h2 {
    font-size: 28px;
  }

  .empty-orders {
    padding: 40px 20px;
  }

  .empty-orders-icon {
    width: 60px;
    height: 60px;
    font-size: 30px;
  }

  .empty-orders h3 {
    font-size: 26px;
  }

  .empty-actions {
    flex-direction: column;
  }

  .primary-link,
  .secondary-link {
    width: 100%;
  }

  .order-card {
    padding: 20px;
  }

  .order-card-header {
    flex-direction: column;
  }

  .order-item {
    grid-template-columns: 64px 1fr;
  }

  .item-subtotal {
    grid-column: 2;
  }

  .order-footer {
    flex-direction: column;
    align-items: stretch;
  }

  .detail-link {
    text-align: center;
  }

  .order-total {
    justify-content: space-between;
  }
}
</style>