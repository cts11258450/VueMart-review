import { ref, watch } from "vue"
import { defineStore } from "pinia"
import { createOrderApi } from "../api/orderApi.js"

export const useOrderStore = defineStore("order", () => {
  const getSavedOrders = () => {
    try {
      const savedOrders = localStorage.getItem("orders")
      const parsedOrders = savedOrders ? JSON.parse(savedOrders) : []

      if (!Array.isArray(parsedOrders)) {
        return []
      }

      return parsedOrders
    } catch (error) {
      console.warn("orders localStorage 解析失敗，已改用空陣列", error)
      return []
    }
  }

  const orders = ref(getSavedOrders())

  const createOrder = async (orderData) => {
    if (!orderData || !Array.isArray(orderData.items)) {
      return {
        success: false,
        message: "訂單資料格式錯誤",
      }
    }

    if (orderData.items.length === 0) {
      return {
        success: false,
        message: "購物車是空的，無法建立訂單",
      }
    }

    const newOrder = {
      createdAt: new Date().toISOString(),

      userId: orderData.userId,
      userEmail: orderData.userEmail,

      customer: {
        name: orderData.customer?.name || "",
        phone: orderData.customer?.phone || "",
        address: orderData.customer?.address || "",
      },

      payment: orderData.payment,
      note: orderData.note || "",

      items: orderData.items,

      totalQty: orderData.totalQty,
      totalPrice: orderData.totalPrice,
    }

    const newOrderData = await createOrderApi(newOrder);

    orders.value.push(newOrderData)

    return {
      success: true,
      message: "訂單建立成功",
      order: newOrderData,
    }
  }

  const getOrderById = (id) => {
    const orderId = String(id)

    return orders.value.find((order) => {
      return String(order.id) === orderId
    })
  }

  const getOrdersByUserEmail = (email) => {
    return orders.value.filter((order) => {
      return order.userEmail === email
    })
  }

  watch(
    orders,
    () => {
      localStorage.setItem("orders", JSON.stringify(orders.value))
    },
    {
      deep: true,
    }
  )

  return {
    orders,
    createOrder,
    getOrderById,
    getOrdersByUserEmail,
  }
})