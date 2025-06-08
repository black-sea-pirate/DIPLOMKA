import { createApp } from "vue";
import App from "./App.vue";
import "./style.css";

import { createPinia } from "pinia";
import router from "./router";

/* --- создаём приложение --- */
const app = createApp(App);

/* --- создаём Pinia и подключаем persistence --- */
const pinia = createPinia();

// простой плагин-persist: кладём каждый store в localStorage
pinia.use(({ store }) => {
  // восстановить, если есть данные
  const saved = localStorage.getItem(store.$id);
  if (saved) store.$patch(JSON.parse(saved));

  // сохранять при любом изменении
  store.$subscribe((_mutation, state) => {
    localStorage.setItem(store.$id, JSON.stringify(state));
  });
});

/* --- регистрируем плагины --- */
app.use(pinia);
app.use(router);

/* --- монтируем --- */
app.mount("#app");
