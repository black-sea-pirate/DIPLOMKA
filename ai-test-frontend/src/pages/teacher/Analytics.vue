<!--  -------------------------------------------------------------------------
      src/pages/teacher/Analytics.vue

      Страница с двумя диаграммами:
        • BarChart  — «Coverage»   (процент покрытия тем материалами)
        • RadarChart — «Mastery»   (уровень освоения компетенций)
      Сейчас данные жёстко захардкожены (мок).  Когда бекенд начнёт
      отдавать статистику, достаточно заменить массивы coverageData /
      masteryData на данные, полученные через API.

      Для trainee:
        • BarChart и RadarChart — это «умные» обёртки, см. файлы:
            ├─ src/components/Charts/BarChart.vue
            └─ src/components/Charts/RadarChart.vue
        • Вся верстка Tailwind — всего пара utility-классов для отступов,
          фона и сетки.
      --------------------------------------------------------------------- -->

<script setup>
/* ----------------------------------------------------------------------------
 * Импортируем компоненты диаграмм.
 * Путь начинается с '../../' потому что:
 *   Analytics.vue      лежит  — src/pages/teacher/
 *   BarChart.vue       лежит  — src/components/Charts/
 *     ↑ ↑   два уровня вверх —        ../../
 * ----------------------------------------------------------------------------
 *  Если в проекте настроен алиас '@/ …' (vite.config.js),
 *  можно заменить на   import BarChart from '@/components/Charts/BarChart.vue'
 * ------------------------------------------------------------------------- */
import BarChart from "../../components/Charts/BarChart.vue";
import RadarChart from "../../components/Charts/RadarChart.vue";

/* --------------------------------------------------------------------------
 * MOCK-данные: подставлены вручную для визуального теста макета.
 * ─ coverage*   → столбики (BarChart)
 * ─ mastery*    → радиальная диаграмма (RadarChart)
 * При интеграции с API:
 *   1) Сделать  onMounted(async () => { const { data } = await api.get(...) })
 *   2) Заменить эти константы реактивными переменными.
 * ----------------------------------------------------------------------- */
const coverageLabels = [
  "Algebra",
  "Geometry",
  "History",
  "Biology",
  "Literature",
];
const coverageData = [80, 55, 70, 60, 90];

const masteryLabels = [
  "Analysis",
  "Recall",
  "Application",
  "Creativity",
  "Speed",
];
const masteryData = [65, 80, 55, 45, 70];
</script>

<template>
  <h2 class="text-xl font-semibold mb-6">Analytics</h2>

  <!-- Сетка: две колонки на >= lg экранах,  gap-6 = расстояние 1.5rem -->
  <div class="grid gap-6 lg:grid-cols-2">
    <!-- ─────────────── Coverage (Bar) ─────────────── -->
    <div class="p-4 bg-white rounded shadow">
      <h3 class="font-medium mb-2">Coverage (%)</h3>
      <BarChart :labels="coverageLabels" :data="coverageData" />
    </div>

    <!-- ─────────────── Mastery (Radar) ─────────────── -->
    <div class="p-4 bg-white rounded shadow">
      <h3 class="font-medium mb-2">Mastery Radar</h3>
      <RadarChart :labels="masteryLabels" :data="masteryData" />
    </div>
  </div>
</template>

<!--
  Tailwind-пояснения:
    grid gap-6           — CSS Grid + промежуток между карточками
    lg:grid-cols-2       — одна колонка (моб.), две колонки ≥ 1024px
    p-4 bg-white rounded shadow
                         — карточка с заполнением, скруглением и тенью
-->
<!--
Когда подключим настоящий бекенд
Заменим константы на реактивные ref() или reactive() объекты.
В onMounted или через Pinia-store запросим /analytics и заполним массивы.
Компонент BarChart / RadarChart менять не нужно — они автоматически
перерисуют графики при изменении labels/data.
-->
