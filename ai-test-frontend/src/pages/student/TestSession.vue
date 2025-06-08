<!--  -------------------------------------------------------------------------
      src/pages/student/TestSession.vue

      Страница, где студент последовательно отвечает на вопросы теста.
      Главные задачи:
        • показывать текущий вопрос  (QuestionCard.vue)
        • следить за прогресс-баром и таймером
        • по окончании (последний вопрос или 0 сек) вызвать finishTest()
          и перейти на Results.vue

      💡  Файл уже рабочий — комментарии помогают trainee понять каждую
         реактивную переменную и жизненный цикл.
      --------------------------------------------------------------------- -->

<script setup>
import { ref, computed, onMounted } from "vue";
import { useTestStore } from "@/stores/test";
import { useRouter } from "vue-router";
import QuestionCard from "@/components/QuestionCard.vue";

/* ─────────────── Pinia-store и роутер ─────────────── */
const s = useTestStore(); // содержит currentTest, questions[], answers{}
const router = useRouter();

/* Если пользователь открыл /student/session в обход startTest()…
   ─ currentTest будет null → сразу вернём его на /student */
if (!s.currentTest) router.replace("/student");

/* ─────────────── Индексы и реактивные вычисления ─────────────── */
const idx = ref(0); // текущий индекс вопроса
const total = computed(() => s.questions.length); // всего вопросов
const question = computed(() => s.questions[idx.value] ?? null);

/* ─────────────── Таймер (5 минут = 300 сек) ─────────────── */
const secondsLeft = ref(300);
let timer;

onMounted(() => {
  timer = setInterval(() => {
    if (--secondsLeft.value <= 0) finish(); // время вышло
  }, 1000);
});

/* ─────────────── Навигация по вопросам ─────────────── */
function next() {
  idx.value++;
  if (idx.value >= total.value) finish(); // прошли все вопросы
}

/* ─────────────── Завершение теста ───────────────
   1) останавливаем таймер
   2) вызываем store.finishTest()  (можно будет отправить ответы на API)
   3) переходим на страницу результатов */
function finish() {
  clearInterval(timer);
  s.finishTest();
  router.replace("/student/results");
}

/* ─────────────── Прогресс-бар (процент) ─────────────── */
const progress = computed(() => (idx.value / total.value) * 100);
</script>

<template>
  <!-- Есть вопрос → рендерим контент; иначе «Loading…» -->
  <div v-if="question" class="space-y-4">
    <!-- Progress bar -->
    <div class="h-2 bg-gray-200 rounded">
      <div
        class="h-full bg-indigo-600 transition-all"
        :style="{ width: progress + '%' }"
      />
    </div>

    <!-- Countdown-таймер -->
    <p
      class="text-sm text-right"
      :class="secondsLeft < 60 && 'text-red-600 font-semibold'"
    >
      {{ Math.floor(secondsLeft / 60) }}:
      {{ String(secondsLeft % 60).padStart(2, "0") }}
    </p>

    <!-- Карточка вопроса -->
    <!-- v-model:answer="s.answers[question.id]"   двусторонняя связь -->
    <QuestionCard
      v-model:answer="s.answers[question.id]"
      :question="question"
    />

    <!-- Кнопка Next (можно дополнить :disabled, если answer пуст) -->
    <button class="bg-indigo-600 text-white px-4 py-2 rounded" @click="next">
      Next
    </button>
  </div>

  <!-- safety fallback -->
  <p v-else>Loading…</p>
</template>

<!--
 UI-классы Tailwind:
   space-y-4          — вертикальный gap между элементами
   h-2 bg-gray-200    — серая «дорожка» прогресс-бара
   bg-indigo-600      — «заливка» прогресс-бара и кнопка
   text-red-600       — таймер станет красным за 60 сек
-->
