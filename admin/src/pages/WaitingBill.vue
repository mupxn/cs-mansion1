<script setup>
import WaitingDetailBox from "../components/WaitingDetailBox.vue";
import { reactive, onMounted } from "vue";
import axios from "axios"
const props = defineProps(["dropdownData"]);

const data = reactive({
  Bill: []
})
const queryState = reactive({
  roomId: 'All',
  statusId: '3'
})
const pagination = reactive({
  page: 1,
  pageBar: [],
  maxPage: 0,
  memory: {},
  render: [],
  entries: 50
});
const prequeryBill = async () => {
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
  queryBill()
}
const queryBill = async () => {
  let response = await axios.post("http://localhost:3001/api/admin/billdata", { roomId: queryState.roomId, statusId: queryState.statusId, entries: pagination.entries, page: pagination.page });
  data.Bill = response.data.bill;
  pagination.maxPage = Math.ceil(response.data?.allRecord / pagination?.entries)
  pagination.memory[queryState.statusId][queryState.roomId][pagination.page] = data.Bill;
  pagination.memory[queryState.statusId][queryState.roomId]["maxPage"] = pagination.maxPage;
  pagination.render = data.Bill
  generatePageBar();
}
const filterRoomId = (event) => {
  event.preventDefault();
  queryState.roomId = event.target.value;
  pagination.page=1;
  prequeryBill();
}
const filterStatus = (event) => {
  event.preventDefault();
  queryState.statusId = event.target.value;
  pagination.page=1;
  prequeryBill();
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
    prequeryBill()
  } else {
    pagination.render = pagination.memory[queryState.statusId][queryState.roomId][pagination.page];
    generatePageBar();
  }
}
const prevPage = () => {
  pagination.page--;
  if (pagination.memory[queryState.statusId][queryState.roomId][pagination.page] === undefined || pagination.showAdmin) {
    prequeryBill()
  } else {
    pagination.render = pagination.memory[queryState.statusId][queryState.roomId][pagination.page];
    generatePageBar();
  }
}
const nextPage = () => {
  pagination.page++;
  if (pagination.memory[queryState.statusId][queryState.roomId][pagination.page] === undefined || pagination.showAdmin) {
    prequeryBill()
  } else {
    pagination.render = pagination.memory[queryState.statusId][queryState.roomId][pagination.page];
    generatePageBar();
  }
}

onMounted(async () => {
  await prequeryBill()
  generatePageBar();
})
</script>

<template>
  <section class="container">
    <header class="header">
      รายการรอยืนยัน:
    </header>
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
          <WaitingDetailBox :item="item" @queryBill="queryBill"/>
          <!--  "  -->
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

.filterBar {
  width: 95%;
  display: flex;
  flex-wrap: wrap;
  margin: 0 auto;
  font-size: 1rem;
  align-items: center;
  color: var(--bgColor);
  border-radius: 0.5rem;
  justify-content: space-around;
  background-color: var(--menuColor);
  box-shadow: 0px 3px 2px var(--menuSelectedColor);
}
.filterBar>:last-child{
  width:fit-content;
  padding: 0;
  margin: 0;
}
.detailBTN {
  margin: 0 auto;
  color: white;
  cursor: pointer;
  font-weight: bold;
  width: fit-content;
  padding: 0.2rem 0.5rem;
  background-color: var(--btnColor);
  border-radius: 0.3rem;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.filter-wrap {
  padding: 0.2rem;
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
  height: 70dvh;
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

.td {
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.tbody>:nth-child(even) {
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
@media screen and (min-width:826px) {
  .header {
    display: block;
  }

  .filterBar {
    margin: 0 auto;
    font-size: 1.2rem;
    width: fit-content;
    padding: 0.2rem 0.5rem;
  }

  .filter-wrap {
    margin: 0.5rem 3rem;
  }

  .filter-wrap>label {
    margin-right: 0.5rem;
  }

  .filter-wrap>select {
    font-size: 1rem;
    padding: 0 1.5rem;
    border-radius: 0.5rem;
    border-color: var(--menuColor);
  }

  .table {
    font-size: 1.2rem;
  }

  .th {
    font-size: 1.4rem;
  }

  .tbody {
    max-height: 77dvh;
    height: 77dvh;
    overflow-y: auto;
  }
}

@media screen and (min-width:1200px) {
  .filterBar {
    width: 60%;
    min-width: 800px;
  }

  .filter-wrap>select {
    padding: 0 2rem;
  }

  .table {
    width: 90%;
  }

  .th {
    font-size: 1.5rem;
  }
}
</style>
