<script setup>
import { computed, onMounted, reactive, ref } from "vue"
import { RouterLink } from "vue-router"

import { useProductStore } from "../stores/product.js"

import { formatPrice } from "../utils/formatPrice.js"
import { handleShowToast } from "../utils/toastHelper.js"

import LoadingState from "../components/LoadingState.vue"
import ErrorState from "../components/ErrorState.vue"

const productStore = useProductStore()

const isCreateFormOpen = ref(false)
const isCreating = ref(false)
const isUpdating = ref(false)
const deletingProductId = ref(null)

const productForm = reactive({
  name: "",
  category: "鍵盤",
  price: "",
  stock: "",
  rating: "",
  image: "",
  description: "",
})

const errorToast = reactive({
  name: "",
  price: "",
  stock: "",
  image: "",
});

const isEditFormOpen = ref(false)
const editingProductId = ref(null)

const editProductForm = reactive({
  name: "",
  category: "鍵盤",
  price: "",
  stock: "",
  rating: "",
  image: "",
  description: "",
})

const resetEditProductForm = ()=>{
  editingProductId.value = null

  editProductForm.name = ""
  editProductForm.category = "鍵盤"
  editProductForm.price = ""
  editProductForm.stock = ""
  editProductForm.rating = ""
  editProductForm.image = ""
  editProductForm.description = ""
};

const openEditForm = (product)=>{
  closeCreateForm();

  editingProductId.value = product.id

  editProductForm.name = product.name
  editProductForm.category = product.category
  editProductForm.price = product.price
  editProductForm.stock = product.stock
  editProductForm.rating = product.rating || ""
  editProductForm.image = product.image
  editProductForm.description = product.description || ""

  isEditFormOpen.value = true
};

const closeEditForm = () => {
  resetEditProductForm()
  isEditFormOpen.value = false
}

const products = computed(() => {
  return productStore.products
})

const totalProducts = computed(() => {
  return products.value.length
})

const totalStock = computed(() => {
  return products.value.reduce((total, product) => {
    return total + product.stock
  }, 0)
})

const soldOutProducts = computed(() => {
  return products.value.filter((product) => {
    return product.stock === 0
  }).length
})

const resetErrorToast = () => {
  errorToast.name = ""
  errorToast.price = ""
  errorToast.stock = ""
  errorToast.image = ""
}

const resetProductForm = () => {
  productForm.name = ""
  productForm.category = "鍵盤"
  productForm.price = ""
  productForm.stock = ""
  productForm.rating = ""
  productForm.image = ""
  productForm.description = ""

  resetErrorToast()
}

const openCreateForm = () => {
  resetProductForm()
  isCreateFormOpen.value = true
}

const closeCreateForm = () => {
  resetProductForm()
  isCreateFormOpen.value = false
}

const formValid = (fromType) => {
  resetErrorToast()

  let isValid = true

  if (!fromType.name.trim()) {
    errorToast.name = "請輸入商品名稱"
    isValid = false
  }

  if (fromType.price === "" || Number(fromType.price) <= 0) {
    errorToast.price = "請輸入正確的商品價格"
    isValid = false
  }

  if (fromType.stock === "" || Number(fromType.stock) < 0) {
    errorToast.stock = "請輸入正確的商品庫存"
    isValid = false
  }

  if (!fromType.image.trim()) {
    errorToast.image = "請輸入商品圖片網址"
    isValid = false
  }

  return isValid
}

const handleCreateProduct = async () => {
  if (isCreating.value) {
    return
  }

  const formValidResult = formValid(productForm)

  if (!formValidResult) {
    return
  }

  try {
    isCreating.value = true

    const productData = {
      name: productForm.name.trim(),
      category: productForm.category,
      price: Number(productForm.price),
      stock: Number(productForm.stock),
      rating: productForm.rating ? Number(productForm.rating) : 0,
      image: productForm.image.trim(),
      description: productForm.description.trim(),
    }

    const result = await productStore.createProduct(productData)

    handleShowToast(result)

    closeCreateForm()
  } catch (error) {
    console.error("新增商品失敗", error)

    const result = {
      success: false,
      message: "商品新增失敗，請確認 JSON Server 是否已啟動。",
    }

    handleShowToast(result)
  } finally {
    isCreating.value = false
  }
}

const handleUpdateProduct = async () =>{
  if(isUpdating.value){
    return;
  }

  const formValidResult = formValid(editProductForm);
  if(!formValidResult){
    return;
  }

  try{
    isUpdating.value = true;

    const productId = editingProductId.value;
    const productData = {
      name: editProductForm.name.trim(),
      category: editProductForm.category,
      price: Number(editProductForm.price),
      stock: Number(editProductForm.stock),
      rating: editProductForm.rating ? Number(editProductForm.rating) : 0,
      image: editProductForm.image.trim(),
      description: editProductForm.description.trim(),
    }
    const result = await productStore.updateProduct(productId, productData);
    handleShowToast(result);
    closeEditForm();
  }
  catch(error){
    console.error(error);
    handleShowToast({
      success:false,
      message:"商品更新失敗，請確認 JSON Server 是否已啟動。"
    });
  }
  finally{
    isUpdating.value = false;
  }
}

const handleDeleteProduct = async (product)=>{
  if(deletingProductId.value){
    return;
  }

  const confirmed = window.confirm(`確定要刪除「${product.name}」嗎？`)
  if(!confirmed){
    return;
  }

  try{
    deletingProductId.value = product.id;
    const result = await productStore.deleteProduct(product.id);
    handleShowToast(result);
    if (String(editingProductId.value) === String(product.id)) {
      closeEditForm()
    }
  }
  catch(error){
    const result = {
      success:false,
      message:"商品刪除失敗，請確認 JSON Server 是否已啟動。"
    }
    handleShowToast(result);
  }
  finally{
    deletingProductId.value = null;
  }
}

onMounted(() => {
  productStore.fetchProducts()
})
</script>

<template>
  <main class="admin-products-view">

    <div class="admin-container">
      <section class="admin-hero">
        <div>
          <p class="admin-label">
            Admin Panel
          </p>

          <h1>後台商品管理</h1>

          <p>
            管理商品資料，包含商品名稱、分類、價格、庫存與後續新增、編輯、刪除功能。
          </p>
        </div>

        <RouterLink to="/product" class="back-link">
          回商品列表
        </RouterLink>
      </section>

      <section class="admin-stats">
        <div class="stat-card">
          <span>商品總數</span>
          <strong>{{ totalProducts }}</strong>
        </div>

        <div class="stat-card">
          <span>總庫存數</span>
          <strong>{{ totalStock }}</strong>
        </div>

        <div class="stat-card warning">
          <span>售完商品</span>
          <strong>{{ soldOutProducts }}</strong>
        </div>
      </section>

      <LoadingState
        v-if="productStore.isLoading"
        title="後台商品資料載入中..."
        message="請稍候，正在取得商品管理資料。"
      />

      <ErrorState
        v-else-if="productStore.errorMessage"
        title="商品資料載入失敗"
        :message="productStore.errorMessage"
        retry-text="重新載入"
        @retry="productStore.fetchProducts"
      />

      <template v-else>
        <section class="admin-card">
          <div class="admin-card-header">
            <div>
              <h2>商品列表</h2>
              <p>
                目前顯示所有商品資料。這一步已加入新增商品表單 UI。
              </p>
            </div>

            <button
              type="button"
              class="add-button"
              @click="openCreateForm"
            >
              新增商品
            </button>
          </div>

          <div
            v-if="isCreateFormOpen"
            class="product-form-card"
          >
            <div class="form-header">
              <div>
                <p class="form-label">
                  Create Product
                </p>

                <h3>新增商品</h3>

                <p>
                  填寫商品資料後，會透過 POST /products 新增商品。
                </p>
              </div>

              <button
                type="button"
                class="close-form-button"
                :disabled="isCreating"
                @click="closeCreateForm"
              >
                關閉
              </button>
            </div>

            <form
              class="product-form"
              @submit.prevent="handleCreateProduct"
            >
              <div class="form-grid">
                <div class="form-group">
                  <label for="product-name">商品名稱</label>

                  <input
                    id="product-name"
                    v-model="productForm.name"
                    type="text"
                    placeholder="例如：人體工學機械鍵盤"
                    :class="{ error: errorToast.name }"
                  >

                  <p
                    class="error-toast"
                    :class="{ invisible: !errorToast.name }"
                  >
                    {{ errorToast.name || "請輸入商品名稱" }}
                  </p>
                </div>

                <div class="form-group">
                  <label for="product-category">商品分類</label>

                  <select
                    id="product-category"
                    v-model="productForm.category"
                  >
                    <option value="鍵盤">鍵盤</option>
                    <option value="耳機">耳機</option>
                    <option value="螢幕">螢幕</option>
                    <option value="滑鼠">滑鼠</option>
                    <option value="喇叭">喇叭</option>
                    <option value="其他">其他</option>
                  </select>

                  <p class="error-toast invisible">
                    商品分類占位
                  </p>
                </div>

                <div class="form-group">
                  <label for="product-price">商品價格</label>

                  <input
                    id="product-price"
                    v-model.number="productForm.price"
                    type="number"
                    min="0"
                    placeholder="例如：3200"
                    :class="{ error: errorToast.price }"
                  >

                  <p
                    class="error-toast"
                    :class="{ invisible: !errorToast.price }"
                  >
                    {{ errorToast.price || "請輸入正確的商品價格" }}
                  </p>
                </div>

                <div class="form-group">
                  <label for="product-stock">商品庫存</label>

                  <input
                    id="product-stock"
                    v-model.number="productForm.stock"
                    type="number"
                    min="0"
                    placeholder="例如：10"
                    :class="{ error: errorToast.stock }"
                  >

                  <p
                    class="error-toast"
                    :class="{ invisible: !errorToast.stock }"
                  >
                    {{ errorToast.stock || "請輸入正確的商品庫存" }}
                  </p>
                </div>

                <div class="form-group">
                  <label for="product-rating">商品評分</label>

                  <input
                    id="product-rating"
                    v-model.number="productForm.rating"
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    placeholder="例如：4.8"
                  >

                  <p class="error-toast invisible">
                    商品評分占位
                  </p>
                </div>

                <div class="form-group">
                  <label for="product-image">商品圖片網址</label>

                  <input
                    id="product-image"
                    v-model="productForm.image"
                    type="url"
                    placeholder="請輸入圖片 URL"
                    :class="{ error: errorToast.image }"
                  >

                  <p
                    class="error-toast"
                    :class="{ invisible: !errorToast.image }"
                  >
                    {{ errorToast.image || "請輸入商品圖片網址" }}
                  </p>
                </div>
              </div>

              <div class="form-group">
                <label for="product-description">商品描述</label>

                <textarea
                  id="product-description"
                  v-model="productForm.description"
                  rows="4"
                  placeholder="請輸入商品描述"
                ></textarea>
              </div>

              <div class="form-preview">
                <h4>目前表單預覽</h4>

                <div class="preview-content">
                  <div
                    v-if="productForm.image"
                    class="preview-image-wrap"
                  >
                    <img
                      :src="productForm.image"
                      :alt="productForm.name || '商品圖片預覽'"
                      class="preview-image"
                    >
                  </div>

                  <div
                    v-else
                    class="preview-placeholder"
                  >
                    尚未輸入圖片
                  </div>

                  <div>
                    <p>
                      <span>名稱：</span>
                      <strong>{{ productForm.name || "尚未填寫" }}</strong>
                    </p>

                    <p>
                      <span>分類：</span>
                      <strong>{{ productForm.category }}</strong>
                    </p>

                    <p>
                      <span>價格：</span>
                      <strong>{{ productForm.price || "尚未填寫" }}</strong>
                    </p>

                    <p>
                      <span>庫存：</span>
                      <strong>
                        {{
                          productForm.stock === ""
                            ? "尚未填寫"
                            : productForm.stock
                        }}
                      </strong>
                    </p>

                    <p>
                      <span>評分：</span>
                      <strong>{{ productForm.rating || "尚未填寫" }}</strong>
                    </p>
                  </div>
                </div>
              </div>

              <div class="form-actions">
                <button
                  type="button"
                  class="cancel-button"
                  :disabled="isCreating"
                  @click="closeCreateForm"
                >
                  取消
                </button>

                <button
                  type="submit"
                  class="submit-button"
                  :disabled="isCreating"
                >
                  {{ isCreating ? "新增中..." : "新增商品" }}
                </button>
              </div>
            </form>
          </div>

          <div
            v-if="isEditFormOpen"
            class="product-form-card edit-form-card"
          >
            <div class="form-header">
              <div>
                <p class="form-label">
                  Edit Product
                </p>

                <h3>編輯商品</h3>

                <p>
                  目前正在編輯商品 ID：{{ editingProductId }}。下一步會串接 PATCH /products/:id API。
                </p>
              </div>

              <button
                type="button"
                class="close-form-button"
                @click="closeEditForm"
                :disabled="isUpdating"
              >
                關閉
              </button>
            </div>

            <form
              class="product-form"
              @submit.prevent="handleUpdateProduct"
            >
              <div class="form-grid">
                <div class="form-group">
                  <label for="edit-product-name">商品名稱</label>

                  <input
                    id="edit-product-name"
                    v-model="editProductForm.name"
                    type="text"
                    placeholder="例如：人體工學機械鍵盤"
                    :class="{ error: errorToast.name }"
                  >

                  <p
                    class="error-toast"
                    :class="{ invisible: !errorToast.name }"
                  >
                    {{ errorToast.name || "請輸入正確的商品名稱" }}
                  </p>
                </div>

                <div class="form-group">
                  <label for="edit-product-category">商品分類</label>

                  <select
                    id="edit-product-category"
                    v-model="editProductForm.category"
                  >
                    <option value="鍵盤">鍵盤</option>
                    <option value="耳機">耳機</option>
                    <option value="螢幕">螢幕</option>
                    <option value="滑鼠">滑鼠</option>
                    <option value="喇叭">喇叭</option>
                    <option value="其他">其他</option>
                  </select>

                  <p class="error-toast invisible">
                    商品分類占位
                  </p>
                </div>

                <div class="form-group">
                  <label for="edit-product-price">商品價格</label>

                  <input
                    id="edit-product-price"
                    v-model.number="editProductForm.price"
                    type="number"
                    min="0"
                    placeholder="例如：3200"
                  >

                  <p
                    class="error-toast"
                    :class="{ invisible: !errorToast.price }"
                  >
                    {{ errorToast.price || "請輸入正確的商品價格" }}
                  </p>
                </div>

                <div class="form-group">
                  <label for="edit-product-stock">商品庫存</label>

                  <input
                    id="edit-product-stock"
                    v-model.number="editProductForm.stock"
                    type="number"
                    min="0"
                    placeholder="例如：10"
                  >

                  <p
                    class="error-toast"
                    :class="{ invisible: !errorToast.stock }"
                  >
                    {{ errorToast.stock || "請輸入正確的商品庫存" }}
                  </p>
                </div>

                <div class="form-group">
                  <label for="edit-product-rating">商品評分</label>

                  <input
                    id="edit-product-rating"
                    v-model.number="editProductForm.rating"
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    placeholder="例如：4.8"
                  >

                  <p class="error-toast invisible">
                    編輯商品評分占位
                  </p>
                </div>

                <div class="form-group">
                  <label for="edit-product-image">商品圖片網址</label>

                  <input
                    id="edit-product-image"
                    v-model="editProductForm.image"
                    type="url"
                    placeholder="請輸入圖片 URL"
                  >

                  <p
                    class="error-toast"
                    :class="{ invisible: !errorToast.image }"
                  >
                    {{ errorToast.image || "請輸入正確的商品網址" }}
                  </p>
                </div>
              </div>

              <div class="form-group">
                <label for="edit-product-description">商品描述</label>

                <textarea
                  id="edit-product-description"
                  v-model="editProductForm.description"
                  rows="4"
                  placeholder="請輸入商品描述"
                ></textarea>
              </div>

              <div class="form-preview">
                <h4>編輯內容預覽</h4>

                <div class="preview-content">
                  <div
                    v-if="editProductForm.image"
                    class="preview-image-wrap"
                  >
                    <img
                      :src="editProductForm.image"
                      :alt="editProductForm.name || '商品圖片預覽'"
                      class="preview-image"
                    >
                  </div>

                  <div
                    v-else
                    class="preview-placeholder"
                  >
                    尚未輸入圖片
                  </div>

                  <div>
                    <p>
                      <span>名稱：</span>
                      <strong>{{ editProductForm.name || "尚未填寫" }}</strong>
                    </p>

                    <p>
                      <span>分類：</span>
                      <strong>{{ editProductForm.category }}</strong>
                    </p>

                    <p>
                      <span>價格：</span>
                      <strong>{{ editProductForm.price || "尚未填寫" }}</strong>
                    </p>

                    <p>
                      <span>庫存：</span>
                      <strong>
                        {{
                          editProductForm.stock === ""
                            ? "尚未填寫"
                            : editProductForm.stock
                        }}
                      </strong>
                    </p>

                    <p>
                      <span>評分：</span>
                      <strong>{{ editProductForm.rating || "尚未填寫" }}</strong>
                    </p>
                  </div>
                </div>
              </div>

              <div class="form-actions">
                <button
                  type="button"
                  class="cancel-button"
                  @click="closeEditForm"
                  :disabled="isUpdating"
                >
                  取消
                </button>

                <button
                  type="submit"
                  class="submit-button"
                  :disabled="isUpdating"
                >
                  {{isUpdating? "儲存中..." : "儲存修改"}}
                </button>
              </div>
            </form>
          </div>

          <div v-if="products.length === 0" class="empty-admin">
            <h3>目前沒有商品資料</h3>
            <p>請確認 JSON Server 是否有 products 資料，或稍後新增商品。</p>
          </div>

          <div v-else class="admin-table-wrapper">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>商品</th>
                  <th>分類</th>
                  <th>價格</th>
                  <th>庫存</th>
                  <th>狀態</th>
                  <th>操作</th>
                </tr>
              </thead>

              <tbody>
                <tr
                  v-for="product in products"
                  :key="product.id"
                >
                  <td>
                    <div class="product-cell">
                      <img
                        :src="product.image"
                        :alt="product.name"
                        class="product-image"
                      >

                      <div>
                        <strong>{{ product.name }}</strong>
                        <p>ID：{{ product.id }}</p>
                      </div>
                    </div>
                  </td>

                  <td>
                    {{ product.category }}
                  </td>

                  <td>
                    {{ formatPrice(product.price) }}
                  </td>

                  <td>
                    {{ product.stock }}
                  </td>

                  <td>
                    <span
                      class="status-badge"
                      :class="{
                        soldout: product.stock === 0,
                        low: product.stock > 0 && product.stock <= 5,
                      }"
                    >
                      {{
                        product.stock === 0
                          ? "售完"
                          : product.stock <= 5
                            ? "低庫存"
                            : "正常"
                      }}
                    </span>
                  </td>

                  <td>
                    <div class="action-buttons">
                      <button type="button" class="edit-button" @click="openEditForm(product)">
                        編輯
                      </button>

                      <button type="button" class="delete-button" @click="handleDeleteProduct(product)" :disabled="deletingProductId">
                        {{String(deletingProductId) === String(product.id) ? "刪除中..." : "刪除"}}
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </template>
    </div>
  </main>
</template>

<style scoped>
.admin-products-view {
  min-height: 70vh;
  padding: 32px 20px;
  background-color: #f5f7fb;
}

.admin-container {
  max-width: 1180px;
  margin: 0 auto;
}

.admin-hero {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: flex-start;
  margin-bottom: 24px;
  padding: 28px;
  border-radius: 24px;
  background-color: #ffffff;
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.08);
}

.admin-label {
  margin: 0 0 8px;
  color: #2563eb;
  font-size: 13px;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.admin-hero h1 {
  margin: 0 0 10px;
  color: #111827;
  font-size: 34px;
  font-weight: 900;
}

.admin-hero p {
  margin: 0;
  color: #4b5563;
  line-height: 1.7;
  font-weight: 700;
}

.back-link {
  flex-shrink: 0;
  padding: 11px 18px;
  border-radius: 999px;
  background-color: #222222;
  color: #ffffff;
  text-decoration: none;
  font-weight: 800;
}

.back-link:hover {
  background-color: #444444;
}

.admin-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
  margin-bottom: 24px;
}

.stat-card {
  display: grid;
  gap: 8px;
  padding: 22px;
  border: 1px solid #e5e7eb;
  border-radius: 18px;
  background-color: #ffffff;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
}

.stat-card span {
  color: #4b5563;
  font-weight: 800;
}

.stat-card strong {
  color: #111827;
  font-size: 32px;
  font-weight: 900;
}

.stat-card.warning strong {
  color: #dc2626;
}

.admin-card {
  padding: 24px;
  border: 1px solid #e5e7eb;
  border-radius: 22px;
  background-color: #ffffff;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
}

.admin-card-header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: flex-start;
  margin-bottom: 20px;
}

.admin-card-header h2 {
  margin: 0 0 8px;
  color: #111827;
  font-size: 24px;
  font-weight: 900;
}

.admin-card-header p {
  margin: 0;
  color: #4b5563;
  line-height: 1.6;
  font-weight: 700;
}

.add-button {
  flex-shrink: 0;
  padding: 11px 18px;
  border: none;
  border-radius: 999px;
  background-color: #2563eb;
  color: #ffffff;
  font-weight: 900;
  cursor: pointer;
}

.add-button:hover {
  background-color: #1d4ed8;
}

.product-form-card {
  margin-bottom: 24px;
  padding: 22px;
  border: 1px solid #bfdbfe;
  border-radius: 20px;
  background-color: #eff6ff;
}

.form-header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: flex-start;
  margin-bottom: 18px;
}

.form-label {
  margin: 0 0 6px;
  color: #2563eb;
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.form-header h3 {
  margin: 0 0 8px;
  color: #111827;
  font-size: 24px;
  font-weight: 900;
}

.form-header p {
  margin: 0;
  color: #374151;
  line-height: 1.6;
  font-weight: 700;
}

.close-form-button {
  flex-shrink: 0;
  padding: 9px 14px;
  border: none;
  border-radius: 999px;
  background-color: #ffffff;
  color: #111827;
  font-weight: 900;
  cursor: pointer;
}

.close-form-button:hover {
  background-color: #dbeafe;
}

.close-form-button:disabled {
  cursor: not-allowed;
  opacity: 0.65;
}

.product-form {
  display: grid;
  gap: 18px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  align-items: start;
}

.form-group {
  display: grid;
  grid-template-rows: auto auto 42px;
  gap: 8px;
}

.form-group label {
  min-height: 28px;
  color: #1f2937;
  font-weight: 900;
  line-height: 1.4;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 11px 12px;
  border: 1px solid #93c5fd;
  border-radius: 12px;
  background-color: #ffffff;
  color: #111827;
  font-size: 15px;
  outline: none;
}

.form-group input,
.form-group select {
  min-height: 62px;
}

.form-group textarea {
  min-height: 120px;
  resize: vertical;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.16);
}

.form-group input.error,
.form-group select.error,
.form-group textarea.error {
  border-color: #dc2626;
  background-color: #fff5f5;
}

.form-group input.error:focus,
.form-group select.error:focus,
.form-group textarea.error:focus {
  border-color: #dc2626;
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.16);
}

.error-toast {
  min-height: 42px;
  margin: 0;
  padding: 9px 12px;
  border-radius: 10px;
  background-color: #fee2e2;
  color: #991b1b;
  font-size: 14px;
  font-weight: 800;
  line-height: 1.5;
}

.error-toast.invisible {
  visibility: hidden;
}

.form-preview {
  padding: 18px;
  border-radius: 18px;
  background-color: #ffffff;
}

.form-preview h4 {
  margin: 0 0 14px;
  color: #111827;
  font-size: 18px;
  font-weight: 900;
}

.preview-content {
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: 18px;
  align-items: start;
}

.preview-image-wrap,
.preview-placeholder {
  width: 140px;
  height: 110px;
  border-radius: 14px;
  overflow: hidden;
  background-color: #e5e7eb;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4b5563;
  font-size: 14px;
  font-weight: 800;
}

.preview-content p {
  display: flex;
  gap: 8px;
  margin: 0 0 8px;
  color: #4b5563;
  font-weight: 700;
}

.preview-content strong {
  color: #111827;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.cancel-button,
.submit-button {
  min-width: 120px;
  padding: 11px 18px;
  border: none;
  border-radius: 999px;
  font-weight: 900;
  cursor: pointer;
}

.cancel-button {
  background-color: #ffffff;
  color: #111827;
}

.cancel-button:hover {
  background-color: #e5e7eb;
}

.submit-button {
  background-color: #2563eb;
  color: #ffffff;
}

.submit-button:hover {
  background-color: #1d4ed8;
}

.cancel-button:disabled,
.submit-button:disabled {
  cursor: not-allowed;
  opacity: 0.65;
}

.submit-button:disabled:hover {
  background-color: #2563eb;
}

.empty-admin {
  padding: 40px 20px;
  border-radius: 18px;
  background-color: #f9fafb;
  text-align: center;
}

.empty-admin h3 {
  margin: 0 0 8px;
  color: #111827;
  font-size: 24px;
  font-weight: 900;
}

.empty-admin p {
  margin: 0;
  color: #4b5563;
  font-weight: 700;
  line-height: 1.6;
}

.admin-table-wrapper {
  overflow-x: auto;
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 880px;
}

.admin-table th,
.admin-table td {
  padding: 14px 12px;
  border-bottom: 1px solid #e5e7eb;
  text-align: left;
  vertical-align: middle;
}

.admin-table th {
  color: #374151;
  background-color: #f9fafb;
  font-size: 14px;
  font-weight: 900;
}

.admin-table td {
  color: #111827;
  font-weight: 700;
}

.product-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.product-image {
  width: 58px;
  height: 58px;
  border-radius: 12px;
  object-fit: cover;
  background-color: #e5e7eb;
}

.product-cell strong {
  display: block;
  margin-bottom: 4px;
  color: #111827;
  font-weight: 900;
}

.product-cell p {
  margin: 0;
  color: #6b7280;
  font-size: 13px;
}

.status-badge {
  display: inline-flex;
  padding: 6px 10px;
  border-radius: 999px;
  background-color: #dcfce7;
  color: #166534;
  font-size: 13px;
  font-weight: 900;
}

.status-badge.low {
  background-color: #fef3c7;
  color: #92400e;
}

.status-badge.soldout {
  background-color: #fee2e2;
  color: #991b1b;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.edit-button,
.delete-button {
  padding: 8px 12px;
  border: none;
  border-radius: 999px;
  font-weight: 900;
  cursor: pointer;
}

.edit-button:disabled,
.delete-button:disabled {
  cursor: not-allowed;
  opacity: 0.65;
}

.delete-button:disabled:hover {
  background-color: #fef2f2;
}

.edit-button {
  background-color: #eff6ff;
  color: #1d4ed8;
}

.edit-button:hover {
  background-color: #dbeafe;
}

.delete-button {
  background-color: #fef2f2;
  color: #b91c1c;
}

.delete-button:hover {
  background-color: #fee2e2;
}

.edit-form-card {
  border-color: #fde68a;
  background-color: #fffbeb;
}

@media (max-width: 900px) {
  .admin-hero,
  .admin-card-header,
  .form-header {
    display: grid;
  }

  .back-link,
  .add-button,
  .close-form-button {
    width: fit-content;
  }

  .admin-stats {
    grid-template-columns: 1fr;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .preview-content {
    grid-template-columns: 1fr;
  }

  .preview-image-wrap,
  .preview-placeholder {
    width: 100%;
    height: 180px;
  }
}

@media (max-width: 520px) {
  .admin-products-view {
    padding: 24px 16px;
  }

  .admin-hero,
  .admin-card,
  .product-form-card {
    padding: 20px;
  }

  .admin-hero h1 {
    font-size: 28px;
  }

  .back-link,
  .add-button,
  .close-form-button,
  .cancel-button,
  .submit-button {
    width: 100%;
    text-align: center;
  }

  .form-actions {
    display: grid;
  }

}
</style>