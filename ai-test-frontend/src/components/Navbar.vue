<!--  -------------------------------------------------------------------------
      src/components/Navbar.vue

      Простая верхняя панель (header) приложения.
      Отображает название и кнопку «Logout».  Компонент *не* связан с
      ролью — он виден и студенту, и учителю.

      После нажатия «Logout» вызывается user.logout():
        • токен/роль удаляются из Pinia + localStorage
        • роутер перенаправляет на /login  (логика внутри store/user.js)

      Бекенда этот файл не касается, поэтому при подключении реального
      сервера менять ничего не придётся.
      --------------------------------------------------------------------- -->

<script setup>
/* ----------------------------------------------------------------------------
 * Pinia-store «user» (см. src/stores/user.js) хранит:
 *   token, role, profile   + методы login/logout
 * Нам нужен только logout(), поэтому достаём store как объект user.
 * ---------------------------------------------------------------------------- */
import { useUserStore } from "@/stores/user";
const user = useUserStore(); // реактивный экземпляр стора
</script>

<template>
  <!-- ------------------------------------------------------------------
       Header: фиксированная высота 56 px (h-14 = 3.5rem)
       flex-контейнер выравнивает:
         • слева название
         • справа кнопку Log out
     ------------------------------------------------------------------ -->
  <header class="h-14 flex items-center justify-between px-4 bg-white shadow">
    <!-- Лого / заголовок -->
    <span class="font-semibold">AI-Driven Test Platform</span>

    <!-- Кнопка «Logout» -->
    <button
      class="text-sm text-red-600 border px-3 py-1 rounded hover:bg-red-50 transition-colors"
      @click="user.logout()"
    >
      Logout
    </button>
  </header>
</template>

<!--
  ▸ CSS-классы Tailwind:
      h-14                высота         (3.5rem)
      flex items-center   выравнивание по оси Y
      justify-between     пространство между лого и кнопкой
      px-4                горизонтальный padding
      bg-white shadow     белый фон + тень
      text-red-600        красный текст (Tailwind palette)
      hover:bg-red-50     лёгкая подсветка при наведении
      transition-colors   анимация смены цвета
-->
