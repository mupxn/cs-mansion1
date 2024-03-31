
  
<script >
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'vue-chartjs'
import { reactive } from 'vue'
import axios from "axios";
import useUserStore from '../module/userstore';
const lineData = reactive({
  data: [],
  label: []
})
const queryData = async () => {
  try {
    const chartData = await axios.get("http://localhost:3001/api/user/graph", { withCredentials: true });
    chartData.data.forEach(element => {
      lineData.data.push(element.Total)
      lineData.label.push(element.BillDate.slice(0, 10))
    });
  } catch (e) {
    console.log(e)
  }
}
await queryData()
const chartConfig = reactive({
  data: {
    labels: lineData.label,
    datasets: [
      {
        label: 'รายได้ต่อเดือน',
        data: lineData.data
      },
    ]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          display: false,
        },
      },

    },
    elements: {
      line: {
        borderColor: 'rgba(75, 192, 192, 0.8)',
        backgroundColor: 'rgba(75, 192, 192, 0.8)',
        pointBackgroundColor: 'white',
        borderWidth: 2,
        radius: 0,
        fill: true,
        tension: 0.25,
      },
      point: {
        radius: 3,
        backgroundColor: 'rgba(75, 192, 192, 0.8)',
        borderWidth: 0,
      },
    },

  }
})
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

export default {
  name: 'App',
  components: {
    Line
  },
  data() {
    return chartConfig
  },
  // async setup() {
  //   userData = useUserStore()
  //   await queryData();
  //   chartConfig.data.datasets.data = lineData.data
  //   chartConfig.data.datasets.labels = lineData.label
  //   return {};
  // },
}
</script>
  
<template>
  <div class="chart-wrap" id="chartContainer">
    <Line :data="data" :options="options" />
  </div>
</template>

<style scoped>
.chart-wrap {
  width: 100%;
  height: 100%;
}
</style>