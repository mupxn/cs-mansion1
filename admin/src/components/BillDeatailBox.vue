<script setup>
import { reactive, onMounted } from "vue";
import axios from "axios";
const props = defineProps(["item"]);
const emit = defineEmits(["queryBill"]);
const isEdit = reactive({ state: false });
const isDetailShow = reactive({ state: false });
const isDelelte = reactive({ state: false });
const data = reactive({
  expenses: undefined,
});
const onDetailBTNClick = async () => {
  isDetailShow.state = !isDetailShow.state;
  isEdit.state = false;
  if (isDetailShow.state && data.expenses === undefined) {
    await queryExpenses()
  }
};
const onEditBTNClick = () => {
  isEdit.state = !isEdit.state;
};

const deleteBill = async () => {
  const body = {
    billId: props.item.BillID,
  }
  const response = await axios.post("http://localhost:3001/api/admin/billdata/delete", body);
  if (response.data.status === 'success') {
    emit('queryBill');
    isDetailShow.state = false;
    isEdit.state = false;
    isDelelte.state = false;
  }
}

const submit = async (event) => {
  event.preventDefault();
  let ExpenID=[],ExpenTitle=[],ExpenPrice=[];
  if(event.target?.ExpenID?.value && event.target?.ExpenTitle?.value && event.target?.ExpenPrice?.value){
    ExpenID = [event.target?.ExpenID?.value]
    ExpenTitle = [event.target?.ExpenTitle?.value]
    ExpenPrice = [event.target?.ExpenPrice?.value]
  } else if(event.target?.ExpenID?.length && event.target?.ExpenTitle?.length && event.target?.ExpenPrice?.length){
    ExpenID = [...event.target?.ExpenID].map((d) => d.value)
    ExpenTitle = [...event.target?.ExpenTitle].map((d) => d.value)
    ExpenPrice = [...event.target?.ExpenPrice].map((d) => d.value)
  }
  const body = {
    billId: props.item.BillID,
    BillWaterPrice: event.target.BillWaterPrice.value,
    BillElectricPrice: event.target.BillElectricPrice.value,
    ExpensesID: ExpenID,
    ExpensesTitle: ExpenTitle,
    ExpensesPrice: ExpenPrice,
  }
  const response = await axios.post("http://localhost:3001/api/admin/billdata/update", body);
  if (response.data.status === 'success') {
    props.item.BillWaterPrice = body.BillWaterPrice
    props.item.BillElectricPrice = body.BillElectricPrice
    props.item.BillTotalPrice = response.data.newTotalPrice
    data.expenses.forEach((d, index) => {
      data.expenses[index].ExpenTitle = body.ExpensesTitle[index]
      data.expenses[index].ExpenPrice = body.ExpensesPrice[index]
    });
  }
  isEdit.state = false;
}
const queryExpenses = async () => {
  const response = await axios.post("http://localhost:3001/api/admin/billdata/expenses", { billId: props.item.BillID });
  data.expenses = await response.data;
}
onMounted(async () => {
  queryExpenses()
})
</script>

<template>
  <!-- data ถ้า edit state เป็น false ( เมื่อยังไม่กด edit )-->
  <div class="dataTable tr">
    <div class="td roomNumber">{{ props.item.RoomID }}</div>
    <div class="td date">{{ props.item.BillDate.slice(0, 10) }}</div>
    <div class="td totalPrice">{{ props.item.BillTotalPrice }}</div>
    <div class="td status">{{ props.item.BillStatusName }}</div>
    <div class="td detail" @click="onDetailBTNClick()">
      <div class="detailBTN">รายละเอียด</div>
    </div>
  </div>

  <!-- show -->
  <div style="width: 100%; text-align: center;display:flex;margin: 1rem 0;" v-if="isDetailShow.state && !isEdit.state">
    <div class="imageBill" style="height: 25rem;" v-if="props.item.slip">
      <img :src="props.item.slip" jsaction="VQAsE" class="sFlh5c pT0Scc iPVvYb" style="height: 25rem;">
    </div>
    <div class="Table" style="width: 100%;">
      <div class="dataTable tr" style="width: 40%; justify-content:space-between; margin:0 auto;">
        <div class="td waterUnit">ค่าน้ำ</div>
        <div class="td waterUnit">{{ props.item.BillWaterPrice }}</div>
      </div>
      <div class="dataTable tr" style="width: 40%; justify-content:space-between; margin:0 auto;">
        <div class="td electricUnit">ค่าไฟ</div>
        <div class="td electricUnit">{{ props.item.BillElectricPrice }}</div>
      </div>
      <div class="dataTable tr" style="width: 40%; justify-content:space-between; margin:0 auto;"
        v-for="(expen, index) in data.expenses" :key="index">
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
      <div class="alert" style="color:red;" v-if="isDelelte.state">คุณต้องการลบบิลใช่หรือไม่</div>
      <div class="dataTable tr" style="width: 40%; justify-content:space-around; margin:0 auto;" v-if="!isDelelte.state && props.item.BillStatusID!==2">
        <div class="td detail" @click="onEditBTNClick()" v-if="!isEdit.state">
          <div class="detailBTN" style="font-size: 1rem;">แก้ไข</div>
        </div>
        <div class="td detail" @click="() => { isDelelte.state = true }" v-if="!isEdit.state">
          <div class="btn-red" style="font-size: 1rem;">ลบ</div>
        </div>
      </div>
      <div class="dataTable tr" style="width: 40%; justify-content:space-around; margin:0 auto;" v-else-if="props.item.BillStatusID!==2">
        <div class="td detail" @click="() => { isDelelte.state = false }">
          <div class="detailBTN" style="font-size: 1rem;">ยกเลิก</div>
        </div>
        <div class="td detail" @click="deleteBill">
          <div class="btn-red" style="font-size: 1rem;">ยืนยัน</div>
        </div>
      </div>
    </div>
  </div>

  <div style="width: 100%; text-align: center;;display:flex;margin: 1rem 0;" v-if="isDetailShow.state && isEdit.state">
    <div class="imageBill" style="height: 25rem;" v-if="props.item.slip">
      <img :src="props.item.slip" jsaction="VQAsE" class="sFlh5c pT0Scc iPVvYb" style="height: 25rem;">
    </div>
    <form @submit="submit" style="width: 100%;">
      <div class="dataTable tr" style="width: 40%; justify-content:space-between; margin:0 auto;">
        <div class="td waterUnit">ค่าน้ำ</div>
        <input name="BillWaterPrice" class="td waterUnit" style="height: 70%; width: 20%; font-size: 1rem;"
          :value="props.item.BillWaterPrice">
      </div>
      <div class="dataTable tr" style="width: 40%; justify-content:space-between; margin:0 auto;">
        <div class="td electricUnit">ค่าไฟ</div>
        <input name="BillElectricPrice" class="td electricUnit" style="height: 70%; width: 20%; font-size: 1rem;"
          :value="props.item.BillElectricPrice">
      </div>
      <div class="dataTable tr" style="width: 40%; justify-content:space-between; margin:0 auto;"
        v-for="(expen, index) in data.expenses" :key="index">
        <input type="hidden" name="ExpenID" :value="expen.ExpenID">
        <input name="ExpenTitle" class="td expensesUnit" style="height: 70%; width: 60%; font-size: 1rem;"
          :value="expen.ExpenTitle">
        <input type="number" name="ExpenPrice" :id="expen.ExpenID" class="td expensesUnit"
          style="height: 70%; width: 20%; font-size: 1rem;" :value="expen.ExpenPrice">
      </div>

      <div class="dataTable tr" style="width: 40%; justify-content:space-between; margin:0 auto;"
        v-if="isDetailShow.state && !isEdit.state" v-for="(expen, index) in data.expenses" :key="index">
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
        <div class="td detail" @click="onEditBTNClick()" v-if="!isEdit.state">
          <div class="detailBTN" style="font-size: 1rem;">แก้ไข</div>
        </div>
        <div class="td detail" @click="onEditBTNClick()" v-if="isEdit.state">
          <div style="font-size: 1rem;" class="detailBTN">ยกเลิก</div>
        </div>
        <div class="td detail" v-if="isEdit.state">
          <input style="border: none; font-size: 1rem;" type="submit" class="detailBTN" value="ยืนยัน">
        </div>

      </div>
    </form>
  </div>
</template>

<style scoped>

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

.btn-red {
  margin: 0 auto;
  color: white;
  cursor: pointer;
  font-weight: bold;
  width: fit-content;
  padding: 0.1rem 0.3rem;
  background-color: #D83F31;
  color: white;
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
