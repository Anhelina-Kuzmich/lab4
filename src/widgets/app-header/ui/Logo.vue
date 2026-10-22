<template>
  <RouterLink class="brand" to="/" aria-label="Lottery App — головна">
    Lottery<span>App</span>
  </RouterLink>
</template>

<style scoped>
.brand {
  color: var(--p-primary-color);
  font-size: 1.3rem;
  font-weight: 800;
  letter-spacing: -0.04em;
  text-decoration: none;
  white-space: nowrap;
}

.brand span {
  color: var(--p-text-color);
}
</style>
