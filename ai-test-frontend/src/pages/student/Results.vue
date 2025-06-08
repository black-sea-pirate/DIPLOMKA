<script setup>
import { computed } from "vue";
import { useTestStore } from "@/stores/test";

const s = useTestStore();

/* === демо-агрегация ===
   пока нет реального бек-чека, просто считаем:
   single  -> 100 %,
   multi   -> 25 % за каждый выбранный чекбокс,
   text    -> 70 % (заглушка) */
const stats = computed(() => {
  const list = [];

  for (const q of s.currentTest?.questions ?? []) {
    const ans = s.answers[q.id];
    let score = 0;

    if (q.type === "single") score = ans ? 100 : 0;
    else if (q.type === "multi") score = (ans?.length || 0) * 25;
    else score = ans ? 70 : 0;

    list.push({ topic: q.text.slice(0, 10) + "…", score });
  }
  return list;
});
</script>

<template>
  <h2 class="text-xl font-semibold mb-6">Results</h2>

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
