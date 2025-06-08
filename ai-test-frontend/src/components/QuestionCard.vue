<!--  -------------------------------------------------------------------------
      src/components/QuestionCard.vue

      Компонент-обёртка одного экзаменационного вопроса.
      Поддерживаем три формата:
        • 'single' — одиночный выбор (radio)
        • 'multi'  — множественный выбор (checkbox)
        • 'text'   — развернутый ответ (textarea)
      Родитель передаёт в него два пропса:
        1) question   — объект с текстом/типом/вариантами
        2) modelValue — текущее значение v-model (двухсторонняя связь)
      При изменении ответа компонент эмитит 'update:modelValue' — стандарт
      для кастомных v-model в Vue 3 (<script setup> синтаксис).
      --------------------------------------------------------------------- -->

<script setup>
import { computed } from "vue";

/* --------------------------------------------------------------------------
 *  defineProps → ожидаем структуру:
 *    question = {
 *      id:        Number | String,       ← уникальный id вопроса
 *      type:      'single' | 'multi' | 'text',
 *      text:      String (HTML/Markdown уже отрендеренный, поэтому v-html),
 *      options:   Array<String>  (для single/multi)
 *    }
 *
 *    modelValue  — сюда родитель передаст ранее сохранённый ответ:
 *                  » String        — для single / text
 *                  » Array<String> — для multi
 * ----------------------------------------------------------------------- */
const props = defineProps({
  question: Object,
  modelValue: [String, Array],
});

/* emit() нужен, чтобы уведомить родителя о новом значении (v-model) */
const emit = defineEmits(["update:modelValue"]);

/* --------------------------------------------------------------------------
 * computed answer
 *   get: отдаёт текущее значение modelValue (родительское состояние)
 *   set: эмитит событие 'update:modelValue'
 * Благодаря этому radio/checkbox/textarea могут прямо связываться
 * с «answer» через v-model, а Pinia-store/родитель останутся источником истины.
 * ----------------------------------------------------------------------- */
const answer = computed({
  get: () => props.modelValue,
  set: (v) => emit("update:modelValue", v),
});
</script>

<template>
  <!-- Карточка: отступы, белый фон, скругление, тень -->
  <div class="p-4 bg-white rounded shadow space-y-4">
    <!-- v-html: текст может содержать <b>, <br>, LaTeX-span и т. д. -->
    <p class="font-medium" v-html="question.text"></p>

    <!-- ───────────── SINGLE CHOICE ───────────── -->
    <div v-if="question.type === 'single'" class="space-y-2">
      <label
        v-for="opt in question.options"
        :key="opt"
        class="flex items-center gap-2"
      >
        <!-- 'answer' привязан как v-model: radio -->
        <input type="radio" :value="opt" v-model="answer" />
        <span>{{ opt }}</span>
      </label>
    </div>

    <!-- ───────────── MULTI CHOICE ───────────── -->
    <div v-else-if="question.type === 'multi'" class="space-y-2">
      <label
        v-for="opt in question.options"
        :key="opt"
        class="flex items-center gap-2"
      >
        <!-- при checkbox answer становится массивом строк -->
        <input type="checkbox" :value="opt" v-model="answer" />
        <span>{{ opt }}</span>
      </label>
    </div>

    <!-- ───────────── OPEN TEXT ───────────── -->
    <textarea
      v-else
      v-model="answer"
      rows="4"
      class="w-full border rounded px-3 py-2"
    />
  </div>
</template>

<!--
  Tailwind-классы:
    p-4            — padding
    bg-white       — светлый фон
    rounded        — скруглённые углы
    shadow         — box-shadow по дизайну
    space-y-4      — вертикальный gap между <p> и блоком вариантов
    flex / gap-2   — аккуратное размещение чекбокса + текста
-->
