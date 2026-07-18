<script setup>
import { ref, reactive } from "vue"
import { RouterLink, useRouter } from "vue-router"

import { handleShowToast } from "../utils/toastHelper.js"

import { useAuthStore } from "../stores/auth.js"

const authStore = useAuthStore();
const router = useRouter();

const isSubmitting = ref(false);
const successMessage = ref("")
const errorMessage = ref("")

const registerForm = reactive({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
})

const errors = reactive({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
})

const resetErrors = () => {
  errors.name = ""
  errors.email = ""
  errors.password = ""
  errors.confirmPassword = ""
}

const resetRegisterForm = () => {
  registerForm.name = ""
  registerForm.email = ""
  registerForm.password = ""
  registerForm.confirmPassword = ""
}

const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

const validateRegisterForm = () => {
  resetErrors()

  let isValid = true

  if (!registerForm.name.trim()) {
    errors.name = "請輸入姓名"
    isValid = false
  }

  if (!registerForm.email.trim()) {
    errors.email = "請輸入 Email"
    isValid = false
  } else if (!isValidEmail(registerForm.email)) {
    errors.email = "請輸入正確的 Email 格式"
    isValid = false
  }

  if (!registerForm.password) {
    errors.password = "請輸入密碼"
    isValid = false
  } else if (registerForm.password.length < 6) {
    errors.password = "密碼至少需要 6 個字元"
    isValid = false
  }

  if (!registerForm.confirmPassword) {
    errors.confirmPassword = "請再次輸入密碼"
    isValid = false
  } else if (registerForm.confirmPassword !== registerForm.password) {
    errors.confirmPassword = "兩次輸入的密碼不一致"
    isValid = false
  }

  return isValid
}

const handleRegister = async () => {
  const isValid = validateRegisterForm()

  if (!isValid) {
    return
  }

  successMessage.value = ""
  errorMessage.value = ""

  try{
    isSubmitting.value = true;

    const userData = {
        name:registerForm.name.trim(),
        email:registerForm.email.trim(),
        password:registerForm.password
    }
    const result = await authStore.register(userData)
    handleShowToast(result);
    if(!result.success){
        errorMessage.value = result.message;
        return;
    }
    
    successMessage.value = result.message
    resetRegisterForm();
    resetErrors();
    setTimeout(() => {
      router.push({
        path:"/login",
        query:{
          email:userData.email
        }
      });
    }, 2000);
  }
  catch(error){
    console.error("會員註冊失敗", error)
    const result = {
        success:false,
        message:"會員註冊失敗，請稍後再試"
    };
    handleShowToast(result);
    errorMessage.value = result.message
  }
  finally{
    isSubmitting.value = false
  }
}
</script>

<template>
  <main class="register-view">
    <section class="register-card">
      <div class="register-header">
        <p class="register-label">
          Create Account
        </p>

        <h1>註冊會員</h1>

        <p class="register-description">
          建立會員帳號後，可以登入並使用結帳、訂單查詢與後續會員功能。
        </p>
      </div>

      <div
        v-if="successMessage"
        class="status-message success"
        >
        {{ successMessage }}
        </div>

        <div
        v-if="errorMessage"
        class="status-message error"
        >
        {{ errorMessage }}
      </div>

      <form
        class="register-form"
        @submit.prevent="handleRegister"
      >
        <div class="form-group">
          <label for="name">姓名</label>

          <input
            id="name"
            v-model="registerForm.name"
            type="text"
            placeholder="請輸入姓名"
            :class="{ error: errors.name }"
            :disabled="isSubmitting"
          >

          <p
            class="error-message"
            :class="{ invisible: !errors.name }"
          >
            {{ errors.name || "姓名錯誤占位" }}
          </p>
        </div>

        <div class="form-group">
          <label for="email">Email</label>

          <input
            id="email"
            v-model="registerForm.email"
            type="email"
            placeholder="請輸入 Email"
            :class="{ error: errors.email }"
            :disabled="isSubmitting"
          >

          <p
            class="error-message"
            :class="{ invisible: !errors.email }"
          >
            {{ errors.email || "Email 錯誤占位" }}
          </p>
        </div>

        <div class="form-group">
          <label for="password">密碼</label>

          <input
            id="password"
            v-model="registerForm.password"
            type="password"
            placeholder="請輸入密碼，至少 6 個字元"
            :class="{ error: errors.password }"
            :disabled="isSubmitting"
          >

          <p
            class="error-message"
            :class="{ invisible: !errors.password }"
          >
            {{ errors.password || "密碼錯誤占位" }}
          </p>
        </div>

        <div class="form-group">
          <label for="confirm-password">確認密碼</label>

          <input
            id="confirm-password"
            v-model="registerForm.confirmPassword"
            type="password"
            placeholder="請再次輸入密碼"
            :class="{ error: errors.confirmPassword }"
            :disabled="isSubmitting"
          >

          <p
            class="error-message"
            :class="{ invisible: !errors.confirmPassword }"
          >
            {{ errors.confirmPassword || "確認密碼錯誤占位" }}
          </p>
        </div>

        <button
          type="submit"
          class="register-button"
          :disabled="isSubmitting"
        >
          {{isSubmitting ? "註冊中..." : "建立帳號" }}
        </button>
      </form>

      <div class="login-link-wrap">
        <span>已經有帳號？</span>

        <RouterLink to="/login" class="login-link">
          前往登入
        </RouterLink>
      </div>
    </section>
  </main>
</template>

<style scoped>
.register-view {
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 20px;
  background-color: #f5f7fb;
}

.register-card {
  width: 100%;
  max-width: 540px;
  padding: 32px;
  border-radius: 24px;
  background-color: #ffffff;
  box-shadow: 0 16px 40px rgba(15, 23, 42, 0.1);
}

.register-header {
  margin-bottom: 28px;
}

.register-label {
  margin: 0 0 10px;
  color: #2563eb;
  font-size: 13px;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.register-card h1 {
  margin: 0 0 12px;
  color: #111827;
  font-size: 32px;
  font-weight: 900;
}

.register-description {
  margin: 0;
  color: #4b5563;
  font-size: 16px;
  font-weight: 700;
  line-height: 1.7;
}

.register-form {
  display: grid;
  gap: 18px;
}

.form-group {
  display: grid;
  grid-template-rows: auto auto 42px;
  gap: 8px;
}

.form-group label {
  color: #1f2937;
  font-size: 15px;
  font-weight: 900;
}

.form-group input {
  width: 100%;
  min-height: 52px;
  padding: 12px 14px;
  border: 1px solid #cbd5e1;
  border-radius: 14px;
  background-color: #ffffff;
  color: #111827;
  font-size: 16px;
  font-weight: 700;
  outline: none;
}

.form-group input::placeholder {
  color: #9ca3af;
  font-weight: 600;
}

.form-group input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.16);
}

.form-group input.error {
  border-color: #dc2626;
  background-color: #fff5f5;
}

.form-group input.error:focus {
  border-color: #dc2626;
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.16);
}

.error-message {
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

.error-message.invisible {
  visibility: hidden;
}

.status-message {
  margin-bottom: 18px;
  padding: 12px 14px;
  border-radius: 14px;
  font-size: 15px;
  font-weight: 900;
  line-height: 1.6;
}

.status-message.success {
  border: 1px solid #bbf7d0;
  background-color: #dcfce7;
  color: #166534;
}

.status-message.error {
  border: 1px solid #fecaca;
  background-color: #fee2e2;
  color: #991b1b;
}

.form-group input:disabled {
  cursor: not-allowed;
  background-color: #f3f4f6;
  color: #6b7280;
}

.register-button {
  width: 100%;
  min-height: 52px;
  margin-top: 6px;
  border: none;
  border-radius: 999px;
  background-color: #2563eb;
  color: #ffffff;
  font-size: 16px;
  font-weight: 900;
  cursor: pointer;
}

.register-button:hover {
  background-color: #1d4ed8;
}

.login-link-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  margin-top: 22px;
  color: #4b5563;
  font-size: 15px;
  font-weight: 700;
}

.login-link {
  color: #2563eb;
  font-weight: 900;
  text-decoration: none;
}

.login-link:hover {
  color: #1d4ed8;
  text-decoration: underline;
}

.register-button:disabled {
  cursor: not-allowed;
  opacity: 0.65;
}

.register-button:disabled:hover {
  background-color: #2563eb;
}

@media (max-width: 520px) {
  .register-view {
    padding: 32px 16px;
  }

  .register-card {
    padding: 24px;
  }

  .register-card h1 {
    font-size: 28px;
  }
}
</style>