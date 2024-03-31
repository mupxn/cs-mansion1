<script setup>
import DetailBox from '../components/DetailBox.vue';
import {  reactive,onMounted } from "vue";
import axios from "axios";

const data = reactive({
  Detail : []
})

const queryRoom = async () => {
  const response = await axios.get("http://localhost:3001/api/admin/Detail");
  data.Detail = await response.data;
}

onMounted( async ()=>{
  await queryRoom()
})
</script>

<template>
  <section class="container">
    <header class="header">รายละเอียดหอพัก:</header>
    <div class="table-wrap">
      <div class="tableBox" v-for="(item, index) in data.Detail" :key="index">
        <DetailBox :DetailName="item.DetailName" :DetailPrice="item.DetailPrice" />
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

.table-wrap {
  display: block;
  margin: 0 auto;
  width: fit-content;
}

@media screen and (min-width: 826px) {
  .header {
    display: block;
  }
  .table-wrap {
  display: flex;
  margin: 0;
}

}

@media screen and (min-width: 1200px) {

  .table-wrap {
    display: flex;
    margin: 0;
  }
}
</style>
