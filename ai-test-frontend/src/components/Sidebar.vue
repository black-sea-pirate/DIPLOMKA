<!--  -------------------------------------------------------------------------
      src/components/Sidebar.vue

      Боковое меню, которое динамически подстраивается под роль пользователя
      (teacher | student).  Роль берём из Pinia-стора user.js.

      • Для teacher:
          /teacher            — материалы / дашборд
          /teacher/tests      — список тестов
          /teacher/analytics  — графики
      • Для student:
          /student            — дашборд учащегося
          /student/session    — запущенный тест (или список в будущем)
          /student/results    — итоговая heat-map
      --------------------------------------------------------------------- -->

<script setup>
import { computed } from "vue";
import { useUserStore } from "@/stores/user"; // Pinia store с token/role

const user = useUserStore(); // реактивный объект стора

/* ----------------------------------------------------------------------------
 * links — вычисляемый массив для <li>.  Меняется «на лету», если
 *   user.role становится другой (logout/login).
 * ------------------------------------------------------------------------- */
const links = computed(() => {
  // --- меню для преподавателя --------------------------------------------
  if (user.role === "teacher") {
    return [
      { name: "Dashboard", to: "/teacher" },
      { name: "Tests", to: "/teacher/tests" },
      { name: "Analytics", to: "/teacher/analytics" },
    ];
  }
  // --- меню для студента --------------------------------------------------
  return [
    { name: "Dashboard", to: "/student" },
    { name: "Tests", to: "/student/session" }, // позже можно /student/tests
    { name: "Results", to: "/student/results" },
  ];
});
</script>

<template>
  <!-- Ширина 14rem (w-56), тёмный фон, белый текст -->
  <aside class="w-56 bg-gray-800 text-gray-100">
    <nav class="mt-4">
      <ul>
        <!-- v-for по computed links -->
        <li v-for="l in links" :key="l.to">
          <!-- RouterLink = <a> c SPA-навигацией -->
          <RouterLink
            :to="l.to"
            class="block px-4 py-2 hover:bg-gray-700"
            active-class="bg-gray-900"
          >
            {{ l.name }}
          </RouterLink>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<!--
 Tailwind объяснение:
   w-56           = 224px        ширина сайдбара
   bg-gray-800    = глубокий серый фон
   text-gray-100  = почти белый цвет текста
   hover:bg-gray-700 — лёгкое осветление строки при наведении
   active-class   = класс, который RouterLink добавит к активному маршруту
   block px-4 py-2 = элемент ведёт себя как блочный, с паддингами
-->
