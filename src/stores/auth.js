import { ref, computed, watch } from "vue"
import { defineStore } from "pinia"

export const useAuthStore = defineStore("auth", () => {
  const savedToken = localStorage.getItem("token")
  const getSavedUser = ()=>{
    try{
      const saveItem = localStorage.getItem("user");
      const savedUser = saveItem ? JSON.parse(saveItem) : null;
      return savedUser;
    }
    catch(error){
      console.warn("解析使用者資料失敗", error)
      return null;
    }
  }

  const token = ref(savedToken || "")
  const user = ref(getSavedUser())

  const isLogin = computed(() => {
    return !!token.value
  })

  const isAdmin = computed(()=>{
    return user.value?.role === "admin"
  })

  const login = async (loginData) => {
    await new Promise((resolve)=>{
      setTimeout(()=>{
        resolve();
      },2000)
    })
    if (loginData.password !== "123456") {
      return {
        success: false,
        message: "密碼錯誤，測試密碼請輸入 123456",
      }
    }

    const fakeToken = "fake-token-123"

    token.value = fakeToken

    user.value = {
      id: 1,
      name: "測試會員",
      email: loginData.email,
      role:"admin"
    }

    return {
      success: true,
      message: "登入成功！",
    }
  }

  const logout = () => {
    token.value = ""
    user.value = null

    return {
      success: true,
      message: "已成功登出",
    }
  }

  watch(
    token,
    (newToken) => {
      if (newToken) {
        localStorage.setItem("token", newToken)
      } else {
        localStorage.removeItem("token")
      }
    }
  )

  watch(
    user,
    (newUser) => {
      if (newUser) {
        localStorage.setItem("user", JSON.stringify(newUser))
      } else {
        localStorage.removeItem("user")
      }
    },
    { deep: true }
  )

  return {
    token,
    user,
    isLogin,
    isAdmin,
    login,
    logout,
  }
})