<template>
  <div class="card p-4 shadow-sm border-0">
    <h2 class="fw-bold mb-3">Vue Lottery App</h2>
    <p class="text-secondary lead">
      Навчальний SPA-додаток для проведення лотереї серед учасників, управління
      користувачами через REST API та керування доступом.
    </p>

    <h4 class="mt-4 mb-3">Використані технології:</h4>
    <ul class="list-group list-group-flush mb-4">
      <li class="list-group-item">
        <strong>Vue 3</strong> + <strong>Composition API</strong> (`&lt;script
        setup&gt;`)
      </li>
      <li class="list-group-item">
        <strong>Vue Router 4</strong> (Lazy Loading, Dynamic Routes, Nested
        Routes, Navigation Guards)
      </li>
      <li class="list-group-item">
        <strong>Pinia</strong> для централізованого керування станом
      </li>
      <li class="list-group-item">
        <strong>TypeScript</strong> сувора типізація даних
      </li>
      <li class="list-group-item">
        <strong>VeeValidate + Zod</strong> для валідації форм
      </li>
      <li class="list-group-item">
        <strong>Repository Pattern</strong> для ізоляції доступу до DummyJSON
        API
      </li>
      <li class="list-group-item">
        <strong>Bootstrap 5 + SCSS</strong> для адаптивного інтерфейсу
      </li>
    </ul>

    <a
      href="https://github.com/Anhelina-Kuzmich/lab4"
      target="_blank"
      rel="noopener noreferrer"
      class="btn btn-primary"
      style="max-width: 320px"
    >
      <i class="bi bi-github me-2"></i>Переглянути репозиторій на GitHub
    </a>
  </div>
</template>
