<!--  -------------------------------------------------------------------------
      src/pages/student/Results.vue

      Страница отображает «мини-heat-map» по темам/вопросам.
      Сейчас данные берутся из Pinia-store test.answers и обсчитываются
      по упрощённому правилу (см. demo-агрегацию ниже).  Это временное
      решение: когда появится реальный backend-чек правильности ответов,
      блок “SECTION:DEMO_SCORE” будет заменён вызовом API.

      Для trainee:
        • computed() — реактивно пересчитает stats, если answers изменятся.
        • HSL-цвет: 0° = красный, 120° = зелёный, так что чем выше score,
          тем «зеленее» квадратик.
      --------------------------------------------------------------------- -->

<script setup>
import { computed } from "vue";
import { useTestStore } from "@/stores/test"; // Pinia-store тестовой сессии

const s = useTestStore(); // реактивный объект со свойствами currentTest, answers

/* ==========================================================================
 * SECTION:DEMO_SCORE
 *   Пока нет реального алгоритма проверки, оцениваем так:
 *     ─ single   → 100 % если выбран ЛЮБОЙ ответ
 *     ─ multi    → каждая галочка = +25 % (до 100)
 *     ─ text     → если введён хоть какой-то текст → 70 %
 *
 *   Возвращаем массив: [{ topic:'2+2?…', score:75 }, …]
 *   topic = первые 10 символов вопроса, чтобы на квадрате было кратко.
 * ---------------------------------------------------------------------- */
const stats = computed(() => {
  const list = [];

  // currentTest может быть null, если пользователь перешёл «напрямую»
  for (const q of s.currentTest?.questions ?? []) {
    const ans = s.answers[q.id]; // то, что ввёл пользователь
    let score = 0; // по умолчанию 0 %

    if (q.type === "single") {
      score = ans ? 100 : 0; // radio
    } else if (q.type === "multi") {
      score = (ans?.length || 0) * 25; // 4 чекбокса * 25 = 100
    } else {
      score = ans ? 70 : 0; // текст — условно 70 %
    }

    list.push({
      topic: q.text.slice(0, 10) + "…", // короткое имя темы
      score,
    });
  }
  return list;
});
/* ========================================================================== */
</script>

<template>
  <h2 class="text-xl font-semibold mb-6">Results</h2>

  <!-- Сетка 4×N квадратиков, максимум ширины ≈ 512 px (max-w-lg)
   HSL: hue 0→120 (красный→зелёный) пропорционально score 
  :style="{ backgroundColor: `hsl(${(120 * t.score) / 100},70%,42%)` }" -->
  <div class="grid grid-cols-4 gap-2 max-w-lg">
    <div
      v-for="t in stats"
      :key="t.topic"
      class="h-16 rounded flex items-center justify-center text-xs text-white text-center leading-tight"
      :style="{ backgroundColor: `hsl(${(120 * t.score) / 100},70%,42%)` }"
    >
      {{ t.topic }}<br />{{ t.score }} %
    </div>
  </div>
</template>

<!--
  Tailwind пояснения:
    grid grid-cols-4 gap-2  — четыре столбца, 0.5rem между блоками
    h-16                    — высота каждого квадрата = 4rem
    rounded                 — скругление углов
    text-xs text-white      — мелкий белый текст
    leading-tight           — меньше межстрочный интервал, чтобы
                              «topic» и «%» уместились внутри квадрата
-->
