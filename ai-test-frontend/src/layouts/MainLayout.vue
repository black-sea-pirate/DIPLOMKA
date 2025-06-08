<script setup>
import Navbar from "../components/Navbar.vue";
import Sidebar from "../components/Sidebar.vue";
</script>

<template>
  <div class="flex h-screen">
    <Sidebar />

    <div class="flex-1 flex flex-col">
      <Navbar />
      <main class="flex-1 overflow-y-auto p-6 bg-gray-50">
        <RouterView />
        <!-- сюда попадают дочерние страницы -->
      </main>
    </div>
  </div>
</template>
