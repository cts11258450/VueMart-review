<script setup>
import { RouterLink } from "vue-router"
</script>

<template>
  <main class="not-found-view">
    <section class="not-found-card">
      <div class="not-found-icon">
        !
      </div>

      <p class="error-code">
        404
      </p>

      <h1>找不到這個頁面</h1>

      <p class="description">
        你輸入的網址可能不存在，或是頁面已經被移除。
        可以回首頁，或前往商品列表繼續逛逛。
      </p>

      <div class="actions">
        <RouterLink to="/" class="primary-link">
          回首頁
        </RouterLink>

        <RouterLink to="/product" class="secondary-link">
          前往商品列表
        </RouterLink>
      </div>
    </section>
  </main>
</template>

<style scoped>
.not-found-view {
  min-height: 70vh;
  padding: 80px 20px;
  background: #f5f7fb;
}

.not-found-card {
  max-width: 760px;
  margin: 0 auto;
  padding: 48px 28px;
  border: 1px solid #e5e7eb;
  border-radius: 24px;
  background-color: #ffffff;
  text-align: center;
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.1);
}

.not-found-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 68px;
  height: 68px;
  margin: 0 auto 18px;
  border-radius: 50%;
  color: #c2410c;
  background-color: #fff7ed;
  font-size: 38px;
  font-weight: 900;
}

.error-code {
  margin: 0 0 8px;
  color: #2563eb;
  font-size: 72px;
  font-weight: 900;
  line-height: 1;
}

.not-found-card h1 {
  margin: 0 0 12px;
  color: #111827;
  font-size: 32px;
}

.description {
  max-width: 520px;
  margin: 0 auto 28px;
  color: #4b5563;
  line-height: 1.7;
  font-weight: 700;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}

.primary-link,
.secondary-link {
  display: inline-block;
  min-width: 140px;
  padding: 12px 20px;
  border-radius: 999px;
  text-align: center;
  text-decoration: none;
  font-weight: 800;
}

.primary-link {
  background-color: #222222;
  color: #ffffff;
}

.secondary-link {
  border: 1px solid #d1d5db;
  color: #111827;
  background-color: #ffffff;
}

.primary-link:hover {
  background-color: #444444;
}

.secondary-link:hover {
  background-color: #f3f4f6;
}

@media (max-width: 768px) {
  .not-found-view {
    padding: 48px 16px;
  }

  .not-found-card {
    padding: 40px 20px;
  }

  .not-found-icon {
    width: 60px;
    height: 60px;
    font-size: 34px;
  }

  .error-code {
    font-size: 60px;
  }

  .not-found-card h1 {
    font-size: 26px;
  }

  .actions {
    flex-direction: column;
  }

  .primary-link,
  .secondary-link {
    width: 100%;
  }
}
</style>