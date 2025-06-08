<script setup>
import { ref } from "vue";
import { useUserStore } from "@/stores/user";

const email = ref("");
const role = ref("student"); // по умолчанию студент
const user = useUserStore();

function submit() {
  if (!email.value) return; // валидация минимальная
  user.login({ token: "fake-jwt", role: role.value });
}
</script>

<template>
  <div class="h-screen flex items-center justify-center bg-gray-50">
    <form
      @submit.prevent="submit"
      class="w-80 p-6 bg-white rounded-lg shadow space-y-4"
    >
      <h1 class="text-xl font-bold text-center">Login</h1>

      <input
        v-model="email"
        type="email"
        placeholder="Email"
        class="w-full border rounded px-3 py-2"
      />

      <select v-model="role" class="w-full border rounded px-3 py-2">
        <option value="student">Student</option>
        <option value="teacher">Teacher</option>
      </select>

      <button
        type="submit"
        class="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
      >
        Sign in
      </button>
    </form>
  </div>
</template>
