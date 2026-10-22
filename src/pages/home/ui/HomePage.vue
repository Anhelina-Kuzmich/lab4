<script setup lang="ts">
import { AppButton } from "@/shared/ui";
</script>

<template>
  <section class="home-page">
    <p class="eyebrow">Керування користувачами</p>
    <h1>Вітаємо у Lottery App</h1>
    <p class="intro">
      Демонстраційний застосунок на Vue 3 з авторизацією, каталогом
      користувачів і архітектурою Feature-Sliced Design.
    </p>
    <div class="actions">
      <RouterLink to="/users">
        <AppButton label="Переглянути користувачів" severity="primary" />
      </RouterLink>
      <RouterLink to="/about">
        <AppButton label="Про проєкт" severity="secondary" variant="outlined" />
      </RouterLink>
    </div>
  </section>
</template>

<style scoped>
.home-page {
  display: grid;
  min-height: 55vh;
  align-content: center;
  justify-items: start;
  gap: 0.75rem;
}

.eyebrow {
  margin: 0;
  color: var(--p-primary-color);
  font-size: 0.9rem;
  font-weight: 700;
  text-transform: uppercase;
}

h1 {
  margin: 0;
  font-size: clamp(2rem, 6vw, 3.5rem);
}

.intro {
  max-width: 42rem;
  color: var(--p-text-muted-color);
  font-size: 1.1rem;
  line-height: 1.6;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.actions a {
  text-decoration: none;
}
</style>
