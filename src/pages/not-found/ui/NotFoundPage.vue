<template>
  <section class="not-found">
    <p class="code">404</p>
    <h1>Сторінку не знайдено</h1>
    <p>Перевірте адресу або поверніться на головну сторінку.</p>
    <RouterLink to="/">На головну</RouterLink>
  </section>
</template>

<style scoped>
.not-found {
  padding: 4rem 1rem;
  text-align: center;
}

.code {
  margin: 0;
  color: var(--p-primary-color);
  font-size: 5rem;
  font-weight: 800;
}

a {
  color: var(--p-primary-color);
}
</style>
