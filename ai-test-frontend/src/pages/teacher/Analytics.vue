<script setup>
import BarChart from "../../components/Charts/BarChart.vue";
import RadarChart from "../../components/Charts/RadarChart.vue";

const coverageLabels = [
  "Algebra",
  "Geometry",
  "History",
  "Biology",
  "Literature",
];
const coverageData = [80, 55, 70, 60, 90];

const masteryLabels = [
  "Analysis",
  "Recall",
  "Application",
  "Creativity",
  "Speed",
];
const masteryData = [65, 80, 55, 45, 70];
</script>

<template>
  <h2 class="text-xl font-semibold mb-6">Analytics</h2>

  <div class="grid gap-6 lg:grid-cols-2">
    <div class="p-4 bg-white rounded shadow">
      <h3 class="font-medium mb-2">Coverage (%)</h3>
      <BarChart :labels="coverageLabels" :data="coverageData" />
    </div>

    <div class="p-4 bg-white rounded shadow">
      <h3 class="font-medium mb-2">Mastery Radar</h3>
      <RadarChart :labels="masteryLabels" :data="masteryData" />
    </div>
  </div>
</template>
