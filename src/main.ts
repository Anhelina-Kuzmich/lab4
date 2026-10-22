import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

import App from "./app/App.vue";
import { router } from "./app/providers/router";
import { registerServices } from "./app/providers/services";
import { setupUI } from "./app/providers/ui";
import "./app/styles/main.scss";

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

app.use(pinia);

registerServices();

setupUI(app);
app.use(router);

app.mount("#app");
