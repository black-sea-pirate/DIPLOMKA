<!--  -------------------------------------------------------------------------
      src/layouts/MainLayout.vue

      Универсальный каркас приложения.
      ┌───────────────────────────────────────────────────────────────┐
      │            Navbar (фикс. высота)                              │
      ├───────┬───────────────────────────────────────────────────────┤
      │       │                                                       │
      │       │   <RouterView/>  — текущая страница (scroll-able)     │
      │Sidebar│                                                       │
      │fixed  │                                                       │
      └───────┴───────────────────────────────────────────────────────┘
      В Router (router/index.js) все teacher/student-роуты вложены
      внутрь этого layout, поэтому они автоматически получают общий UI.
      --------------------------------------------------------------------- -->

<script setup>
/*
  Импортируем два «скелетных» компонента интерфейса
  ─ Navbar   — верхняя панель (см. src/components/Navbar.vue)
  ─ Sidebar  — боковое меню   (см. src/components/Sidebar.vue)
*/
import Navbar from "@/components/Navbar.vue";
import Sidebar from "@/components/Sidebar.vue";
</script>

<template>
  <!-- Весь экран (h-screen) делится на: Sidebar (фикс. ширина) + контент -->
  <div class="flex h-screen">
    <!-- SIDE BAR (слева) -->
    <Sidebar />

    <!-- ПРАВАЯ ЧАСТЬ: навбар + контент ----------------------------------->
    <div class="flex-1 flex flex-col">
      <!-- Навигационная панель сверху -->
      <Navbar />

      <!-- Основная зона, прокручиваемая по Y,
           p-6    — внутренний отступ,
           bg-gray-50 — светло-серая подложка             -->
      <main class="flex-1 overflow-y-auto p-6 bg-gray-50">
        <!-- RouterView = «дырка», куда Vue-Router вставит
             компонент текущего маршрута (Dashboard, Tests, Session …) -->
        <RouterView />
      </main>
    </div>
  </div>
</template>

<!--
  Tailwind пояснения:
    flex              — горизонтальный flex-контейнер
    h-screen          — высота = 100 vh
    flex-1            — правая часть растягивается на всё оставшееся
    overflow-y-auto   — прокрутка только области main, а не всего окна
-->
