<script setup>
defineProps({
  title: {
    type: String,
    default: "資料載入失敗",
  },
  message: {
    type: String,
    default: "資料載入時發生錯誤，請稍後再試。",
  },
  retryText: {
    type: String,
    default: "重新載入",
  },
  showRetry: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(["retry"])
</script>

<template>
  <section class="error-state">
    <div class="error-card">
      <div class="error-icon" aria-hidden="true">
        !
      </div>

      <h3>{{ title }}</h3>

      <p>
        {{ message }}
      </p>

      <button
        v-if="showRetry"
        type="button"
        class="retry-button"
        @click="emit('retry')"
      >
        {{ retryText }}
      </button>
    </div>
  </section>
</template>

<style scoped>
.error-state {
  padding: 44px 24px;
  border-radius: 18px;
  background-color: #fff7f7;
  text-align: center;
}

.error-card {
  display: grid;
  justify-items: center;
  gap: 10px;
}

.error-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background-color: #fee2e2;
  color: #991b1b;
  font-size: 30px;
  font-weight: 900;
}

.error-state h3 {
  margin: 8px 0 0;
  color: #991b1b;
  font-size: 22px;
  font-weight: 900;
}

.error-state p {
  margin: 0;
  color: #7f1d1d;
  line-height: 1.6;
  font-weight: 700;
}

.retry-button {
  margin-top: 8px;
  min-width: 140px;
  padding: 12px 20px;
  border: none;
  border-radius: 999px;
  background-color: #222222;
  color: #ffffff;
  font-weight: 800;
  cursor: pointer;
}

.retry-button:hover {
  background-color: #444444;
}
</style>