<script setup>

import BillDeatailBox from "../components/BillDeatailBox.vue";
import { reactive,onMounted } from 'vue';
import axios from "axios"
const data = reactive({
  BillData: [],
});
const props = defineProps(["dropdownData"]);

const queryState = reactive({
  roomId: 'All',
  statusId: 'All'
})
const pagination = reactive({
  page: 1,
  pageBar: [],
  maxPage: 0,
  memory: {},
  render: [],
  entries: 50
});
const preQueryBill = async () => {
  if (!pagination.memory[queryState.statusId]) {
    pagination.memory[queryState.statusId] = {}
    pagination.memory[queryState.statusId][queryState.roomId] = {}
  } else {
    if (!pagination.memory[queryState.statusId][queryState.roomId]) {
      pagination.memory[queryState.statusId][queryState.roomId] = {}
    } else {
      if (pagination.memory[queryState.statusId][queryState.roomId][pagination.page]) {
        pagination.render = pagination.memory[queryState.statusId][queryState.roomId][pagination.page]
        pagination.maxPage = pagination.memory[queryState.statusId][queryState.roomId]["maxPage"]
        generatePageBar();
        return
      }
    }
  }
  queryBill();
}
const queryBill = async () =>{
  let response = await axios.post("http://localhost:3001/api/admin/billdata", { roomId: queryState.roomId, statusId: queryState.statusId, entries: pagination.entries, page: pagination.page });
  data.Bill = response.data.bill;
  pagination.maxPage = Math.ceil(response.data.allRecord / pagination.entries)
  pagination.memory[queryState.statusId][queryState.roomId][pagination.page] = data.Bill;
  pagination.memory[queryState.statusId][queryState.roomId]["maxPage"] = pagination.maxPage;
  pagination.render = data.Bill
  generatePageBar();
}
const filterRoomId = (event) => {
  event.preventDefault();
  queryState.roomId = event.target.value;
  pagination.page=1;
  preQueryBill();
}
const filterStatus = (event) => {
  event.preventDefault();
  queryState.statusId = event.target.value;
  pagination.page=1;
  preQueryBill();
}



const generatePageBar = () => {
  pagination.pageBar = []
  for (let pageNum = pagination.page - 4 > 0 ? pagination.page - 4 : 1; pageNum < pagination.page && pageNum > 0; pageNum++) {
    pagination.pageBar.push(pageNum);
  }
  pagination.pageBar.push(pagination.page)
  for (let pageNum = pagination.page + 1; (pageNum < pagination.page + 4 || pagination.pageBar.length < 9) && pagination.maxPage >= pageNum; pageNum++) {
    pagination.pageBar.push(pageNum);
  }
}
const onPageBarClick = (pnum) => {
  pagination.page = pnum;
  if (pagination.memory[queryState.statusId][queryState.roomId][pagination.page] === undefined || pagination.showAdmin) {
    preQueryBill()
  } else {
    pagination.render = pagination.memory[queryState.statusId][queryState.roomId][pagination.page];
    generatePageBar();
  }
}
const prevPage = () => {
  pagination.page--;
  if (pagination.memory[queryState.statusId][queryState.roomId][pagination.page] === undefined || pagination.showAdmin) {
    preQueryBill()
  } else {
    pagination.render = pagination.memory[queryState.statusId][queryState.roomId][pagination.page];
    generatePageBar();
  }
}
const nextPage = () => {
  pagination.page++;
  if (pagination.memory[queryState.statusId][queryState.roomId][pagination.page] === undefined || pagination.showAdmin) {
    preQueryBill()
  } else {
    pagination.render = pagination.memory[queryState.statusId][queryState.roomId][pagination.page];
    generatePageBar();
  }
}

onMounted(async () => {
  await preQueryBill()
})


</script>

<template>
  <section class="container">
    <header class="header">บิลค่าเช่า:</header>
    <div class="filterBar">
      <div class="filter-wrap">
        <label for="RoomID">เลขห้อง: </label>
        <select name="RoomID" id="RoomIDFilter" @change="filterRoomId($event)">
          <option value="All">ทั้งหมด</option>
          <option v-for="(item, index) in dropdownData.roomId" :key="index" :value="item.RoomID">{{ item.RoomID }}
          </option>
        </select>
      </div>
      <div class="filter-wrap">
        <label for="status">สถานะ: </label>
        <select name="status" id="RoomStatusID" @change="filterStatus($event)">
          <option value="All">ทั้งหมด</option>
          <option v-for="(item, index) in dropdownData.status" :key="index" :value="item.BillStatusID">{{
            item.BillStatusName }}
          </option>
        </select>
      </div>
      <div class="filter-wrap" v-if="pagination.maxPage > 1">
        <div class="pagination-controller">
          <div class="pagination-container bg-white text-blue">
            <div class="pagination-btn pagination-left-btn" v-if="pagination.page > 1" @click="prevPage">
              <div>&laquo;</div>
            </div>
            <div v-for="i in pagination.pageBar" :key="i">
              <div
                :class="'pagination-btn' + (i === pagination.page ? ' pagination-btn-active' : '') + (pagination.page === 1 && i === 1 ? ' pagination-left-btn' : '')"
                @click="onPageBarClick(i)">
                <div>{{ i }}</div>
              </div>
            </div>
            <div class="pagination-btn pagination-right-btn" v-if="pagination.page < pagination.maxPage"
              @click="nextPage">
              <div>&raquo;</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- {{ BillData }} -->
    <div class="table">
      <div class="thead">
        <div class="tr">
          <div class="th roomNumber">เลขห้อง</div>
          <div class="th date">วันที่</div>
          <div class="th totalPrice">ราคารวม</div>
          <div class="th status">สถานะ</div>
          <div class="th detail">รายละเอียด</div>
        </div>
      </div>
      <div class="tbody">
        <div class="Trow" v-for="(item, index) in pagination.render" :key="index">
          <BillDeatailBox :item="item" @queryBill="queryBill"/>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.pagination-container {
  width: fit-content;
  display: flex;
}

.pagination-btn {
  width: 1.4rem;
  height: 1.8rem;
  display: flex;
  align-items: center;
  justify-content: space-around;
  border: 1px solid white;
  margin-right: -1px;
  font-size: 0.8rem;
}

.pagination-btn-active {
  color: rgb(0, 102, 255);
  cursor: text;
}

.pagination-left-btn {
  border-radius: 0.3rem 0 0 0.3rem;
}

.pagination-right-btn {
  border-radius: 0 0.3rem 0.3rem 0;
}

.pagination-btn:hover,
.pagination-right-btn:hover,
.pagination-left-btn:hover {
  cursor: pointer;
  color: var(--white);
  background-color: var(--blue-30);
}

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

.filterBar {
  width: fit-content;
  display: flex;
  flex-wrap: wrap;
  margin:0 auto;
  font-size: 1rem;
  align-items: center;
  color: var(--bgColor);
  border-radius: 0.5rem;
  justify-content: space-around;
  background-color: var(--menuColor);
  box-shadow: 0px 3px 2px var(--menuSelectedColor);
}

.filter-wrap {
  padding: 0.2rem 2rem;
}

.filter-wrap>label {
  margin-right: 0rem;
}

.filter-wrap>select {
  font-size: 0.8rem;
  padding: 0 0.2rem;
  border-radius: 0.5rem;
  border-color: var(--menuColor);
}

.table {
  width: 95%;
  font-size: 1rem;
  border-spacing: 0;
  text-align: center;
  margin: 1rem auto 0 auto;
  border-collapse: collapse;
}

.thead {
  color: var(--bgColor);
  border-radius: 0.5rem 0.5rem 0 0;
  background-color: var(--menuColor);
}

.tbody {
  max-height: 75dvh;
  overflow-y: auto;
  border-radius: 0 0 0.5rem 0.5rem;
}

::-webkit-scrollbar {
  width: 5px;
}

::-webkit-scrollbar-track {
  background-color: transparent;
}

::-webkit-scrollbar-thumb {
  background-color: #b6b5b5;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background-color: #dbdada;
}

.tr {
  display: flex;
  padding: 0.2rem 0.5rem;
}

.th {
  padding: 0.2rem 0.5rem;
  width: fit-content;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.tbody> :nth-child(even) {
  background-color: rgb(233, 232, 232);
}

.tbody>.tr>.td {
  padding: 0.5rem 0.5rem;
}

.roomNumber,
.date,
.totalPrice,
.status {
  width: 20%;
}

.detail {
  width: 20%;
}

/* กลาง */
@media screen and (min-width: 826px) {
  .header {
    display: block;
  }

  .filterBar {
    font-size: 1.2rem;
    padding: 0.2rem 2rem;
  }

  .filter-wrap {
    margin: 0.5rem 0rem;
    padding: 0.1rem 2rem;
  }

  .filter-wrap>label {
    margin-right: 0rem;
  }

  .filter-wrap>select {
    font-size: 1rem;
    width: 5.5rem;
    padding: 0 0.5rem;
    border-color: var(--menuColor);
  }

  .table {
    font-size: 1.2rem;
  }

  .th {
    font-size: 1.4rem;
  }

  .tbody {
    max-height: 70dvh;
    overflow-y: auto;
  }
}

/* ใหญ่ */
@media screen and (min-width: 1200px) {

  .filter-wrap>select {
    padding: 0 0.5rem;
    width: 7.5rem;
  }

  .table {
    width: 90%;
  }

  .th {
    font-size: 1.5rem;
  }
}
</style>
