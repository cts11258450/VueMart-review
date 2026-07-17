<script setup>
defineProps({
  title: {
    type: String,
    default: "資料載入中...",
  },
  message: {
    type: String,
    default: "請稍候，正在取得最新資料。",
  },
})
</script>

<template>
  <section class="loading-state">
    <div class="loading-card">
      <div class="loading-spinner"></div>

      <h3>{{ title }}</h3>

      <p>
        {{ message }}
      </p>
    </div>
  </section>
</template>

<style scoped>
.loading-state {
  padding: 44px 24px;
  border-radius: 18px;
  background-color: #ffffff;
  text-align: center;
}

.loading-card {
  display: grid;
  justify-items: center;
  gap: 10px;
}

.loading-spinner {
  width: 36px;
  height: 36px;
  border: 4px solid #e5e7eb;
  border-top-color: #222222;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.loading-state h3 {
  margin: 8px 0 0;
  color: #222222;
  font-size: 22px;
  font-weight: 900;
}

.loading-state p {
  margin: 0;
  color: #4b5563;
  line-height: 1.6;
  font-weight: 700;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>