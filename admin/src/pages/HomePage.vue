<script setup>
// import { reactive, onMounted } from "vue";
import LineChart from '../components/LineChart.vue';
import DoughnutChart from '../components/DoughnutChart.vue';

</script>

<template>
  <section class="container">
    <header class="header">
      รายละเอียด:
    </header>
    <div class="lineChart" >
      <LineChart />
    </div>
    <div class="doughnutChart">
      <div class="doughnutChart-wrap">
        <DoughnutChart />
      </div>
      <div class="doughnutChart-wrap">
        <DoughnutChart />
      </div>
      <div class="doughnutChart-wrap">
        <DoughnutChart />
      </div>
    </div>
  </section>
</template>

<style scoped>
.container {
  width: 100%;
  height: 100%;
  display: block;

}

.header {
  font-size: 2rem;
  font-weight: 1000;
  margin-top: 0.5rem;
  display: none;
}

.lineChart {
  width: 90%;
  height: 25vh;
  margin: 2rem auto;
  border-radius: 0.5rem;
  padding: 0.5rem;
  box-shadow: 0px 0px 2px 2.5px var(--menuShadowColor);
}

.doughnutChart {
  width: 90%;
  display: block;
  flex-wrap: wrap;
  text-align: center;
  margin: 2.5rem auto;
}

.doughnutChart-wrap {
  width: 13rem;
  margin: 0 auto;
  padding: 0.5rem 2rem;
}

@media screen and (min-width:826px) {
  .header {
    display: block;
  }

  .lineChart {
    width: 70%;
    height: 35vh;
    margin: 1rem auto;
  }

  .doughnutChart {
    width: 100%;
    display: flex;
    margin: 1.5rem auto;
  }

  .doughnutChart-wrap {
    width: 13rem;
    margin: 0 auto;
    padding: 0.5rem 2rem;
  }

}

@media screen and (min-width:1200px) {
  .doughnutChart {
    width: 80%;
    display: flex;
    margin: 2.5rem auto;
  }

  .lineChart {
    margin: 2rem auto;
  }
}
</style>
