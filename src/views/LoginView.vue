<script setup>
import { ref, reactive } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useAuthStore } from "../stores/auth.js"
import { handleShowToast } from "../utils/toastHelper.js"

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const email = ref("")
const password = ref("")
const isLoading = ref(false)

const errorMessage = reactive({
  email: "",
  password: "",
})

const resetErrorMessage = () => {
  errorMessage.email = ""
  errorMessage.password = ""
}

const isValidEmail = (emailValue) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)
}

const handleLogin = async () => {
  resetErrorMessage()

  let isValid = true

  const emailValue = email.value.trim()
  const passwordValue = password.value.trim()

  if (!emailValue) {
    errorMessage.email = "請輸入 Email"
    isValid = false
  } else if (!isValidEmail(emailValue)) {
    errorMessage.email = "請輸入正確的 Email 格式"
    isValid = false
  }

  if (!passwordValue) {
    errorMessage.password = "請輸入密碼"
    isValid = false
  }

  if (isValid === false) {
    return
  }

  const loginData = {
    email: emailValue,
    password: passwordValue,
  }

  try {
    isLoading.value = true

    const result = await authStore.login(loginData)

    handleShowToast(result)

    if (result.success) {
      const redirectPath = route.query.redirect || "/"
      router.push(redirectPath)
    }
  } catch (error) {
    console.error("登入發生錯誤：", error)

    handleShowToast({
      success: false,
      message: "登入失敗，請稍後再試",
    })
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <section class="login-page">
    <div class="login-card">
      <h2>會員登入</h2>
      <p class="login-subtitle">登入後可以查看訂單與完成結帳</p>
      <div class="demo-account">
        <p class="demo-title">測試登入資訊</p>
        <p>Email：任意有效 Email，例如 test@gmail.com</p>
        <p>密碼：123456</p>
      </div>

      <form class="login-form" @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="請輸入 Email"
          >
        </div>

        <p v-if="errorMessage.email" class="error-message">
          {{ errorMessage.email }}
        </p>

        <div class="form-group">
          <label for="password">密碼</label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="請輸入密碼"
          >
        </div>

        <p v-if="errorMessage.password" class="error-message">
          {{ errorMessage.password }}
        </p>

        <button
          class="login-button"
          type="submit"
          :disabled="isLoading"
        >
          {{ isLoading ? "登入中..." : "登入" }}
        </button>
      </form>
    </div>
  </section>
</template>

<style scoped>
.login-page {
  min-height: 70vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 16px;
  background: #f5f7fb;
}

.login-card {
  width: 100%;
  max-width: 420px;
  padding: 32px;
  border-radius: 20px;
  background: #ffffff;
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.12);
}

.login-card h2 {
  margin: 0;
  color: #111827;
  font-size: 28px;
  text-align: center;
}

.login-subtitle {
  margin: 10px 0 28px;
  color: #4b5563;
  text-align: center;
  line-height: 1.6;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  color: #1f2937;
  font-weight: 700;
}

.form-group input {
  padding: 12px 14px;
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  color: #111827;
  background: #ffffff;
  font-size: 16px;
  outline: none;
}

.form-group input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.16);
}

.error-message {
  margin: 0;
  padding: 10px 12px;
  border-radius: 10px;
  color: #991b1b;
  background: #fee2e2;
  font-weight: 700;
}

.login-button {
  padding: 12px 16px;
  border: none;
  border-radius: 12px;
  color: #ffffff;
  background: #2563eb;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
}

.login-button:hover {
  background: #1d4ed8;
}
.demo-account {
  margin-bottom: 24px;
  padding: 14px 16px;
  border: 1px solid #bfdbfe;
  border-radius: 14px;
  background: #eff6ff;
  color: #1e3a8a;
}

.demo-account p {
  margin: 4px 0;
  line-height: 1.6;
  font-weight: 700;
}

.demo-title {
  color: #1e40af;
  font-size: 16px;
  font-weight: 900;
}

.login-button:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}
</style>