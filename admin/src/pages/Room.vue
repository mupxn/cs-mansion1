<script setup>
import { reactive, onMounted } from "vue";
import RoomEditBox from "../components/RoomEditBox.vue";
import axios from "axios"
const isModalShow = reactive({ state: false });
const Roomtype = reactive({ data: [] });
const props = defineProps(["dropdownData"]);
const data = reactive({
  Room: []
})

const queryRoomtype = async () => {
  const billstatus = await axios.get("http://localhost:3001/api/admin/roomtype");
  Roomtype.data = await billstatus.data;
}

const pagination = reactive({
  page: 1,
  pageBar: [],
  maxPage: 0,
  memory: {},
  render: [],
  entries: 50
});
const queryState = reactive({
  roomId: 'All',
  statusId: 'All'
})

const preQueryRoom = async () => {
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
  await queryRoom();
}
const queryRoom = async () => {
  let response = await axios.post("http://localhost:3001/api/admin/room", { roomId: queryState.roomId, statusId: queryState.statusId, entries: pagination.entries, page: pagination.page });
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
  pagination.page = 1;
  preQueryRoom();
}
const filterStatus = (event) => {
  event.preventDefault();
  queryState.statusId = event.target.value;
  pagination.page = 1;
  preQueryRoom();
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
    preQueryRoom()
  } else {
    pagination.render = pagination.memory[queryState.statusId][queryState.roomId][pagination.page];
    generatePageBar();
  }
}
const prevPage = () => {
  pagination.page--;
  if (pagination.memory[queryState.statusId][queryState.roomId][pagination.page] === undefined || pagination.showAdmin) {
    preQueryRoom()
  } else {
    pagination.render = pagination.memory[queryState.statusId][queryState.roomId][pagination.page];
    generatePageBar();
  }
}
const nextPage = () => {
  pagination.page++;
  if (pagination.memory[queryState.statusId][queryState.roomId][pagination.page] === undefined || pagination.showAdmin) {
    preQueryRoom()
  } else {
    pagination.render = pagination.memory[queryState.statusId][queryState.roomId][pagination.page];
    generatePageBar();
  }
}
onMounted(async () => {
  await preQueryRoom()
  await queryRoomtype()
})



const submit = async (event) => {
  event.preventDefault();
  const body = {
    RoomID: event.target.RoomID.value,
    RoomPrice: event.target.RoomPrice.value,
    RoomDetail: event.target.RoomDetail.value,
    RoomSize: event.target.RoomSize.value,
    RoomTypeID: event.target.RoomTypeID.value,
  }
  try {
  const response = await axios.post("http://localhost:3001/api/admin/room/insert", body);
  if (response.data.status === 'success') {
    isModalShow.state = false;
    await queryRoom();
  } else {
      document.getElementById("responseLog").innerHTML = "มีข้อผิดผลาดเกิดขึ้น";
    }
  } catch (error) {
    document.getElementById("responseLog").innerHTML = "มีข้อผิดผลาดเกิดขึ้น";
  }
}

const onLeaveCLick = () => {
  isModalShow.state = !isModalShow.state;
}

</script>

<template>
  <section class="container">
    <header class="header">
      ห้องพัก:
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
        <label for="RoomStatus">สถานะ: </label>
        <select name="RoomID" id="RoomStatusID" @change="filterStatus($event)">
          <option value="All">ทั้งหมด</option>
          <option v-for="(item, index) in dropdownData.roomStatus" :key="index" :value="item.RoomStatusID">{{
            item.RoomStatusName }}
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
      <div class="filter-wrap">
        <div class="addBTN" @click="isModalShow.state = true">เพิ่มห้องพัก</div>
      </div>
    </div>
    <!-- {{ BillData }} -->
    <div class="table">
      <div class="thead">
        <div class="tr">
          <div class="th roomNumber">เลขห้อง</div>
          <div class="th date">ราคา</div>
          <div class="th totalPrice">ประเภท</div>
          <div class="th status">สถานะ</div>
          <div class="th detail">รายละเอียด</div>
          <div class="th edit">แก้ไข</div>
        </div>
      </div>
      <div class="tbody">
        <div class="Trow" v-for="(item, index) in pagination.render" :key="index">
          <RoomEditBox :item="item" />
        </div>
      </div>
    </div>
  </section>

  <div class="modal" v-if="isModalShow.state">
    <div class="backdrop" @click="onLeaveCLick()"></div>
    <div class="madal">
      <div class="modal-header">
        เพิ่มห้องพัก
      </div>
      <form @submit="submit">
        <div class="modal-body">
          <div class="tr" style="width: 80%; justify-content:space-between; margin:0 auto;">
            <div class="td">เลขห้อง</div>
            <input name="RoomID" type="number" class="td" style="height: 70%; width: 60%; font-size: 1rem;" required>
          </div>
          <div class="tr" style="width: 80%; justify-content:space-between; margin:0 auto;">
            <div class="td">ราคาห้อง</div>
            <input name="RoomPrice" type="number" class="td" style="height: 70%; width: 60%; font-size: 1rem;" required>
          </div>
          <div class="tr" style="width: 80%; justify-content:space-between; margin:0 auto;">
            <div class="td">รายละเอียด</div>
            <input name="RoomDetail" class="td" style="height: 70%; width: 60%; font-size: 1rem;" required>
          </div>
          <div class="tr" style="width: 80%; justify-content:space-between; margin:0 auto;">
            <div class="td">ขนาดห้อง</div>
            <input name="RoomSize" class="td" style="height: 70%; width: 60%; font-size: 1rem;" required>
          </div>
          <div class="tr" style="width: 80%; justify-content:space-between; margin:0 auto;">
            <div class="td">ประเภท</div>
            <select name="RoomTypeID">
              <option v-for="(item, index) in Roomtype.data" :key="index" :value="item.RoomTypeID">{{
                item.RoomTypeName }}
              </option>
            </select>
            
          </div>
        </div>
        <div id="responseLog" class="responseLog"></div>
        <div class="modal-footer">
          <div class="btn-wrap">
            <button class="btn btn-blue" @click="onLeaveCLick()">ยกเลิก</button>
            <input type="submit" class="btn btn-red" value="ยืนยัน">
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>

.responseLog{
  width: 100%;
  text-align: center;
  color: red;
}
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
  margin: 0 auto;
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
  text-align: center;
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

.edit {
  width: 20%;
}

.addBTN {
  margin: 0 auto;
  color: var(--menuColor);
  cursor: pointer;
  font-weight: bold;
  width: fit-content;
  padding: 0.1rem 0.3rem;
  background-color: white;
  border-radius: 0.3rem;
  white-space: nowrap;
  text-overflow: ellipsis;
  min-width: 3rem;
}

.addBTN:hover {
  background-color: gray;
  color: white;
}

.madal {
  background-color: white;
  padding: 1.5rem 2rem;
  border-radius: 0.5rem;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 5;
}

.modal-header {
  border-bottom: 1px solid rgb(211, 211, 211);
  text-align: center;
  padding: 0.5rem 0;
}

.modal-body {
  min-width: 20rem;
  text-align: center;
  padding: 2rem 0;
}

.modal-footer {
  padding: 0.5rem 0 1rem 0;
}

.btn-wrap {
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.backdrop {
  width: 100dvw;
  height: 100dvh;
  top: 0%;
  left: 0%;
  background-color: rgba(120, 120, 120, 0.3);
  position: fixed;
  z-index: 4;
}

.btn {
  background-color: #f1f1f1;
  min-width: 5rem;
  height: 1.75rem;
  /* box-shadow: 0px 8px 16px 0px rgba(154, 153, 153, 0.404); */
  border: none;
  border-radius: 0.3rem;
  white-space: nowrap;
  padding: 0.1rem 0.3rem;
  text-overflow: ellipsis;
  cursor: pointer;
}

.btn:hover {
  background-color: #6d6d6d;
}

.btn-red {
  background-color: #D83F31;
  color: white;
}

.btn-blue {
  background-color: #525FE1;
  color: white;
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