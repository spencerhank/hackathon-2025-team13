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
  chartData: Object,
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
        data: [getChartDataForStore("101"), getChartDataForStore("102")],
      },
    ],
  };
});

function getChartDataForStore(storeId) {
  if (props.chartData.length == 0) {
    return 0;
  } else {
    return props.chartData.filter((dataPoint) => {
      let topicArray = dataPoint.getDestination().getName().split("/");
      if (topicArray[4] === storeId) {
        // console.log(topicArray[4]);
        return true;
      }
    }).length;
  }
}
</script>
