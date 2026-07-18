import { ref, computed, watch } from "vue"
import { defineStore } from "pinia"
import { registerUserApi, loginUserApi } from "../api/authApi.js"

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

  const register = async (registerData) => {
    const userData = {
      name: registerData.name.trim(),
      email: registerData.email.trim(),
      password: registerData.password,
      role: "user",
      createdAt: new Date().toISOString(),
    }
    const result = await registerUserApi(userData);

    return{
      success: result.success,
      message: result.message,
      user: result.user,
    }
  }

  const login = async (loginData) => {
    const result = await loginUserApi(loginData);

    if(!result.success){
      return result
    }

    token.value = result.token;
    user.value = result.user

    return {
      success: true,
      message: result.message,
      user: result.user
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
    register
  }
})