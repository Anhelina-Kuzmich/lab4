<script setup lang="ts">
import { LoginForm } from "@/features/auth";
</script>

<template>
  <section class="login-card card">
    <h1>Авторизація</h1>
    <p>Увійдіть, щоб переглядати та редагувати користувачів.</p>
    <LoginForm />
    <small>Демо-акаунт: <code>emilys</code> / <code>emilyspass</code></small>
  </section>
</template>

<style scoped>
.login-card {
  width: min(100%, 28rem);
  margin: 2rem auto;
  padding: 1.5rem;
}

h1 {
  margin-top: 0;
}

p {
  color: var(--p-text-muted-color);
}

small {
  display: block;
  margin-top: 1rem;
  color: var(--p-text-muted-color);
}
</style>
