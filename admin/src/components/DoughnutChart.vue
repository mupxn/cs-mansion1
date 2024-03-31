<script lang="ts">
import { reactive } from 'vue'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'vue-chartjs';
import { teamColor } from '../module/team.js';
// import * as chartConfig from './chartConfig.js'
const chartConfig = reactive({
    data: {
        labels: ['ยังไม่จ่าย', 'จ่ายแล้ว'],
        datasets: [
            {
                backgroundColor: [teamColor.menuSelectedColor, teamColor.menuColor],
                borderRadius:5,
                borderWidth:5,
                cutout:60,
                data: [30, 70]
            }
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                text: 'การจ่ายค่าเช่า',
                fill: true,
            },

        }
    }
})
ChartJS.register(ArcElement, Tooltip, Legend)

export default {
    name: 'App',
    components: {
        Doughnut
    },
    data() {
        return chartConfig
    }
}
</script>


<template>
    <section class="chart-wrap">
        <Doughnut :data="data" :options="options" />
    </section>
</template>

<style scoped>
.chart-wrap {
    width: 100%;
    height: 100%;
}
</style>
  
