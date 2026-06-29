<script setup>
import { computed } from "vue"
import { RouterLink, useRoute } from "vue-router"
import { useOrderStore } from "../stores/order.js"
import { useAuthStore } from "../stores/auth.js"
import { formatPrice } from "../utils/formatPrice.js"
import { formatDate } from "../utils/formatDate.js"

const route = useRoute()
const orderStore = useOrderStore()
const authStore = useAuthStore()

const order = computed(() => {
  return orderStore.getOrderById(route.params.id)
})

const isOwner = computed(() => {
  if (!order.value) {
    return false
  }

  return order.value.userEmail === authStore.user?.email
})

const paymentText = computed(() => {
  if (!order.value) {
    return "尚未選擇"
  }

  if (order.value.payment === "credit-card") {
    return "信用卡付款"
  }

  if (order.value.payment === "atm") {
    return "ATM 轉帳"
  }

  if (order.value.payment === "cash-on-delivery") {
    return "貨到付款"
  }

  return "未知付款方式"
})
</script>

<template>
  <section class="order-detail-page">
    <div class="order-detail-container">
      <div v-if="!order" class="empty-card">
        <div class="empty-icon">
          !
        </div>

        <p class="empty-label">
          Order Not Found
        </p>

        <h2>找不到訂單</h2>

        <p class="empty-description">
          這筆訂單不存在，或已經被移除。你可以返回我的訂單列表，
          或前往商品列表重新瀏覽商品。
        </p>

        <div class="empty-actions">
          <RouterLink to="/orders" class="primary-link">
            返回我的訂單
          </RouterLink>

          <RouterLink to="/product" class="secondary-link">
            前往商品列表
          </RouterLink>
        </div>
      </div>

      <div v-else-if="!isOwner" class="empty-card">
        <div class="empty-icon">
          !
        </div>

        <p class="empty-label">
          Access Denied
        </p>

        <h2>無法查看此訂單</h2>

        <p class="empty-description">
          這筆訂單不屬於目前登入會員。請返回我的訂單列表，
          查看你自己的訂單紀錄。
        </p>

        <div class="empty-actions">
          <RouterLink to="/orders" class="primary-link">
            返回我的訂單
          </RouterLink>

          <RouterLink to="/product" class="secondary-link">
            前往商品列表
          </RouterLink>
        </div>
      </div>

      <article v-else class="order-detail-card">
        <div class="detail-header">
          <div>
            <p class="eyebrow">訂單詳情</p>
            <h2>訂單編號：{{ order.id }}</h2>
            <p class="detail-date">
              成立時間：{{ formatDate(order.createdAt) }}
            </p>
          </div>

          <span class="order-status">
            已成立
          </span>
        </div>

        <div class="section-block">
          <h3>訂單資訊</h3>

          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">訂單狀態</span>
              <strong>已成立</strong>
            </div>

            <div class="info-item">
              <span class="info-label">付款方式</span>
              <strong>{{ paymentText }}</strong>
            </div>

            <div class="info-item">
              <span class="info-label">商品數量</span>
              <strong>{{ order.totalQty }} 件</strong>
            </div>

            <div class="info-item">
              <span class="info-label">訂單總金額</span>
              <strong class="price-text">
                {{ formatPrice(order.totalPrice) }}
              </strong>
            </div>

            <div v-if="order.note" class="info-item full-row">
              <span class="info-label">訂單備註</span>
              <strong>{{ order.note }}</strong>
            </div>
          </div>
        </div>

        <div class="section-block">
          <h3>訂購人資訊</h3>

          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">姓名</span>
              <strong>{{ order.customer.name }}</strong>
            </div>

            <div class="info-item">
              <span class="info-label">Email</span>
              <strong>{{ order.userEmail }}</strong>
            </div>

            <div class="info-item">
              <span class="info-label">電話</span>
              <strong>{{ order.customer.phone }}</strong>
            </div>

            <div class="info-item">
              <span class="info-label">地址</span>
              <strong>{{ order.customer.address }}</strong>
            </div>
          </div>
        </div>

        <div class="section-block">
          <h3>商品明細</h3>

          <div class="item-list">
            <div
              v-for="item in order.items"
              :key="item.id"
              class="order-item"
            >
              <img
                :src="item.image"
                :alt="item.name"
                class="item-image"
              >

              <div class="item-info">
                <h4>{{ item.name }}</h4>
                <p>{{ formatPrice(item.price) }} × {{ item.qty }}</p>
              </div>

              <strong class="item-subtotal">
                {{ formatPrice(item.price * item.qty) }}
              </strong>
            </div>
          </div>
        </div>

        <div class="detail-footer">
          <div class="footer-actions">
            <RouterLink to="/orders" class="detail-secondary-link">
              返回我的訂單
            </RouterLink>

            <RouterLink to="/product" class="product-link">
              繼續購物
            </RouterLink>
          </div>

          <div class="total-box">
            <span>訂單總金額</span>
            <strong>{{ formatPrice(order.totalPrice) }}</strong>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped>
.order-detail-page {
  min-height: 70vh;
  padding: 48px 16px;
  background: #f5f7fb;
}

.order-detail-container {
  max-width: 920px;
  margin: 0 auto;
}

.empty-card,
.order-detail-card {
  padding: 32px;
  border-radius: 20px;
  background: #ffffff;
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.12);
}

.empty-card {
  max-width: 760px;
  margin: 0 auto;
  padding: 48px 28px;
  border: 1px solid #e5e7eb;
  border-radius: 24px;
  text-align: center;
}

.empty-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 68px;
  height: 68px;
  margin: 0 auto 18px;
  border-radius: 50%;
  color: #c2410c;
  background-color: #fff7ed;
  font-size: 38px;
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

.empty-card h2 {
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
.secondary-link,
.detail-secondary-link,
.product-link {
  display: inline-block;
  min-width: 140px;
  padding: 12px 18px;
  border-radius: 999px;
  font-weight: 800;
  text-align: center;
  text-decoration: none;
}

.primary-link,
.detail-secondary-link {
  color: #ffffff;
  background: #2563eb;
}

.primary-link:hover,
.detail-secondary-link:hover {
  background: #1d4ed8;
}

.secondary-link,
.product-link {
  color: #111827;
  background: #ffffff;
  border: 1px solid #d1d5db;
}

.secondary-link:hover,
.product-link:hover {
  background: #f3f4f6;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  padding-bottom: 22px;
  border-bottom: 1px solid #e5e7eb;
}

.eyebrow {
  margin: 0 0 8px;
  color: #2563eb;
  font-weight: 800;
}

.detail-header h2 {
  margin: 0;
  color: #111827;
  font-size: 28px;
  word-break: break-word;
}

.detail-date {
  margin: 10px 0 0;
  color: #4b5563;
  font-weight: 700;
}

.order-status {
  padding: 7px 13px;
  border-radius: 999px;
  color: #166534;
  background: #dcfce7;
  font-weight: 800;
  white-space: nowrap;
}

.section-block {
  margin-top: 26px;
}

.section-block h3 {
  margin: 0 0 14px;
  color: #111827;
  font-size: 20px;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.info-item {
  padding: 16px;
  border-radius: 14px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
}

.info-item.full-row {
  grid-column: 1 / -1;
}

.info-label {
  display: block;
  margin-bottom: 6px;
  color: #4b5563;
  font-weight: 800;
}

.info-item strong {
  color: #111827;
  word-break: break-word;
}

.price-text {
  color: #dc2626 !important;
}

.item-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.order-item {
  display: grid;
  grid-template-columns: 76px 1fr auto;
  gap: 14px;
  align-items: center;
  padding: 14px;
  border-radius: 16px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
}

.item-image {
  width: 76px;
  height: 76px;
  border-radius: 14px;
  object-fit: cover;
  background: #e5e7eb;
}

.item-info h4 {
  margin: 0;
  color: #111827;
  font-size: 16px;
}

.item-info p {
  margin: 6px 0 0;
  color: #4b5563;
  font-weight: 700;
}

.item-subtotal {
  color: #111827;
  font-size: 16px;
  white-space: nowrap;
}

.detail-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 18px;
  margin-top: 28px;
  padding-top: 22px;
  border-top: 1px solid #e5e7eb;
}

.footer-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.total-box {
  display: flex;
  align-items: center;
  gap: 14px;
  color: #111827;
  font-size: 18px;
}

.total-box strong {
  color: #dc2626;
  font-size: 24px;
}

@media (max-width: 640px) {
  .empty-card,
  .order-detail-card {
    padding: 24px;
  }

  .empty-card {
    padding: 40px 20px;
  }

  .empty-icon {
    width: 60px;
    height: 60px;
    font-size: 34px;
  }

  .empty-card h2 {
    font-size: 26px;
  }

  .empty-actions {
    flex-direction: column;
  }

  .primary-link,
  .secondary-link,
  .detail-secondary-link,
  .product-link {
    width: 100%;
  }

  .detail-header {
    flex-direction: column;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .order-item {
    grid-template-columns: 64px 1fr;
  }

  .item-image {
    width: 64px;
    height: 64px;
  }

  .item-subtotal {
    grid-column: 2;
  }

  .detail-footer {
    flex-direction: column-reverse;
    align-items: stretch;
  }

  .footer-actions {
    flex-direction: column;
  }

  .total-box {
    justify-content: space-between;
  }
}
</style>