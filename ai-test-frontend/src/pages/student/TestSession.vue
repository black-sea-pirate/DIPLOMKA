<script setup>
import { ref, computed, onMounted } from "vue";
import { useTestStore } from "../../stores/test";
import { useRouter } from "vue-router";
import QuestionCard from "../../components/QuestionCard.vue";

const s = useTestStore();
const router = useRouter();

/* если тест не запущен — назад */
if (!s.currentTest) router.replace("/student");

/* индексы и вычисления */
const idx = ref(0);
const total = computed(() => s.questions.length);
const question = computed(() => s.questions[idx.value] ?? null);

/* --- таймер --- */
const secondsLeft = ref(300);
let timer;
onMounted(() => {
  timer = setInterval(() => {
    if (--secondsLeft.value <= 0) finish();
  }, 1000);
});

function next() {
  idx.value++;
  if (idx.value >= total.value) finish();
}

function finish() {
  clearInterval(timer);
  s.finishTest();
  router.replace("/student/results");
}

/* прогресс */
const progress = computed(() => (idx.value / total.value) * 100);
</script>

<template>
  <div v-if="question" class="space-y-4">
    <!-- progress bar -->
    <div class="h-2 bg-gray-200 rounded">
      <div class="h-full bg-indigo-600" :style="{ width: progress + '%' }" />
    </div>

    <!-- timer -->
    <p
      class="text-sm text-right"
      :class="secondsLeft < 60 && 'text-red-600 font-semibold'"
    >
      {{ Math.floor(secondsLeft / 60) }}:{{
        String(secondsLeft % 60).padStart(2, "0")
      }}
    </p>

    <!-- question -->
    <QuestionCard
      v-model:answer="s.answers[question.id]"
      :question="question"
    />

    <button class="bg-indigo-600 text-white px-4 py-2 rounded" @click="next">
      Next
    </button>
  </div>

  <!-- safety fallback -->
  <p v-else>Loading…</p>
</template>
