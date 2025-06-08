<!--  -------------------------------------------------------------------------
      src/pages/teacher/Dashboard.vue

      «Панель материалов» учителя.
      • <FileUpload> — drag-and-drop зона; когда файл «загружен» (мок-режим)
        эмитит событие  uploaded  с объектом { id, name, date }.
      • materials[]  — локальное реактивное хранилище списка файлов;
        пока живёт только в памяти.  Позже подменим на данные из API +
        добавим колонку «Status» (processing / ready).

      Для trainee:
        – ref([])          ➜ реактивный массив
        – unshift()        ➜ вставка в начало (самый свежий вверх)
        – v-if / v-for     ➜ условный рендер + таблица
      --------------------------------------------------------------------- -->

<script setup>
import { ref } from "vue";
import FileUpload from "@/components/FileUpload.vue"; // зона загрузки

/* ----------------------------------------------------------------------------
 * materials — реактивный массив объектов:
 *   { id:Number, name:String, date:Date, status:'uploaded' }
 * ---------------------------------------------------------------------------- */
const materials = ref([]);

/* При событии <FileUpload @uploaded="addMaterial" …>
 *   m = { id, name, date }
 * unshift() кладёт новинку в начало массива,
 * чтобы таблица была отсортирована «свежие сверху».                */
function addMaterial(m) {
  materials.value.unshift(m);
}
</script>

<template>
  <h2 class="text-xl font-semibold mb-4">Materials</h2>

  <!-- Зона drag-and-drop -->
  <FileUpload @uploaded="addMaterial" />

  <!-- Таблица отобразится, когда в materials[] хоть один элемент -->
  <table v-if="materials.length" class="w-full mt-6 text-sm border">
    <!-- Заголовок -->
    <thead class="bg-gray-100">
      <tr>
        <th class="p-2 text-left">Name</th>
        <th class="p-2">Uploaded</th>
        <th class="p-2">Status</th>
      </tr>
    </thead>

    <!-- Строки -->
    <tbody>
      <tr v-for="m in materials" :key="m.id" class="border-t">
        <td class="p-2">{{ m.name }}</td>
        <td class="p-2">{{ m.date.toLocaleString() }}</td>
        <!-- статус пока всегда «uploaded»; позже обновится через API -->
        <td class="p-2 text-indigo-600">uploaded</td>
      </tr>
    </tbody>
  </table>
</template>

<!--
  Tailwind-вёрстка:
    w-full        — растянуть таблицу на 100 %
    mt-6          — топ-маргин (1.5rem)
    text-sm       — мелкий шрифт
    border / border-t — тонкие серые линии таблицы
    bg-gray-100   — светлая заливка заголовка
    p-2           — отступы внутри ячеек
-->
<!--
Что изменится после подключения реального backend

Сейчас	                                    |Позже (с API)
materials хранится только в памяти	        |Загружаем список через await api.get('/materials') и пишем в materials.value
Статус фиксирован uploaded	                |Появятся состояния processing, ready, обновляем через api.get polling или WebSocket
Добавление материала: local unshift	        |После ответа сервера сохраняем полный объект { id, name, date, status }

Логика addMaterial останется, только будет использовать реальные данные из ответа сервера.
-->
