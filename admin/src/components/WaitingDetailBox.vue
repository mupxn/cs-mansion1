<script setup>
import { reactive, onMounted } from 'vue';
import axios from "axios"
const isEdit = reactive({ state: false });
const isDetailShow = reactive({ state: false });
const isModalShow = reactive({ state: false });
const props = defineProps(["item"]);
const emit = defineEmits(["queryBill"]);
const data = reactive({
  Expenses: null
})
const res = reactive({
  detail: []
})
const onDetailBTNClick = () => {
  isDetailShow.state = !isDetailShow.state;
  isEdit.state = false;
};

const queryExpenses = async () => {
  const response = await axios.post("http://localhost:3001/api/admin/billdata/expenses", { billId: props.item.BillID });
  data.Expenses = await response.data;
}
const updateStatus = async (statusId) => {
  const response = await axios.post("http://localhost:3001/api/admin/billdata/updateStatus", { statusID: statusId, billID: props.item.BillID });
  if (response.data.status === 'success') {
    if (statusId === 2) {
      res.detail = "รับชำระเงินเสร็จสิ้น";
    } else {
      res.detail = "ปฎิเสธการชำระเงินชำระเงิน";
    }
  } else {
    res.detail = "มีข้อผิดพลาดเกิดขึ้น";
  }
  isModalShow.state = true;
}
const closeModal = async () => {
  isModalShow.state = false;
  isDetailShow.state = false;
  isEdit.state = false;
  await emit('queryBill');
}

onMounted(async () => {
  if (!data.Expenses) {
    await queryExpenses()
  }
})
</script>


<template>
  <div class="modal" v-if="isModalShow.state">
    <div class="backdrop"></div>
    <div class="madal">
      <div class="modal-body">
        <div class="modal-context">{{ res.detail }}</div>
      </div>
      <div class="modal-footer">
        <div class="btn-wrap">
          <div class="detailBTN" @click="closeModal">เสร็จสิ้น</div>
        </div>
      </div>
    </div>
  </div>
  <div class="dataTable tr">
    <div class="td roomNumber">{{ props.item.RoomID }}</div>
    <div class="td date">{{ props.item.BillDate.slice(0, 10) }}</div>
    <div class="td totalPrice">{{ props.item.BillTotalPrice }}</div>
    <div class="td status">{{ props.item.BillStatusName }}</div>
    <div class="td detail" @click="onDetailBTNClick()">
      <div class="detailBTN">เพิ่มเติม</div>
    </div>
  </div>

  <div class="" style="width: 100%; text-align: center;" v-if="isDetailShow.state">
    <div class="imageBill" style="height: 30rem;" v-if="props.item.slip">
      <img :src="props.item.slip" jsaction="VQAsE" class="sFlh5c pT0Scc iPVvYb" style="height: 30rem;">
    </div>
    <div class="Table" style="width: 100%;">
      <form>
        <div class="dataTable tr" style="width: 40%; justify-content:space-between; margin:0 auto;">
          <div class="td waterUnit">ค่าน้ำ</div>
          <div class="td waterUnit">{{ props.item.BillWaterPrice }}</div>
        </div>
        <div class="dataTable tr" style="width: 40%; justify-content:space-between; margin:0 auto;">
          <div class="td electricUnit">ค่าไฟ</div>
          <div class="td electricUnit">{{ props.item.BillElectricPrice }}</div>
        </div>
        <div class="dataTable tr" style="width: 40%; justify-content:space-between; margin:0 auto;"
          v-for="(expen, index) in data.Expenses" :key="index">
          <div class="td expensesUnit">{{ expen.ExpenTitle }}</div>
          <div class="td expensesUnit">{{ expen.ExpenPrice }}</div>
        </div>
        <div class="dataTable tr" style="width: 40%; justify-content:space-between; margin:0 auto;">
          <div class="td electricUnit">ค่าห้อง</div>
          <div class="td electricUnit">{{ props.item.RoomPrice }}</div>
        </div>
        <div class="dataTable tr" style="width: 40%; justify-content:space-between; margin:0 auto;">
          <div class="td electricUnit">ราคารวม</div>
          <div class="td electricUnit">{{ props.item.BillTotalPrice }}</div>
        </div>
        <div class="dataTable tr" style="width: 40%; justify-content:space-around; margin:0 auto;">
          <div class="td detail">
            <div style="font-size: 1rem;" class="detailBTN" @click="updateStatus(2)">ยืนยัน</div>
          </div>
          <div class="td detail">
            <div style="font-size: 1rem;" class="detailBTN" @click="updateStatus(4)">ปฎิเสธ</div>
          </div>
        </div>
      </form>
    </div>

  </div>
</template>


<style scoped>
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
  align-items: center;
  margin: 0 auto;
}

.modal-context {
  align-items: center;
  margin: 0 auto;
  width: fit-content;
  width: 60%;
  padding: 1% 0;
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


.detailBTN {
  margin: 0 auto;
  color: white;
  cursor: pointer;
  font-weight: bold;
  width: fit-content;
  padding: 0.1rem 0.3rem;
  background-color: var(--btnColor);
  border-radius: 0.3rem;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.tr {
  display: flex;
  padding: 0.2rem 0.5rem;
}

.td {
  display: flex;
  align-items: center;
  justify-content: space-around;
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
</style>