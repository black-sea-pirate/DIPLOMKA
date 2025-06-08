<script setup>
import { computed } from "vue";

/* props:
   question = { id, type: 'single' | 'multi' | 'text', text, options:[] }
   modelValue = текущее значение (v-model:answer)
*/
const props = defineProps({ question: Object, modelValue: [String, Array] });
const emit = defineEmits(["update:modelValue"]);

/* удобный computed для синхронизации */
const answer = computed({
  get: () => props.modelValue,
  set: (v) => emit("update:modelValue", v),
});
</script>

<template>
  <div class="p-4 bg-white rounded shadow space-y-4">
    <p class="font-medium" v-html="question.text"></p>

    <!-- single choice -->
    <div v-if="question.type === 'single'" class="space-y-2">
      <label
        v-for="opt in question.options"
        :key="opt"
        class="flex items-center gap-2"
      >
        <input type="radio" :value="opt" v-model="answer" />
        <span>{{ opt }}</span>
      </label>
    </div>

    <!-- multiple choice -->
    <div v-else-if="question.type === 'multi'" class="space-y-2">
      <label
        v-for="opt in question.options"
        :key="opt"
        class="flex items-center gap-2"
      >
        <input type="checkbox" :value="opt" v-model="answer" />
        <span>{{ opt }}</span>
      </label>
    </div>

    <!-- open text -->
    <textarea
      v-else
      v-model="answer"
      rows="4"
      class="w-full border rounded px-3 py-2"
    />
  </div>
</template>
