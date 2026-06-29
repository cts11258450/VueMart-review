import { ref, computed, watch } from "vue"
import { defineStore } from "pinia"

export const useCartStore = defineStore("cart", () => {
  //state
  const getSavedCart = () => {
    try{
        const saveCart = localStorage.getItem("cart");
        const parsedCart = saveCart? JSON.parse(saveCart) : [];
        return Array.isArray(parsedCart)? parsedCart : [];
    }
    catch(error){
        console.warn("cart is not array!")
        return [];
    }
  }
  
  const cart = ref(getSavedCart());


  //getters
  const totalQty = computed(() => {
    return cart.value.reduce((sum, item) => {
      return sum + item.qty
    }, 0)
  })

  const totalPrice = computed(() => {
    return cart.value.reduce((sum, item) => {
      return sum + item.price * item.qty
    }, 0)
  })

  watch(cart,(newCart)=>{
    localStorage.setItem("cart",JSON.stringify(newCart));
  },{
    deep:true
  })
  
  //actions
  const addToCart = (product) => {
    if(product.stock <= 0){
        return{
            success:false,
            message:`[${product.name}已售完!]`
        }
    }

    const targetItem = cart.value.find((item) => {
      return item.id === product.id
    })

    if (targetItem) {
        if(product.stock <= targetItem.qty){
            return{
                success:false,
                message:`[${targetItem.name}已達上限!]`
            }
        }
        targetItem.qty++
    } else {
      cart.value.push({
        ...product,
        qty: 1,
      })
    }

    return{
        success:true,
        message:`[${product.name}已加入購物車!]`
    }
  }

  const remove = (id) => {
    cart.value = cart.value.filter((item) => {
      return item.id !== id
    })
  }

  const updateQty = (id, option) => {
    const targetItem = cart.value.find((item) => {
      return item.id === id
    })

    if (!targetItem) {
      return {
        success: false,
        message: "找不到購物車商品",
      }
    }

  const newQty = targetItem.qty + option

    if(newQty > targetItem.stock){
        return{
            success: false,
            message: `[${targetItem.name}] 已達庫存上限`,
        }
    }

    if (newQty > 0) {
      targetItem.qty = newQty;
      return {
        success: true,
        message: `已更新[${targetItem.name}]數量`,
      }
    } 
    else {
      remove(id);
      return {
        success: true,
        message: `已將[${targetItem.name}]從購物車中移除`,
      }
    }
  }

  const clearCart = () => {
    cart.value = []
  }


  return {
    cart,
    totalQty,
    totalPrice,
    addToCart,
    remove,
    updateQty,
    clearCart,
  }
})