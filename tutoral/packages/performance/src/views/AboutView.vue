<template>
  <div>
    <v-chart class="chart" :option="option" />
  </div>
</template>
<script setup lang="ts">
import VChart, { THEME_KEY } from "vue-echarts";
import { ref, provide } from "vue";
import "echarts";
// import echarts from "@/utils/echartsRequire";
// import { PieChart } from "echarts/charts";
// echarts.use([PieChart]);


provide(THEME_KEY, "dark");

const option = ref({
  title: {
    text: "2023报考推荐专业类别",
    left: "center"
  },
  tooltip: {
    trigger: "item",
    formatter: "{a} <br/>{b} : {c} ({d}%)"
  },
  legend: {
    orient: "vertical",
    left: "left",
    data: ["软件工程", "电子通信", "电气新能源", "汉语言学", "公费师范", "法学", "临床八年", "口腔医学", "应用经济学", "数学"]
  },
  series: [
    {
      name: "推荐专业类别",
      type: "pie",
      radius: "55%",
      center: ["50%", "60%"],
      data: [
        { value: 735, name: "软件工程" },
        { value: 610, name: "电子通信" },
        { value: 534, name: "电气新能源" },
        { value: 515, name: "汉语言学" },
        { value: 448, name: "公费师范" },
        { value: 248, name: "法学" },
        { value: 210, name: "临床八年" },
        { value: 190, name: "口腔医学" },
        { value: 121, name: "应用经济学" },
        { value: 80, name: "数学" },
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: "rgba(0, 0, 0, 0.5)"
        }
      }
    }
  ]
});
</script>
<style scoped>
.chart {
  height: 600px;
}
</style>