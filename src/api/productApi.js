import { mockProducts } from "../data/mockProducts.js"

const API_BASE_URL = "http://localhost:3000"
const shouldFail = false

const delay = (ms) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, ms)
  })
}

export const getProducts = async () => {
  await delay(1000)

  if (shouldFail) {
    throw new Error("商品載入錯誤")
  }

  if (import.meta.env.DEV) {
    const response = await fetch(`${API_BASE_URL}/products`)

    if (!response.ok) {
      throw new Error("商品資料載入失敗")
    }

    const products = await response.json()

    return products
  }

  return mockProducts
}

export const createProductApi = async (productData) =>{
  await delay(1000);

  if(import.meta.env.DEV){
    const response = await fetch(`${API_BASE_URL}/products`,{
        method:"POST",
        headers:{
          "Content-Type": "application/json"
        },
        body:JSON.stringify(productData)
    });
    if(!response.ok){
        throw new Error("更新商品新增失敗");
    }

    const createdProduct = response.json();
    return createdProduct;
  }

  return{
    ...productData,
    id: Date.now()
  }
}

export const updateProductApi = async (id, productData)=>{
  await delay(1000);

  if(import.meta.env.DEV){
    const response = await fetch(`${API_BASE_URL}/products/${id}`,{
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body:JSON.stringify(productData)
    });

    if(!response.ok){
      throw new Error("商品更新失敗");
    }
    
    const updateProduct = response.json();
    return updateProduct
  }

  return{
    id,
    ...productData
  }

}

export const deleteProductApi = async (id) =>{
  await delay(1000);

  if(import.meta.env.DEV){
    const response = await fetch(`${API_BASE_URL}/products/${id}`,{
      method:"DELETE"
    })
    if(!response.ok){
      throw new Error("商品刪除失敗");
    }
    return {
      id,
    }
  }

  return {
    id
  }
}