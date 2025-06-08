<!--  -------------------------------------------------------------------------
      src/components/FileUpload.vue

      Компонент-загрузчик: зона drag-and-drop + клик для выбора файла.
      Сейчас работает **без реального сервера** — мы:
        • рисуем фейковый прогресс-бар (setInterval);
        • после «загрузки» вызываем  api.post('/materials/upload', …)
          — этот метод в  src/api/index.js  переопределён мок-версией и
          отдаёт   { ok:true, id: Date.now() }.
      Когда бекенд будет готов, достаточно:
        1. удалить блок SECTION:MOCK ниже (setInterval)
        2. оставить прямой вызов  await api.post()  + onUploadProgress
      --------------------------------------------------------------------- -->

<script setup>
import { ref, defineEmits } from "vue";
import api from "../api"; // << инстанс axios

/* --- событие, которое увидит родитель (Teacher/Dashboard.vue).
       аргумент: { id, name, date }  ---------------------------- */
const emit = defineEmits(["uploaded"]);

/* --- реактивные переменные состояния --- */
const isDrag = ref(false); // подсветка рамки при dragover
const progress = ref(0); // 0–100, для прогресс-бара

/* -------------------------------------------------------------------------
 * handleFiles(files)
 *   • принимает FileList (из <input type=file> или drop-события)
 *   • сейчас запускает МОК-таймер 10 % → 100 %
 *   • по завершении отправляет api.post и эмитит событие
 * --------------------------------------------------------------------- */
function handleFiles(files) {
  if (!files || !files.length) return;
  const file = files[0];

  /* === SECTION:MOCK upload progress =================================== */
  progress.value = 0;
  const timer = setInterval(() => {
    progress.value += 10; // каждые 80 мс +10 %
    if (progress.value >= 100) {
      clearInterval(timer);

      /* вместо FormData/axios — отправляем file напрямую
         (в мок-режиме это не важно). Когда появится сервер,
         сделаем:
           const fd = new FormData()
           fd.append('file', file)
           await api.post('/materials/upload', fd, { onUploadProgress })
       */
      api.post("/materials/upload", file).then(({ data }) => {
        // сообщаем родителю: материал «загружен»
        emit("uploaded", {
          id: data.id, // мок-id (Date.now())
          name: file.name,
          date: new Date(),
        });
        progress.value = 0; // сбросить бар
      });
    }
  }, 80);
  /* ==================================================================== */
}

/* drop-обработчик: не пускать браузер открывать файл и передать дальше */
function drop(e) {
  e.preventDefault();
  isDrag.value = false;
  handleFiles(e.dataTransfer.files);
}
</script>

<template>
  <!-- ---------------------------------------------------------------
       Вся зона клика/дропа: dashed-рамка, меняем цвет при dragover
       @click="$refs.input.click()"      клик по зоне = открыть файл-диалог
       ------------------------------------------------------------ -->
  <div
    class="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition hover:bg-gray-50"
    :class="isDrag && 'bg-indigo-50 border-indigo-400'"
    @dragover.prevent="isDrag = true"
    @dragleave="isDrag = false"
    @drop="drop"
    @click="$refs.input.click()"
  >
    <p class="text-sm">
      Drag&nbsp;&amp;&nbsp;drop PDF/DOCX или кликните для выбора
    </p>

    <!-- скрытый input для fallback-клика -->
    <input
      ref="input"
      type="file"
      class="hidden"
      @change="handleFiles($event.target.files)"
    />

    <!-- тоненький прогресс-бар появится, когда progress>0 -->
    <div v-if="progress" class="mt-4 h-2 bg-gray-200 rounded">
      <div
        class="h-full bg-indigo-600 rounded transition-all"
        :style="{ width: progress + '%' }"
      />
    </div>
  </div>
</template>

<!-- ⚠️  После подключения настоящего API:
     • удалить блок SECTION:MOCK (setInterval, fake progress)
     • заменить вызов api.post внутри handleFiles на реальный FormData +
       конфиг { onUploadProgress } чтобы браться за progress.value -->
