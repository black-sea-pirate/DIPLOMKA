<script setup>
import { ref } from "vue";
import { useTestStore } from "../../stores/test";
import { v4 as uuid } from "uuid";

const store = useTestStore();
const showModal = ref(false);
const newTitle = ref("");

function createTest() {
  if (!newTitle.value) return;
  store.addTest({ id: uuid(), title: newTitle.value, questions: 0 });
  newTitle.value = "";
  showModal.value = false;
}
</script>

<template>
  <h2 class="text-xl font-semibold mb-4">Tests</h2>

  <!-- таблица -->
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

  <!-- FAB -->
  <button
    class="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-indigo-600 text-white text-2xl shadow-lg hover:bg-indigo-700"
    @click="showModal = true"
  >
    ＋
  </button>

  <!-- модальное окно -->
  <div
    v-if="showModal"
    class="fixed inset-0 flex items-center justify-center bg-black/40"
  >
    <div class="bg-white p-6 rounded-lg w-72 space-y-4">
      <h3 class="font-semibold text-lg">New Test</h3>
      <input
        v-model="newTitle"
        placeholder="Title"
        class="w-full border rounded px-3 py-2"
      />
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
