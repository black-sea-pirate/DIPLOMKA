<script setup>
import { ref } from "vue";
import FileUpload from "../../components/FileUpload.vue";

const materials = ref([]);

function addMaterial(m) {
  materials.value.unshift(m);
}
</script>

<template>
  <h2 class="text-xl font-semibold mb-4">Materials</h2>

  <FileUpload @uploaded="addMaterial" />

  <table v-if="materials.length" class="w-full mt-6 text-sm border">
    <thead class="bg-gray-100">
      <tr>
        <th class="p-2 text-left">Name</th>
        <th class="p-2">Uploaded</th>
        <th class="p-2">Status</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="m in materials" :key="m.id" class="border-t">
        <td class="p-2">{{ m.name }}</td>
        <td class="p-2">{{ m.date.toLocaleString() }}</td>
        <td class="p-2 text-indigo-600">uploaded</td>
      </tr>
    </tbody>
  </table>
</template>
