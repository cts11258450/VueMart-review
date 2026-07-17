import { ref } from "vue"
import { defineStore } from "pinia"
import { getProducts, createProductApi, updateProductApi, deleteProductApi } from "../api/productApi.js"

const useProductStore = defineStore("product", () => {
  const products = ref([]);
  const isLoading = ref(false);
  const errorMessage = ref("");

  const resetError = () => {
    errorMessage.value = ""
  }

  const fetchProducts = async () => {
    if(isLoading.value){
      return;
    }
    if(products.value.length !== 0){
      return;
    }
    try {
      isLoading.value = true
      resetError()

      products.value = await getProducts()
    } catch (error) {
      console.error("商品資料載入失敗", error)
      errorMessage.value = "商品資料載入失敗，請確認 JSON Server 是否已啟動。"
      products.value = []
    } finally {
      isLoading.value = false
    }
  }

  const createProduct = async (productData)=>{
    const createdProduct = await createProductApi(productData);
    products.value.unshift(createdProduct);
    return{
      success:true,
      message:"商品新增成功",
      product:createdProduct
    }
  }

  const updateProduct = async (id, productData)=>{
    const updatedProduct = await updateProductApi(id, productData);

    const targetIndex = products.value.findIndex((product)=>{
      return String(product.id) === String(id);
    });

    if(targetIndex !== -1){
      products.value[targetIndex] = updatedProduct;
    }
    return{
      success:true,
      message:"商品更新成功",
      product:updatedProduct
    }
  }

  const deleteProduct = async (id)=>{
    
    const deletedProduct = products.value.find((product)=>{
          return String(product.id) === String(id);
      })

    if(deletedProduct){

      await deleteProductApi(id);

      products.value = products.value.filter((product)=>{
        return String(product.id) !== String(id);
      })

      return{
        success:true,
        message:"已成功刪除該商品",
        product:deletedProduct
      }
    }
    return{
      success: false,
      message: "找不到要刪除的商品",
      product: undefined,
    }

  }

  const getProductById = (id) => {
    const paramsId = String(id)

    return products.value.find((product) => {
      return String(product.id) === paramsId
    })
  }

  return {
    products,
    isLoading,
    errorMessage,
    fetchProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
  }
})

export { useProductStore } //也可以寫具名:export {useProductStore}，或者在一開始定義useProductStore時候寫:export const useProductStore = defineStore(.....)
