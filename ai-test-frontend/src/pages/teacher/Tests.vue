<!--  -------------------------------------------------------------------------
      src/pages/teacher/Tests.vue

      Страница управляет списком тестов преподавателя.
      Сейчас работает полностью в «мок-режиме»:
        • хранит tests[] прямо в Pinia-store test.js
        • создаёт новый тест локально через кнопку «＋» (Floating Action Button)
      После подключения backend-API:
        1) при открытии страницы сделаем   api.get('/tests')
        2) createTest() будет отправлять   api.post('/tests', { title })
        3) колонка Questions будет заполняться реальным числом вопросов
      --------------------------------------------------------------------- -->

<script setup>
import { ref } from "vue";
import { useTestStore } from "@/stores/test"; // Pinia-store «test»
import { v4 as uuid } from "uuid"; // генератор уникальных id

const store = useTestStore(); // реактивные tests[]
const showModal = ref(false); // флаг показа модалки
const newTitle = ref(""); // значение input’а

/* ----------------------------------------------------------------------------
 * createTest()
 *   • валидация: если поле пустое → ничего не делаем
 *   • добавляем тест через store.addTest()
 *   • сбрасываем форму и закрываем модалку
 * NOTE: сейчас questions:0 — заглушка, позже будет длина массива вопросов.
 * ------------------------------------------------------------------------- */
function createTest() {
  if (!newTitle.value) return;
  store.addTest({
    id: uuid(), // уникальный id (локально)
    title: newTitle.value,
    questions: 0,
  });
  newTitle.value = "";
  showModal.value = false;
}
</script>

<template>
  <h2 class="text-xl font-semibold mb-4">Tests</h2>

  <!-- Таблица тестов -->
  <table v-if="store.tests.length" class="w-full text-sm border">
    <thead class="bg-gray-100">
      <tr>
        <th class="p-2 text-left">Title</th>
        <th class="p-2">Questions</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="t in store.tests" :key="t.id" class="border-t">
        <td class="p-2">{{ t.title }}</td>
        <td class="p-2 text-center">{{ t.questions }}</td>
      </tr>
    </tbody>
  </table>

  <!-- Floating Action Button (FAB) для создания нового теста -->
  <button
    class="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-indigo-600 text-white text-2xl shadow-lg hover:bg-indigo-700"
    @click="showModal = true"
  >
    ＋
  </button>

  <!-- Модальное окно -->
  <div
    v-if="showModal"
    class="fixed inset-0 flex items-center justify-center bg-black/40"
  >
    <div class="bg-white p-6 rounded-lg w-72 space-y-4">
      <h3 class="font-semibold text-lg">New Test</h3>

      <!-- Input названия теста -->
      <input
        v-model="newTitle"
        placeholder="Title"
        class="w-full border rounded px-3 py-2"
      />

      <!-- Кнопки Cancel / Save -->
      <div class="flex justify-end gap-2">
        <button class="px-3 py-1" @click="showModal = false">Cancel</button>
        <button
          class="bg-indigo-600 text-white px-3 py-1 rounded"
          @click="createTest"
        >
          Save
        </button>
      </div>
    </div>
  </div>
</template>

<!--
  Tailwind пояснения:
    fixed bottom-6 right-6  — FAB прилипает к правому нижнему углу
    w-14 h-14               — квадрат 56×56 px
    shadow-lg               — подчёркнутый «floating» эффект
    bg-black/40             — полупрозрачный фон модалки
-->
<!--
  Что trainee должен знать для интеграции с API
Задача	                                    |Что изменить
Загрузить существующие тесты	              |onMounted(async () => { store.tests = (await api.get('/tests')).data })
Сохранить новый тест	                      |в createTest() заменить store.addTest() на await api.post('/tests', { title }) и после ответа добавить его в store

Остальная разметка и логика (модалка, таблица) останутся без изменений.
-->
