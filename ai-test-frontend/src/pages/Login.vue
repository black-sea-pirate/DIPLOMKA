<!--  -------------------------------------------------------------------------
      src/pages/Login.vue

      Простая страница авторизации (email + выбор роли).
      Сейчас работает ВНЕ сервера: при submit создаёт «фейковый» JWT и
      сохраняет его в Pinia-store user.js.  После login() роутер-guard
      перебросит:
        • teacher → /teacher
        • student → /student

      Что trainee должен понимать:
        1. v-model двух переменных  (email, role)
        2. @submit.prevent — блокирует дефолтный <form> submit, вызываем
           свою функцию submit()
        3. Позже заменим user.login() на реальный запрос:
             const { data } = await api.post('/auth/login', { email, password })
             user.login({ token:data.token, role:data.role })
      --------------------------------------------------------------------- -->

<script setup>
import { ref } from "vue";
import { useUserStore } from "@/stores/user"; // Pinia-store с login/logout

/* ----------------------------------------------------------------------------
 * Локальные реактивные переменные для v-model
 *   email — поле ввода
 *   role  — select (student по умолчанию)
 * ---------------------------------------------------------------------------- */
const email = ref("");
const role = ref("student");

const user = useUserStore(); // доступ к user.login()

/* ----------------------------------------------------------------------------
 * submit()
 *   1) минимальная валидация: email обязателен
 *   2) вызываем login() с МОК-данными
 *   3) login() сам кладёт token в localStorage и перенаправит по роли
 * ---------------------------------------------------------------------------- */
function submit() {
  if (!email.value) return; // можно вывести сообщение об ошибке
  user.login({ token: "fake-jwt", role: role.value });
}
</script>

<template>
  <!-- Центрирование формы: flex + h-screen 
   <form @submit.prevent="submit"  .prevent="отмена" перезагрузки -->
  <div class="h-screen flex items-center justify-center bg-gray-50">
    <form
      @submit.prevent="submit"
      class="w-80 p-6 bg-white rounded-lg shadow space-y-4"
    >
      <h1 class="text-xl font-bold text-center">Login</h1>

      <!-- Email input -->
      <input
        v-model="email"
        type="email"
        placeholder="Email"
        class="w-full border rounded px-3 py-2"
      />

      <!-- Select роли -->
      <select v-model="role" class="w-full border rounded px-3 py-2">
        <option value="student">Student</option>
        <option value="teacher">Teacher</option>
      </select>

      <!-- Кнопка отправки -->
      <button
        type="submit"
        class="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
      >
        Sign in
      </button>
    </form>
  </div>
</template>

<!--
  Tailwind разбор:
    h-screen                 — высота на весь экран
    flex items-center …      — вертикальное и горизонтальное центрирование
    bg-gray-50               — светлая подложка
    w-80                     — фикс. ширина формы (20rem)
    space-y-4                — вертикальные отступы между элементами формы
    hover:bg-indigo-700      — лёгкое затемнение кнопки при наведении
-->

<!-- ⚠️ После подключения backend
     ─ Добавим поле password + yup-валидацию
     ─ Заменим submit() на асинхронный запрос:
         const { data } = await api.post('/auth/login', { email:email.value, password:pwd })
         user.login({ token:data.token, role:data.role })
-->
