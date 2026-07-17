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
    return ""
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

const createdAtText = computed(() => {
  if (!order.value) {
    return ""
  }

  return formatDate(order.value.createdAt)
})
</script>

<template>
  <main class="order-success-view">
    <section v-if="!order" class="not-found-card">
      <div class="not-found-icon">
        !
      </div>

      <p class="not-found-label">
        Order Not Found
      </p>

      <h1>找不到訂單</h1>

      <p class="not-found-description">
        這筆訂單可能不存在，或是 localStorage 資料已被清除。
        你可以前往商品列表重新建立訂單，或回首頁繼續瀏覽。
      </p>

      <div class="not-found-actions">
        <RouterLink to="/product" class="primary-link">
          前往商品列表
        </RouterLink>

        <RouterLink to="/" class="secondary-link">
          回首頁
        </RouterLink>
      </div>
    </section>

    <section v-else-if="!isOwner" class="not-found-card">
      <div class="not-found-icon">
        !
      </div>

      <p class="not-found-label">
        Access Denied
      </p>

      <h1>無法查看此訂單</h1>

      <p class="not-found-description">
        這筆訂單不屬於目前登入會員。請返回我的訂單列表，
        查看你自己的訂單紀錄。
      </p>

      <div class="not-found-actions">
        <RouterLink to="/orders" class="primary-link">
          返回我的訂單
        </RouterLink>

        <RouterLink to="/product" class="secondary-link">
          前往商品列表
        </RouterLink>
      </div>
    </section>

    <section v-else class="success-page">
      <header class="success-header">
        <div class="success-icon">
          ✓
        </div>

        <p class="success-label">
          Order Completed
        </p>

        <h1>訂單建立成功</h1>

        <p class="success-message">
          感謝你的購買！我們已收到你的訂單，以下是本次訂單明細。
        </p>
      </header>

      <section class="summary-card order-highlight">
        <div>
          <p class="card-label">
            訂單編號
          </p>
          <h2>#{{ order.id }}</h2>
        </div>

        <div class="highlight-total">
          <p>本次付款金額</p>
          <strong>{{ formatPrice(order.totalPrice) }}</strong>
        </div>
      </section>

      <section class="info-grid">
        <article class="info-card">
          <h2>訂單資訊</h2>

          <div class="info-row">
            <span>建立時間</span>
            <strong>{{ createdAtText }}</strong>
          </div>

          <div class="info-row">
            <span>付款方式</span>
            <strong>{{ paymentText }}</strong>
          </div>

          <div class="info-row">
            <span>商品數量</span>
            <strong>{{ order.totalQty }} 件</strong>
          </div>

          <div class="info-row">
            <span>訂單狀態</span>
            <strong>已成立</strong>
          </div>
        </article>

        <article class="info-card">
          <h2>收件資料</h2>

          <div class="info-row">
            <span>收件人</span>
            <strong>{{ order.customer.name }}</strong>
          </div>

          <div class="info-row">
            <span>Email</span>
            <strong>{{ order.userEmail }}</strong>
          </div>

          <div class="info-row">
            <span>手機</span>
            <strong>{{ order.customer.phone }}</strong>
          </div>

          <div class="info-row address-row">
            <span>地址</span>
            <strong>{{ order.customer.address }}</strong>
          </div>

          <div v-if="order.note" class="info-row address-row">
            <span>備註</span>
            <strong>{{ order.note }}</strong>
          </div>
        </article>
      </section>

      <section class="summary-card order-products">
        <div class="section-title">
          <div>
            <p class="card-label">
              Products
            </p>
            <h2>訂單商品</h2>
          </div>

          <span>{{ order.items.length }} 項商品</span>
        </div>

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
            <h3>{{ item.name }}</h3>
            <p>單價：{{ formatPrice(item.price) }}</p>
            <p>數量：{{ item.qty }}</p>
          </div>

          <div class="order-item-price">
            <span>小計</span>
            <strong>{{ formatPrice(item.price * item.qty) }}</strong>
          </div>
        </div>
      </section>

      <section class="summary-card total-card">
        <div class="total-row">
          <span>商品數量</span>
          <strong>{{ order.totalQty }} 件</strong>
        </div>

        <div class="total-row final">
          <span>訂單總金額</span>
          <strong>{{ formatPrice(order.totalPrice) }}</strong>
        </div>
      </section>

      <div class="actions">
        <RouterLink
          :to="`/orders/${order.id}`"
          class="primary-link"
        >
          查看訂單詳情
        </RouterLink>

        <RouterLink to="/orders" class="secondary-link">
          我的訂單
        </RouterLink>

        <RouterLink to="/product" class="secondary-link">
          繼續購物
        </RouterLink>
      </div>
    </section>
  </main>
</template>

<style scoped>
.order-success-view {
  max-width: 980px;
  margin: 0 auto;
  padding: 40px 20px;
  color: #1f2937;
}

.success-page {
  display: grid;
  gap: 24px;
}

.success-header {
  text-align: center;
  padding: 32px 20px 16px;
}

.success-icon,
.not-found-icon {
  width: 68px;
  height: 68px;
  margin: 0 auto 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 38px;
  font-weight: 800;
}

.success-icon {
  background-color: #dcfce7;
  color: #15803d;
}

.not-found-icon {
  background-color: #fff7ed;
  color: #c2410c;
}

.success-label,
.card-label,
.not-found-label {
  margin: 0 0 6px;
  color: #2563eb;
  font-size: 13px;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.success-header h1 {
  margin-bottom: 10px;
  color: #111827;
  font-size: 34px;
}

.success-message {
  max-width: 560px;
  margin: 0 auto;
  color: #4b5563;
  line-height: 1.7;
}

.summary-card,
.info-card,
.not-found-card {
  border: 1px solid #e5e7eb;
  border-radius: 20px;
  background-color: #ffffff;
  padding: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
}

.not-found-card {
  max-width: 760px;
  margin: 0 auto;
  padding: 48px 28px;
  border-radius: 24px;
  text-align: center;
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.1);
}

.not-found-card h1 {
  margin: 0 0 12px;
  color: #111827;
  font-size: 32px;
}

.not-found-description {
  max-width: 520px;
  margin: 0 auto 28px;
  color: #4b5563;
  line-height: 1.7;
  font-weight: 700;
}

.not-found-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}

.order-highlight {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  align-items: center;
  background: linear-gradient(135deg, #f9fafb, #ffffff);
}

.order-highlight h2 {
  color: #111827;
  font-size: 24px;
  word-break: break-all;
}

.highlight-total {
  text-align: right;
}

.highlight-total p {
  margin: 0 0 6px;
  color: #4b5563;
}

.highlight-total strong {
  color: #111827;
  font-size: 28px;
  font-weight: 900;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.info-card h2,
.order-products h2 {
  margin-bottom: 16px;
  color: #111827;
  font-size: 20px;
}

.info-row,
.total-row {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
  color: #4b5563;
}

.info-row:last-child,
.total-row:last-child {
  border-bottom: none;
}

.info-row strong,
.total-row strong {
  color: #111827;
  text-align: right;
}

.address-row {
  align-items: flex-start;
}

.section-title {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: end;
  margin-bottom: 8px;
}

.section-title span {
  color: #4b5563;
  font-size: 14px;
  font-weight: 700;
}

.order-item {
  display: grid;
  grid-template-columns: 88px 1fr auto;
  gap: 16px;
  align-items: center;
  padding: 18px 0;
  border-bottom: 1px solid #eeeeee;
}

.order-item:last-child {
  border-bottom: none;
}

.order-item-image {
  width: 88px;
  height: 88px;
  border-radius: 14px;
  object-fit: cover;
}

.order-item-info h3 {
  margin-bottom: 6px;
  color: #111827;
  line-height: 1.4;
}

.order-item-info p {
  margin: 4px 0;
  color: #4b5563;
}

.order-item-price {
  text-align: right;
}

.order-item-price span {
  display: block;
  margin-bottom: 6px;
  color: #6b7280;
  font-size: 13px;
  font-weight: 700;
}

.order-item-price strong {
  color: #111827;
  white-space: nowrap;
}

.total-card {
  margin-top: -4px;
}

.total-row {
  font-size: 16px;
}

.total-row.final {
  padding-top: 18px;
  font-size: 24px;
}

.total-row.final span,
.total-row.final strong {
  color: #111827;
  font-weight: 900;
}

.actions {
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
  background-color: #222222;
  color: #ffffff;
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

@media (max-width: 768px) {
  .order-success-view {
    padding: 28px 16px;
  }

  .success-header {
    padding: 16px 8px 8px;
  }

  .success-icon,
  .not-found-icon {
    width: 60px;
    height: 60px;
    font-size: 34px;
  }

  .success-header h1 {
    font-size: 28px;
  }

  .summary-card,
  .info-card {
    padding: 20px 16px;
  }

  .not-found-card {
    padding: 40px 20px;
  }

  .not-found-card h1 {
    font-size: 26px;
  }

  .not-found-actions {
    flex-direction: column;
  }

  .order-highlight {
    display: grid;
    text-align: center;
  }

  .highlight-total {
    text-align: center;
  }

  .highlight-total strong {
    font-size: 26px;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .info-row,
  .total-row {
    gap: 12px;
  }

  .order-item {
    grid-template-columns: 78px 1fr;
    align-items: flex-start;
  }

  .order-item-image {
    width: 78px;
    height: 78px;
  }

  .order-item-price {
    grid-column: 2 / 3;
    text-align: left;
  }

  .order-item-price span {
    margin-bottom: 4px;
  }

  .total-row.final {
    font-size: 22px;
  }

  .actions {
    flex-direction: column;
  }

  .primary-link,
  .secondary-link {
    width: 100%;
  }
}

@media (max-width: 420px) {
  .success-header h1 {
    font-size: 26px;
  }

  .success-message {
    font-size: 15px;
  }

  .section-title {
    align-items: flex-start;
    flex-direction: column;
  }

  .order-item {
    grid-template-columns: 1fr;
  }

  .order-item-image {
    width: 100%;
    height: 180px;
  }

  .order-item-price {
    grid-column: auto;
  }

  .info-row,
  .total-row {
    display: grid;
    gap: 4px;
  }

  .info-row strong,
  .total-row strong {
    text-align: left;
  }
}
</style>