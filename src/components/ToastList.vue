<script setup>
import {useToastStore} from "../stores/toast.js"

const toastStore = useToastStore();

</script>

<template>
    <div class="toast-container">
      <div
        v-for="toast in toastStore.toasts"
        :key="toast.id"
        class="toast"
        :class="toast.type"
      >
        {{ toast.text }}
        <button
          class="toast-close"
          @click="toastStore.removeToast(toast.id)"
        >
          ×
        </button>
      </div>
    </div>
</template>

<style scoped>
  .toast-container {
  position: fixed;
  right: 24px;
  top: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  z-index: 999;
}

.toast {
  min-width: 220px;
  padding: 12px 16px;
  border-radius: 8px;
  background: #333;
  color: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.16);

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.toast.success {
  background: #2f855a;
}

.toast.error {
  background: #c53030;
}

.toast.info {
  background: #2b6cb0;
}

.toast-close {
  border: none;
  background: transparent;
  color: inherit;
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
}
</style>