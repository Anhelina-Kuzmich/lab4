<script setup lang="ts">
import { useRouter } from "vue-router";
import { useSessionStore } from "@/entities/session";
import { AppButton } from "@/shared/ui";

const session = useSessionStore();
const router = useRouter();

function logout(): void {
  session.logout();
  void router.push({ name: "login" });
}
</script>

<template>
  <AppButton
    label="Вийти"
    icon="pi pi-sign-out"
    severity="secondary"
    variant="text"
    @click="logout"
  />
</template>
