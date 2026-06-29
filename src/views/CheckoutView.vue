<script setup>
import { computed, reactive, ref } from "vue"
import { RouterLink, useRouter } from "vue-router"

import { useCartStore } from "../stores/cart.js"
import { useToastStore } from "../stores/toast.js"
import { useOrderStore } from "../stores/order.js"
import { useAuthStore } from "../stores/auth.js"

import { formatPrice } from "../utils/formatPrice.js"
import { handleShowToast } from "../utils/toastHelper.js"

const cartStore = useCartStore()
const toastStore = useToastStore()
const orderStore = useOrderStore()
const authStore = useAuthStore()
const router = useRouter()

const isSubmitting = ref(false)

const checkoutForm = reactive({
  name: "",
  phone: "",
  address: "",
  payment: "credit-card",
  note: "",
})

const errors = reactive({
  name: "",
  phone: "",
  address: "",
  payment: "",
})

const cartItems = computed(() => {
  return cartStore.cart
})

const hasCartItems = computed(() => {
  return cartItems.value.length > 0
})

const paymentText = computed(() => {
  if (checkoutForm.payment === "credit-card") {
    return "信用卡付款"
  }

  if (checkoutForm.payment === "atm") {
    return "ATM 轉帳"
  }

  if (checkoutForm.payment === "cash-on-delivery") {
    return "貨到付款"
  }

  return "尚未選擇"
})

const resetErrors = () => {
  errors.name = ""
  errors.phone = ""
  errors.address = ""
  errors.payment = ""
}

const isValidPhone = (phoneValue) => {
  return /^09\d{8}$/.test(phoneValue)
}

const validateForm = () => {
  resetErrors()

  let isValid = true

  const nameValue = checkoutForm.name.trim()
  const phoneValue = checkoutForm.phone.trim()
  const addressValue = checkoutForm.address.trim()

  if (!nameValue) {
    errors.name = "請輸入收件人姓名"
    isValid = false
  }

  if (!phoneValue) {
    errors.phone = "請輸入手機號碼"
    isValid = false
  } else if (!isValidPhone(phoneValue)) {
    errors.phone = "請輸入正確的手機格式，例如 0912345678"
    isValid = false
  }

  if (!addressValue) {
    errors.address = "請輸入收件地址"
    isValid = false
  }

  if (!checkoutForm.payment) {
    errors.payment = "請選擇付款方式"
    isValid = false
  }

  return isValid
}

const handleSubmitOrder = async () => {
  if (isSubmitting.value) {
    return
  }

  if (!hasCartItems.value) {
    toastStore.showToast("購物車是空的，無法送出訂單", "error")
    router.push("/product")
    return
  }

  const isValid = validateForm()

  if (!isValid) {
    toastStore.showToast("請確認表單資料是否完整", "error")
    return
  }

  try {
    isSubmitting.value = true

    await new Promise((resolve) => {
      setTimeout(() => {
        resolve()
      }, 800)
    })

    const orderData = {
      userId: authStore.user?.id,
      userEmail: authStore.user?.email,

      customer: {
        name: checkoutForm.name.trim(),
        phone: checkoutForm.phone.trim(),
        address: checkoutForm.address.trim(),
      },

      payment: checkoutForm.payment,
      note: checkoutForm.note.trim(),

      items: cartStore.cart.map((item) => {
        return {
          id: item.id,
          name: item.name,
          price: item.price,
          image: item.image,
          qty: item.qty,
        }
      }),

      totalQty: cartStore.totalQty,
      totalPrice: cartStore.totalPrice,
    }

    const result = orderStore.createOrder(orderData)

    handleShowToast(result)

    if (result.success) {
      cartStore.clearCart()
      router.push(`/order-success/${result.order.id}`)
    }
  } catch (error) {
    console.error("建立訂單失敗：", error)

    handleShowToast({
      success: false,
      message: "建立訂單失敗，請稍後再試",
    })
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <main class="checkout-view">
    <div class="checkout-container">
      <section class="checkout-hero">
        <h1>結帳頁面</h1>
        <p>請填寫收件資料，並確認你的訂單內容。</p>
      </section>

      <section v-if="!hasCartItems" class="empty-checkout">
        <div class="empty-checkout-icon">
          🧾
        </div>

        <p class="empty-label">
          Empty Checkout
        </p>

        <h2>目前無法結帳</h2>

        <p class="empty-description">
          你的購物車目前沒有商品，請先加入商品後再進行結帳。
          你可以前往商品列表挑選商品，或回首頁重新瀏覽。
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

      <section v-else class="checkout-layout">
        <div class="checkout-main">
          <section class="checkout-form-card">
            <h2>收件資料</h2>

            <form class="checkout-form" @submit.prevent="handleSubmitOrder">
              <div class="form-group">
                <label for="name">收件人姓名</label>
                <input
                  id="name"
                  v-model="checkoutForm.name"
                  type="text"
                  placeholder="請輸入收件人姓名"
                  :class="{ error: errors.name }"
                >
                <p v-if="errors.name" class="error-message">
                  {{ errors.name }}
                </p>
              </div>

              <div class="form-group">
                <label for="phone">手機號碼</label>
                <input
                  id="phone"
                  v-model="checkoutForm.phone"
                  type="tel"
                  placeholder="例如 0912345678"
                  :class="{ error: errors.phone }"
                >
                <p v-if="errors.phone" class="error-message">
                  {{ errors.phone }}
                </p>
              </div>

              <div class="form-group">
                <label for="address">收件地址</label>
                <input
                  id="address"
                  v-model="checkoutForm.address"
                  type="text"
                  placeholder="請輸入收件地址"
                  :class="{ error: errors.address }"
                >
                <p v-if="errors.address" class="error-message">
                  {{ errors.address }}
                </p>
              </div>

              <div class="form-group">
                <label for="payment">付款方式</label>
                <select
                  id="payment"
                  v-model="checkoutForm.payment"
                  :class="{ error: errors.payment }"
                >
                  <option value="credit-card">信用卡付款</option>
                  <option value="atm">ATM 轉帳</option>
                  <option value="cash-on-delivery">貨到付款</option>
                </select>
                <p v-if="errors.payment" class="error-message">
                  {{ errors.payment }}
                </p>
              </div>

              <div class="form-group">
                <label for="note">訂單備註</label>
                <textarea
                  id="note"
                  v-model="checkoutForm.note"
                  rows="4"
                  placeholder="有任何備註可以填寫在這裡"
                ></textarea>
              </div>

              <button
                type="submit"
                class="submit-order-button mobile-submit-button"
                :disabled="isSubmitting"
              >
                {{ isSubmitting ? "訂單建立中..." : "送出訂單" }}
              </button>
            </form>
          </section>

          <section class="checkout-products">
            <h2>訂單商品</h2>

            <div
              v-for="item in cartItems"
              :key="item.id"
              class="checkout-item"
            >
              <img
                :src="item.image"
                :alt="item.name"
                class="checkout-item-image"
              >

              <div class="checkout-item-info">
                <h3>{{ item.name }}</h3>
                <p>單價：{{ formatPrice(item.price) }}</p>
                <p>數量：{{ item.qty }}</p>
                <p class="item-subtotal">
                  小計：{{ formatPrice(item.price * item.qty) }}
                </p>
              </div>
            </div>
          </section>
        </div>

        <aside class="checkout-summary">
          <h2>訂單摘要</h2>

          <div class="summary-row">
            <span>商品數量</span>
            <strong>{{ cartStore.totalQty }} 件</strong>
          </div>

          <div class="summary-row total">
            <span>總金額</span>
            <strong>{{ formatPrice(cartStore.totalPrice) }}</strong>
          </div>

          <div class="summary-divider"></div>

          <div class="preview-form">
            <h3>目前填寫資料</h3>

            <p>
              <span>姓名：</span>
              <strong>{{ checkoutForm.name || "尚未填寫" }}</strong>
            </p>

            <p>
              <span>手機：</span>
              <strong>{{ checkoutForm.phone || "尚未填寫" }}</strong>
            </p>

            <p>
              <span>地址：</span>
              <strong>{{ checkoutForm.address || "尚未填寫" }}</strong>
            </p>

            <p>
              <span>付款：</span>
              <strong>{{ paymentText }}</strong>
            </p>
          </div>

          <button
            type="button"
            class="submit-order-button desktop-submit-button"
            :disabled="isSubmitting"
            @click="handleSubmitOrder"
          >
            {{ isSubmitting ? "訂單建立中..." : "送出訂單" }}
          </button>

          <p class="checkout-note">
            這一階段會檢查姓名、手機、地址與付款方式是否完整。
          </p>
        </aside>
      </section>
    </div>
  </main>
</template>

<style scoped>
.checkout-view {
  min-height: 70vh;
  padding: 32px 20px;
  background: #f5f7fb;
}

.checkout-container {
  max-width: 1180px;
  margin: 0 auto;
}

.checkout-hero {
  margin-bottom: 28px;
}

.checkout-hero h1 {
  margin-bottom: 8px;
  color: #111827;
  font-size: 32px;
}

.checkout-hero p {
  margin: 0;
  color: #4b5563;
  line-height: 1.6;
  font-weight: 600;
}

.empty-checkout {
  max-width: 760px;
  margin: 0 auto;
  padding: 48px 28px;
  border: 1px solid #e5e7eb;
  border-radius: 24px;
  text-align: center;
  background-color: #ffffff;
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.1);
}

.empty-checkout-icon {
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

.empty-checkout h2 {
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

.checkout-layout {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 24px;
  align-items: start;
}

.checkout-main {
  display: grid;
  gap: 24px;
}

.checkout-form-card,
.checkout-products,
.checkout-summary {
  border: 1px solid #e5e7eb;
  border-radius: 18px;
  background-color: #ffffff;
  padding: 20px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
}

.checkout-form-card h2,
.checkout-products h2,
.checkout-summary h2 {
  margin-bottom: 16px;
  color: #111827;
}

.checkout-form {
  display: grid;
  gap: 16px;
}

.form-group {
  display: grid;
  gap: 8px;
}

.form-group label {
  font-weight: 700;
  color: #1f2937;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 11px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  background-color: #ffffff;
  color: #111827;
  font-size: 15px;
  outline: none;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.14);
}

.form-group input.error,
.form-group select.error {
  border-color: #dc2626;
  background-color: #fff5f5;
}

.error-message {
  margin: 0;
  padding: 10px 12px;
  border-radius: 10px;
  color: #991b1b;
  background: #fee2e2;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.5;
}

.form-group textarea {
  resize: vertical;
}

.checkout-item {
  display: grid;
  grid-template-columns: 96px 1fr;
  gap: 16px;
  padding: 16px 0;
  border-bottom: 1px solid #eeeeee;
}

.checkout-item:last-child {
  border-bottom: none;
}

.checkout-item-image {
  width: 96px;
  height: 96px;
  border-radius: 12px;
  object-fit: cover;
  background: #e5e7eb;
}

.checkout-item-info h3 {
  margin-bottom: 8px;
  color: #111827;
  line-height: 1.4;
}

.checkout-item-info p {
  margin: 4px 0;
  color: #4b5563;
}

.item-subtotal {
  font-weight: 800;
  color: #111827 !important;
}

.checkout-summary {
  position: sticky;
  top: 96px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 14px;
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
  color: #111827;
}

.summary-row.total strong {
  color: #dc2626;
}

.summary-divider {
  margin: 18px 0;
  border-top: 1px solid #eeeeee;
}

.preview-form {
  display: grid;
  gap: 8px;
}

.preview-form h3 {
  margin-bottom: 4px;
  color: #111827;
  font-size: 16px;
}

.preview-form p {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin: 0;
  color: #4b5563;
  font-size: 14px;
}

.preview-form strong {
  color: #111827;
  text-align: right;
}

.submit-order-button {
  width: 100%;
  margin-top: 20px;
  padding: 12px 16px;
  border: none;
  border-radius: 999px;
  background-color: #222222;
  color: #ffffff;
  font-size: 16px;
  font-weight: 800;
  cursor: pointer;
}

.submit-order-button:hover {
  background-color: #444444;
}

.submit-order-button:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}

.submit-order-button:disabled:hover {
  background-color: #9ca3af;
}

.mobile-submit-button {
  display: none;
}

.checkout-note {
  margin-top: 14px;
  line-height: 1.6;
  color: #4b5563;
  font-size: 14px;
}

@media (max-width: 900px) {
  .checkout-layout {
    grid-template-columns: 1fr;
  }

  .checkout-summary {
    position: static;
  }
}

@media (max-width: 640px) {
  .checkout-view {
    padding: 24px 16px;
  }

  .checkout-hero {
    margin-bottom: 20px;
  }

  .checkout-hero h1 {
    font-size: 28px;
  }

  .empty-checkout {
    padding: 40px 20px;
  }

  .empty-checkout-icon {
    width: 60px;
    height: 60px;
    font-size: 30px;
  }

  .empty-checkout h2 {
    font-size: 26px;
  }

  .empty-actions {
    flex-direction: column;
  }

  .primary-link,
  .secondary-link {
    width: 100%;
  }

  .checkout-form-card,
  .checkout-products,
  .checkout-summary {
    padding: 16px;
  }

  .form-group input,
  .form-group select,
  .form-group textarea {
    padding: 12px;
    font-size: 16px;
  }

  .checkout-item {
    grid-template-columns: 82px 1fr;
    gap: 12px;
  }

  .checkout-item-image {
    width: 82px;
    height: 82px;
  }

  .preview-form p {
    display: grid;
    gap: 4px;
  }

  .preview-form strong {
    text-align: left;
  }

  .desktop-submit-button {
    display: none;
  }

  .mobile-submit-button {
    display: block;
  }
}

@media (max-width: 420px) {
  .checkout-hero h1 {
    font-size: 26px;
  }

  .checkout-item {
    grid-template-columns: 1fr;
  }

  .checkout-item-image {
    width: 100%;
    height: 180px;
  }
}
</style>