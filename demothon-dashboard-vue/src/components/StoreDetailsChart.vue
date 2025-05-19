<template>
  <v-card :title="chartTitle">
    <Bar :id="chartId" :data="chartData" :options="chartOptions" />
  </v-card>
</template>
<script setup>
import { ref } from "vue";
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const props = defineProps({
  chartId: String,
  chartTitle: String,
  chartColor: String,
  chartLabel: String,
});

const chartOptions = {
  responsive: true,
};

const chartData = computed(() => {
  return {
    labels: ["Store 1", "Store 2"],
    datasets: [
      {
        label: props.chartLabel,
        backgroundColor: props.chartColor,
        data: [200, 50],
      },
    ],
  };
});
</script>
