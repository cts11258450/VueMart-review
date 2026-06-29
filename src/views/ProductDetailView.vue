<script setup>
import { computed } from "vue"
import { useRoute, RouterLink } from "vue-router"

import { useProductStore } from "../stores/product.js"
import { useCartStore } from "../stores/cart.js"

import { formatPrice } from "../utils/formatPrice.js"
import { handleShowToast } from "../utils/toastHelper.js"

const route = useRoute()
const productStore = useProductStore()
const cartStore = useCartStore()

const productId = computed(() => {
  return Number(route.params.id)
})

const product = computed(() => {
  return productStore.products.find((item) => {
    return item.id === productId.value
  })
})

const handleAddToCart = () => {
  if (!product.value) {
    return
  }

  const result = cartStore.addToCart(product.value)
  handleShowToast(result)
}
</script>

<template>
  <section class="product-detail-page">
    <div v-if="product" class="product-detail-container">
      <RouterLink to="/product" class="back-link">
        ← 返回商品列表
      </RouterLink>

      <div class="detail-card">
        <img
          :src="product.image"
          :alt="product.name"
          class="detail-image"
        >

        <div class="detail-info">
          <span class="category">
            {{ product.category }}
          </span>

          <h2>{{ product.name }}</h2>

          <p class="price">
            {{ formatPrice(product.price) }}
          </p>

          <p class="description">
            {{ product.description }}
          </p>

          <div class="product-meta">
            <p>
              <span>庫存：</span>
              <strong :class="{ soldout: product.stock <= 0 }">
                {{ product.stock <= 0 ? "已售完" : `${product.stock} 件` }}
              </strong>
            </p>

            <p>
              <span>評分：</span>
              <strong>⭐ {{ product.rating }}</strong>
            </p>
          </div>

          <button
            class="add-button"
            :class="{ soldout: product.stock <= 0 }"
            :disabled="product.stock <= 0"
            @click="handleAddToCart"
          >
            {{ product.stock <= 0 ? "已售完" : "加入購物車" }}
          </button>
        </div>
      </div>
    </div>

    <div v-else class="product-not-found">
      <div class="not-found-card">
        <div class="not-found-icon">
          !
        </div>

        <p class="error-label">
          Product Not Found
        </p>

        <h2>找不到商品</h2>

        <p class="not-found-description">
          這項商品可能不存在、已經下架，或是網址輸入錯誤。
          你可以返回商品列表，或回到首頁重新瀏覽。
        </p>

        <div class="not-found-actions">
          <RouterLink to="/product" class="primary-link">
            返回商品列表
          </RouterLink>

          <RouterLink to="/" class="secondary-link">
            回首頁
          </RouterLink>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.product-detail-page {
  min-height: 70vh;
  padding: 40px 20px;
  background: #f5f7fb;
}

.product-detail-container {
  max-width: 1000px;
  margin: 0 auto;
}

.back-link {
  display: inline-block;
  margin-bottom: 20px;
  color: #1f2937;
  font-weight: 800;
  text-decoration: none;
}

.back-link:hover {
  color: #2563eb;
}

.detail-card {
  display: grid;
  grid-template-columns: 420px 1fr;
  gap: 32px;
  align-items: start;
  padding: 24px;
  border-radius: 20px;
  background: #ffffff;
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.1);
}

.detail-image {
  width: 100%;
  height: 320px;
  object-fit: cover;
  border-radius: 16px;
  background: #e5e7eb;
}

.detail-info {
  padding: 8px 0;
}

.category {
  display: inline-block;
  margin-bottom: 10px;
  color: #2563eb;
  font-size: 14px;
  font-weight: 800;
}

.detail-info h2 {
  margin: 0 0 12px;
  color: #111827;
  font-size: 30px;
  line-height: 1.35;
}

.price {
  margin: 16px 0;
  color: #dc2626;
  font-size: 28px;
  font-weight: 900;
}

.description {
  margin: 16px 0;
  color: #4b5563;
  line-height: 1.7;
  font-weight: 600;
}

.product-meta {
  margin: 18px 0;
  padding: 14px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  background: #f9fafb;
}

.product-meta p {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin: 8px 0;
  color: #4b5563;
}

.product-meta strong {
  color: #111827;
}

.soldout {
  color: #b91c1c !important;
  font-weight: 900;
}

.add-button {
  width: 100%;
  margin-top: 20px;
  padding: 13px 20px;
  border: none;
  border-radius: 999px;
  color: #ffffff;
  background: #222222;
  font-size: 16px;
  font-weight: 800;
  cursor: pointer;
}

.add-button:hover {
  background: #444444;
}

.add-button.soldout,
.add-button:disabled {
  color: #ffffff;
  background: #9ca3af;
  cursor: not-allowed;
  opacity: 1;
}

.product-not-found {
  max-width: 760px;
  margin: 0 auto;
}

.not-found-card {
  padding: 48px 28px;
  border: 1px solid #e5e7eb;
  border-radius: 24px;
  background-color: #ffffff;
  text-align: center;
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.1);
}

.not-found-icon {
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

.error-label {
  margin: 0 0 8px;
  color: #2563eb;
  font-size: 13px;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.not-found-card h2 {
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
  .product-detail-page {
    padding: 28px 16px;
  }

  .detail-card {
    grid-template-columns: 1fr;
    padding: 20px;
  }

  .detail-image {
    height: 260px;
  }

  .detail-info h2 {
    font-size: 26px;
  }

  .price {
    font-size: 24px;
  }

  .not-found-card {
    padding: 40px 20px;
  }

  .not-found-icon {
    width: 60px;
    height: 60px;
    font-size: 34px;
  }

  .not-found-card h2 {
    font-size: 26px;
  }

  .not-found-actions {
    flex-direction: column;
  }

  .primary-link,
  .secondary-link {
    width: 100%;
  }
}

@media (max-width: 420px) {
  .detail-image {
    height: 220px;
  }

  .product-meta p {
    display: grid;
    gap: 4px;
  }
}
</style>