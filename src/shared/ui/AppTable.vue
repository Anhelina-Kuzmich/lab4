<script setup lang="ts" generic="T extends object">
import DataTable from "primevue/datatable";
import Column from "primevue/column";

interface ColumnDefinition<T> {
  field: keyof T & string;
  header: string;
}

defineProps<{
  rows: T[];
  columns: ColumnDefinition<T>[];
  loading?: boolean;
}>();
</script>

<template>
  <DataTable :value="rows" :loading="loading" striped-rows>
    <Column
      v-for="column in columns"
      :key="column.field"
      :field="column.field"
      :header="column.header"
    >
      <template v-if="$slots[column.field]" #body="{ data }">
        <slot :name="column.field" :row="data" />
      </template>
    </Column>
    <Column v-if="$slots.actions" header="Дії">
      <template #body="{ data }">
        <slot name="actions" :row="data" />
      </template>
    </Column>
    <template #empty>Нічого не знайдено.</template>
  </DataTable>
</template>
