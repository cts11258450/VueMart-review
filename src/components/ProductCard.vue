<script setup>
import { computed } from "vue"
import { RouterLink } from "vue-router"
import { formatPrice } from "../utils/formatPrice.js"
import { useCartStore } from "../stores/cart.js"

const cartStore = useCartStore()

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(["add-to-cart"])

const remainStock = computed(() => {
  const targetItem = cartStore.cart.find((cartItem) => {
    return cartItem.id === props.product.id
  })

  const cartQty = targetItem ? targetItem.qty : 0

  return props.product.stock - cartQty
})

const isSoldOut = computed(() => {
  return remainStock.value <= 0
})

const isLowStock = computed(() => {
  return remainStock.value > 0 && remainStock.value <= 3
})

const stockText = computed(() => {
  if (isSoldOut.value) {
    return "已售完"
  }

  if (isLowStock.value) {
    return `庫存緊張，剩餘 ${remainStock.value} 件`
  }

  return `剩餘庫存：${remainStock.value} 件`
})

const handleAddToCart = () => {
  emit("add-to-cart", props.product)
}
</script>

<template>
  <div class="product-card">
    <RouterLink :to="`/product/${product.id}`" class="image-link">
      <img
        :src="product.image"
        :alt="product.name"
        class="product-image"
      >
    </RouterLink>

    <div class="product-info">
      <span class="product-category">
        {{ product.category }}
      </span>

      <RouterLink
        :to="`/product/${product.id}`"
        class="product-title"
      >
        <h3>{{ product.name }}</h3>
      </RouterLink>

      <p class="product-price">
        {{ formatPrice(product.price) }}
      </p>

      <p
        class="stock-status"
        :class="{
          soldout: isSoldOut,
          low: isLowStock,
        }"
      >
        {{ stockText }}
      </p>

      <button
        class="add-button"
        :class="{ soldout: isSoldOut }"
        :disabled="isSoldOut"
        @click="handleAddToCart"
      >
        {{ isSoldOut ? "已售完" : "加入購物車" }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.product-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  border: 1px solid #eeeeee;
  border-radius: 18px;
  background-color: #ffffff;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.product-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.08);
}

.image-link {
  display: block;
  overflow: hidden;
}

.product-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  display: block;
  transition: transform 0.2s ease;
}

.product-card:hover .product-image {
  transform: scale(1.03);
}

.product-info {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 16px;
}

.product-category {
  display: inline-block;
  width: fit-content;
  margin-bottom: 8px;
  padding: 4px 10px;
  border-radius: 999px;
  background-color: #f3f3f3;
  color: #666666;
  font-size: 13px;
  font-weight: 700;
}

.product-title {
  color: inherit;
  text-decoration: none;
}

.product-title:hover {
  text-decoration: underline;
}

.product-info h3 {
  margin: 0 0 10px;
  font-size: 18px;
  line-height: 1.4;
}

.product-price {
  margin: 0 0 12px;
  color: #222222;
  font-size: 20px;
  font-weight: 800;
}

.stock-status {
  margin: 0 0 16px;
  color: #666666;
  font-size: 14px;
  line-height: 1.5;
}

.stock-status.low {
  color: #dd6b20;
  font-weight: 700;
}

.stock-status.soldout {
  color: #c53030;
  font-weight: 700;
}

.add-button {
  width: 100%;
  margin-top: auto;
  padding: 11px 14px;
  border: none;
  border-radius: 999px;
  background-color: #222222;
  color: #ffffff;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.2s ease, opacity 0.2s ease;
}

.add-button:hover {
  background-color: #444444;
}

.add-button.soldout,
.add-button:disabled {
  background-color: #cccccc;
  color: #777777;
  cursor: not-allowed;
  opacity: 0.8;
}

@media (max-width: 640px) {
  .product-image {
    height: 180px;
  }

  .product-info {
    padding: 14px;
  }

  .product-category {
    font-size: 12px;
  }

  .product-info h3 {
    font-size: 17px;
  }

  .product-price {
    font-size: 19px;
  }

  .add-button {
    padding: 12px 14px;
    font-size: 15px;
  }
}

@media (max-width: 420px) {
  .product-image {
    height: 165px;
  }

  .product-info h3 {
    font-size: 16px;
  }
}
</style>