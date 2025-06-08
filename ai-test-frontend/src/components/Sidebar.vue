<script setup>
import { computed } from "vue";
import { useUserStore } from "@/stores/user";

const user = useUserStore();

const links = computed(() => {
  if (user.role === "teacher") {
    return [
      { name: "Dashboard", to: "/teacher" },
      { name: "Tests", to: "/teacher/tests" },
      { name: "Analytics", to: "/teacher/analytics" },
    ];
  }
  return [
    { name: "Dashboard", to: "/student" },
    { name: "Tests", to: "/student/session" }, // или отдельная страница списка
    { name: "Analytics", to: "/student/results" },
  ];
});
</script>

<template>
  <aside class="w-56 bg-gray-800 text-gray-100">
    <nav class="mt-4">
      <ul>
        <li v-for="l in links" :key="l.to">
          <RouterLink
            :to="l.to"
            class="block px-4 py-2 hover:bg-gray-700"
            active-class="bg-gray-900"
          >
            {{ l.name }}
          </RouterLink>
        </li>
      </ul>
    </nav>
  </aside>
</template>
