<script setup>
import { RouterLink } from "vue-router"

import { formatPrice } from "../utils/formatPrice.js"
import { handleShowToast } from "../utils/toastHelper.js"

import { useCartStore } from "../stores/cart.js"
import { useToastStore } from "../stores/toast.js"

const cartStore = useCartStore()
const toastStore = useToastStore()

const getRemainQty = (item) => {
  return item.stock - item.qty
}

const isReachStockLimit = (item) => {
  return getRemainQty(item) <= 0
}

const handleUpdateQty = (id, option) => {
  const result = cartStore.updateQty(id, option)
  handleShowToast(result)
}

const handleRemove = (id) => {
  const removeItem = cartStore.cart.find((cartItem) => {
    return cartItem.id === id
  })

  if (!removeItem) {
    return
  }

  cartStore.remove(id)

  toastStore.showToast(`已將[${removeItem.name}]從購物車中移除`, "info")
}

const handleClearCart = () => {
  if (cartStore.cart.length === 0) {
    return
  }

  cartStore.clearCart()

  toastStore.showToast("購物車已清空", "info")
}
</script>

<template>
  <main class="cart-view">
    <div class="cart-container">
      <section class="cart-hero">
        <h2>購物車</h2>
        <p>確認商品數量與金額，準備前往結帳。</p>
      </section>

      <section
        v-if="cartStore.cart.length === 0"
        class="empty-cart"
      >
        <div class="empty-cart-icon">
          🛒
        </div>

        <p class="empty-label">
          Empty Cart
        </p>

        <h3>購物車目前是空的</h3>

        <p class="empty-description">
          你還沒有加入任何商品。可以前往商品列表挑選喜歡的商品，
          或回首頁重新瀏覽推薦內容。
        </p>

        <div class="empty-actions">
          <RouterLink to="/product" class="primary-link">
            前往商品列表
          </RouterLink>

          <RouterLink to="/" class="secondary-link">
            回首頁
          </RouterLink>
        </div>
      </section>

      <section v-else class="cart-layout">
        <div class="cart-list-area">
          <div class="cart-list-header">
            <h3>購物車商品</h3>

            <button
              type="button"
              class="clear-button header-clear-button"
              @click="handleClearCart"
            >
              清空購物車
            </button>
          </div>

          <div class="cart-list">
            <article
              v-for="item in cartStore.cart"
              :key="item.id"
              class="cart-item"
            >
              <img
                :src="item.image"
                :alt="item.name"
                class="cart-image"
              >

              <div class="cart-info">
                <h3>{{ item.name }}</h3>

                <p class="cart-price">
                  單價：{{ formatPrice(item.price) }}
                </p>

                <p class="cart-subtotal">
                  小計：{{ formatPrice(item.price * item.qty) }}
                </p>

                <div class="stock-info">
                  <p>庫存上限：{{ item.stock }} 件</p>

                  <p :class="{ limit: isReachStockLimit(item) }">
                    {{
                      isReachStockLimit(item)
                        ? "已達庫存上限"
                        : `還可再加：${getRemainQty(item)} 件`
                    }}
                  </p>
                </div>
              </div>

              <div class="cart-actions">
                <div class="qty-control">
                  <button
                    type="button"
                    class="qty-button"
                    @click="handleUpdateQty(item.id, -1)"
                  >
                    －
                  </button>

                  <span class="qty-number">{{ item.qty }}</span>

                  <button
                    type="button"
                    class="qty-button"
                    :disabled="isReachStockLimit(item)"
                    @click="handleUpdateQty(item.id, 1)"
                  >
                    ＋
                  </button>
                </div>

                <button
                  type="button"
                  class="remove-button"
                  @click="handleRemove(item.id)"
                >
                  移除
                </button>
              </div>
            </article>
          </div>
        </div>

        <aside class="cart-summary">
          <h3>訂單摘要</h3>

          <div class="summary-row">
            <span>商品總數</span>
            <strong>{{ cartStore.totalQty }} 件</strong>
          </div>

          <div class="summary-row total">
            <span>訂單金額</span>
            <strong>{{ formatPrice(cartStore.totalPrice) }}</strong>
          </div>

          <div class="summary-actions">
            <button
              type="button"
              class="clear-button"
              @click="handleClearCart"
            >
              清空購物車
            </button>

            <RouterLink to="/checkout" class="checkout-button">
              前往結帳
            </RouterLink>
          </div>

          <RouterLink to="/product" class="continue-link">
            繼續購物
          </RouterLink>
        </aside>
      </section>
    </div>
  </main>
</template>

<style scoped>
.cart-view {
  min-height: 70vh;
  padding: 32px 20px;
  background: #f5f7fb;
}

.cart-container {
  max-width: 1180px;
  margin: 0 auto;
}

.cart-hero {
  margin-bottom: 24px;
}

.cart-hero h2 {
  margin-bottom: 8px;
  color: #111827;
  font-size: 32px;
}

.cart-hero p {
  margin: 0;
  color: #4b5563;
  line-height: 1.6;
  font-weight: 600;
}

.empty-cart {
  max-width: 760px;
  margin: 0 auto;
  padding: 48px 28px;
  text-align: center;
  border: 1px solid #e5e7eb;
  border-radius: 24px;
  background-color: #ffffff;
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.1);
}

.empty-cart-icon {
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

.empty-cart h3 {
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

.cart-layout {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 24px;
  align-items: start;
}

.cart-list-area,
.cart-summary {
  padding: 20px;
  border: 1px solid #e5e7eb;
  border-radius: 18px;
  background-color: #ffffff;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
}

.cart-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.cart-list-header h3,
.cart-summary h3 {
  margin: 0;
  color: #111827;
}

.cart-list {
  display: grid;
  gap: 16px;
}

.cart-item {
  display: grid;
  grid-template-columns: 120px 1fr auto;
  gap: 20px;
  align-items: center;
  padding: 16px;
  border: 1px solid #eeeeee;
  border-radius: 16px;
  background-color: #ffffff;
}

.cart-image {
  width: 120px;
  height: 96px;
  object-fit: cover;
  border-radius: 12px;
  background: #e5e7eb;
}

.cart-info h3 {
  margin: 0 0 8px;
  color: #111827;
  font-size: 18px;
  line-height: 1.4;
}

.cart-price {
  margin: 4px 0;
  color: #4b5563;
  font-weight: 600;
}

.cart-subtotal {
  margin: 4px 0;
  color: #111827;
  font-weight: 800;
}

.stock-info {
  margin-top: 8px;
  color: #4b5563;
  font-size: 14px;
  font-weight: 600;
}

.stock-info p {
  margin: 4px 0;
}

.stock-info .limit {
  color: #b91c1c;
  font-weight: 800;
}

.cart-actions {
  display: grid;
  gap: 12px;
  justify-items: end;
}

.qty-control {
  display: inline-flex;
  align-items: center;
  overflow: hidden;
  border: 1px solid #d1d5db;
  border-radius: 999px;
}

.qty-button {
  width: 36px;
  height: 36px;
  border: none;
  background-color: #333333;
  color: #ffffff;
  font-size: 16px;
  font-weight: 800;
  cursor: pointer;
}

.qty-button:hover {
  background-color: #111111;
}

.qty-button:disabled {
  background-color: #9ca3af;
  color: #ffffff;
  cursor: not-allowed;
  opacity: 1;
}

.qty-number {
  min-width: 42px;
  color: #111827;
  text-align: center;
  font-weight: 800;
}

.remove-button,
.clear-button {
  padding: 9px 13px;
  border: none;
  border-radius: 999px;
  background-color: #f3f4f6;
  color: #111827;
  font-weight: 800;
  cursor: pointer;
  white-space: nowrap;
}

.remove-button:hover,
.clear-button:hover {
  background-color: #e5e7eb;
}

.cart-summary {
  position: sticky;
  top: 96px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin: 14px 0;
  color: #4b5563;
  font-weight: 700;
}

.summary-row strong {
  color: #111827;
}

.summary-row.total {
  padding-top: 14px;
  border-top: 1px solid #eeeeee;
  font-size: 20px;
}

.summary-row.total strong {
  color: #dc2626;
}

.summary-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 20px;
}

.checkout-button,
.continue-link {
  display: block;
  padding: 11px 14px;
  border-radius: 999px;
  font-weight: 800;
  text-align: center;
  text-decoration: none;
}

.checkout-button {
  background-color: #222222;
  color: #ffffff;
}

.checkout-button:hover {
  background-color: #444444;
}

.continue-link {
  margin-top: 12px;
  border: 1px solid #d1d5db;
  background-color: #ffffff;
  color: #111827;
}

.continue-link:hover {
  background-color: #f3f4f6;
}

@media (max-width: 900px) {
  .cart-layout {
    grid-template-columns: 1fr;
  }

  .cart-summary {
    position: static;
  }
}

@media (max-width: 640px) {
  .cart-view {
    padding: 24px 16px;
  }

  .cart-hero {
    margin-bottom: 18px;
  }

  .cart-hero h2 {
    font-size: 28px;
  }

  .empty-cart {
    padding: 40px 20px;
  }

  .empty-cart-icon {
    width: 60px;
    height: 60px;
    font-size: 30px;
  }

  .empty-cart h3 {
    font-size: 26px;
  }

  .empty-actions {
    flex-direction: column;
  }

  .primary-link,
  .secondary-link {
    width: 100%;
  }

  .cart-list-area,
  .cart-summary {
    padding: 16px;
  }

  .cart-list-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .header-clear-button {
    width: 100%;
  }

  .cart-item {
    grid-template-columns: 96px 1fr;
    gap: 14px;
    align-items: start;
    padding: 14px;
  }

  .cart-image {
    width: 96px;
    height: 96px;
  }

  .cart-actions {
    grid-column: 2 / 3;
    justify-items: stretch;
  }

  .qty-control {
    width: 100%;
    justify-content: space-between;
  }

  .qty-button {
    width: 44px;
    height: 40px;
  }

  .qty-number {
    flex: 1;
  }

  .remove-button {
    width: 100%;
  }

  .summary-actions {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 420px) {
  .cart-item {
    grid-template-columns: 1fr;
  }

  .cart-image {
    width: 100%;
    height: 180px;
  }

  .cart-actions {
    grid-column: auto;
  }

  .cart-info h3 {
    font-size: 17px;
  }
}
</style>