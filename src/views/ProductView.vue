<script setup>
import { ref, computed, watch } from "vue"
import { useRoute, useRouter } from "vue-router"

import { handleShowToast } from "../utils/toastHelper.js"

import ProductCard from "../components/ProductCard.vue"

import { useProductStore } from "../stores/product.js"
import { useCartStore } from "../stores/cart.js"

const route = useRoute()
const router = useRouter()

const productStore = useProductStore()
const cartStore = useCartStore()

const validSortTypes = ["default", "price-asc", "price-desc"]

const searchKeyword = ref("")
const selectedCategory = ref("all")
const sortType = ref("default")

const categories = computed(() => {
  return [...new Set(productStore.products.map((product) => {
    return product.category
  }))]
})

const getSafeCategoryFromQuery = () => {
  const queryCategory = route.query.category

  if (categories.value.includes(queryCategory)) {
    return queryCategory
  }

  return "all"
}

const getSafeSortTypeFromQuery = () => {
  const querySort = route.query.sort

  if (validSortTypes.includes(querySort)) {
    return querySort
  }

  return "default"
}

const syncStateFromQuery = () => {
  searchKeyword.value = route.query.keyword || ""
  selectedCategory.value = getSafeCategoryFromQuery()
  sortType.value = getSafeSortTypeFromQuery()
}

const getQueryFromState = () => {
  return {
    keyword: searchKeyword.value.trim() || undefined,
    category: selectedCategory.value !== "all" ? selectedCategory.value : undefined,
    sort: sortType.value !== "default" ? sortType.value : undefined,
  }
}

const syncQueryFromState = () => {
  router.replace({
    path: "/product",
    query: getQueryFromState(),
  })
}

watch(
  () => [route.query.keyword, route.query.category, route.query.sort],
  () => {
    syncStateFromQuery()
  },
  {
    immediate: true,
  },
)

watch(
  [searchKeyword, selectedCategory, sortType],
  () => {
    syncQueryFromState()
  },
)

const filteredProducts = computed(() => {
  const keyword = searchKeyword.value.trim().toLowerCase()

  let result = productStore.products.filter((product) => {
    const matchKeyword = product.name.toLowerCase().includes(keyword)

    const matchCategory =
      selectedCategory.value === "all" ||
      product.category === selectedCategory.value

    return matchKeyword && matchCategory
  })

  result = [...result]

  if (sortType.value === "price-asc") {
    result.sort((a, b) => {
      return a.price - b.price
    })
  }

  if (sortType.value === "price-desc") {
    result.sort((a, b) => {
      return b.price - a.price
    })
  }

  return result
})

const hasActiveFilters = computed(() => {
  return (
    searchKeyword.value.trim() !== "" ||
    selectedCategory.value !== "all" ||
    sortType.value !== "default"
  )
})

const clearSearch = () => {
  searchKeyword.value = ""
}

const resetFilters = () => {
  searchKeyword.value = ""
  selectedCategory.value = "all"
  sortType.value = "default"
}

const handleAddToCart = (product) => {
  const result = cartStore.addToCart(product)
  handleShowToast(result)
}
</script>

<template>
  <main class="product">
    <section class="product-hero">
      <h2>商品列表</h2>
      <p class="intro">
        這裡顯示目前 VueMart 的商品資料。
      </p>
    </section>

    <section class="toolbar">
      <div class="search-field">
        <label for="search">搜尋商品</label>

        <div class="search-box">
          <input
            id="search"
            v-model="searchKeyword"
            type="text"
            placeholder="搜尋商品名稱..."
            class="search-input"
          >

          <button
            v-if="searchKeyword"
            type="button"
            class="clear-search-button"
            @click="clearSearch"
          >
            清除搜尋
          </button>
        </div>
      </div>

      <div class="filter-field">
        <label for="category">分類</label>

        <select
          id="category"
          v-model="selectedCategory"
          class="category-select"
        >
          <option value="all">全部分類</option>

          <option
            v-for="category in categories"
            :key="category"
            :value="category"
          >
            {{ category }}
          </option>
        </select>
      </div>

      <div class="filter-field">
        <label for="sort">排序</label>

        <select
          id="sort"
          v-model="sortType"
          class="sort-select"
        >
          <option value="default">預設排序</option>
          <option value="price-asc">價格由低到高</option>
          <option value="price-desc">價格由高到低</option>
        </select>
      </div>

      <button
        v-if="hasActiveFilters"
        type="button"
        class="reset-button"
        @click="resetFilters"
      >
        重置篩選
      </button>
    </section>

    <section class="product-status">
      <p
        v-if="hasActiveFilters"
        class="search-status"
      >
        目前顯示 {{ filteredProducts.length }} / {{ productStore.products.length }} 個商品。
      </p>

      <p
        v-else
        class="search-status"
      >
        共 {{ productStore.products.length }} 個商品。
      </p>
    </section>

    <section
      v-if="filteredProducts.length === 0"
      class="empty-result"
    >
      <h3>找不到符合條件的商品</h3>
      <p>可以試著清除搜尋，或重置分類與排序。</p>

      <button
        type="button"
        class="reset-button"
        @click="resetFilters"
      >
        重置篩選
      </button>
    </section>

    <section
      v-else
      class="product-grid"
    >
      <ProductCard
        v-for="product in filteredProducts"
        :key="product.id"
        :product="product"
        @add-to-cart="handleAddToCart"
      />
    </section>
  </main>
</template>

<style scoped>
.product {
  max-width: 1180px;
  margin: 0 auto;
  padding: 32px 20px;
}

.product-hero {
  margin-bottom: 24px;
}

.product h2 {
  margin-bottom: 8px;
  font-size: 32px;
}

.intro {
  margin: 0;
  color: #666666;
  line-height: 1.6;
}

.toolbar {
  display: grid;
  grid-template-columns: 1fr 180px 180px auto;
  gap: 12px;
  align-items: end;
  margin-bottom: 16px;
  padding: 16px;
  border: 1px solid #eeeeee;
  border-radius: 18px;
  background-color: #ffffff;
}

.search-field,
.filter-field {
  display: grid;
  gap: 6px;
}

.search-field label,
.filter-field label {
  color: #555555;
  font-size: 13px;
  font-weight: 700;
}

.search-box {
  display: flex;
  gap: 8px;
}

.search-input,
.category-select,
.sort-select {
  width: 100%;
  padding: 11px 12px;
  border: 1px solid #dddddd;
  border-radius: 10px;
  background-color: #ffffff;
  color: #222222;
  font-size: 15px;
  font-weight: 600;
  outline: none;
}

.search-input {
  font-weight: 400;
}

.search-input:focus,
.category-select:focus,
.sort-select:focus {
  border-color: #222222;
}

.clear-search-button,
.reset-button {
  padding: 11px 14px;
  border: none;
  border-radius: 999px;
  background-color: #222222;
  color: #ffffff;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
}

.clear-search-button:hover,
.reset-button:hover {
  background-color: #444444;
}

.product-status {
  margin-bottom: 18px;
}

.search-status {
  margin: 0;
  color: #666666;
}

.empty-result {
  padding: 44px 24px;
  border: 1px dashed #cccccc;
  border-radius: 18px;
  background-color: #ffffff;
  color: #666666;
  text-align: center;
}

.empty-result h3 {
  margin-bottom: 8px;
  color: #222222;
}

.empty-result p {
  margin-bottom: 18px;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  align-items: stretch;
}

@media (max-width: 1100px) {
  .product-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 900px) {
  .toolbar {
    grid-template-columns: 1fr 1fr;
  }

  .search-field {
    grid-column: 1 / -1;
  }

  .product-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .product {
    padding: 24px 16px;
  }

  .product-hero {
    margin-bottom: 18px;
  }

  .product h2 {
    font-size: 28px;
  }

  .toolbar {
    grid-template-columns: 1fr;
    gap: 10px;
    padding: 14px;
  }

  .search-box {
    display: grid;
    grid-template-columns: 1fr auto;
  }

  .reset-button {
    width: 100%;
  }

  .product-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .empty-result {
    padding: 36px 18px;
  }
}

@media (max-width: 420px) {
  .search-box {
    grid-template-columns: 1fr;
  }

  .clear-search-button {
    width: 100%;
  }

  .product h2 {
    font-size: 26px;
  }
}
</style>