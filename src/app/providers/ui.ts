import type { App } from "vue";
import PrimeVue from "primevue/config";
import ConfirmationService from "primevue/confirmationservice";
import ToastService from "primevue/toastservice";
import Aura from "@primevue/themes/aura";

export function setupUI(app: App): void {
  app.use(PrimeVue, {
    theme: {
      preset: Aura,
      options: {
        darkModeSelector: ".my-app-dark",
      },
    },
  });
  app.use(ConfirmationService);
  app.use(ToastService);
}
