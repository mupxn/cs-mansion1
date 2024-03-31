<script setup>
import { reactive, onMounted } from 'vue';
import UserDetailBox from "../components/UserDetailBox.vue"
import axios from "axios"
const data = reactive({
  RentingData: [],
});
const props = defineProps(['dropdownData'])
const queryUser = async () => {
  try {
    const response = await axios.get("http://localhost:3001/api/admin/user");
    data.RentingData = await response.data
  } catch (error) {
    console.error("Error fetching renting data:", error);
  }
}
const isModalShow = reactive({ state: false });
const onDetailCLick = () => {
  isModalShow.state = !isModalShow.state;
}

const submit = async (event) => {
  event.preventDefault()
  const body = {
    UserID: event.target.UserID.value,
    UserName: event.target.UserName.value,
    UserPhone: event.target.UserPhone.value,
    UserAddress: event.target.UserAddress.value
  }
  try {
    const response = await axios.post("http://localhost:3001/api/admin/user/insert", body);
    if (response.data.status === 'success') {
      await queryUser()
      isModalShow.state = false;
    }
    else {
      document.getElementById("responseLog").innerHTML = "มีข้อผิดผลาดเกิดขึ้น";
    }
  } catch (error) {
    document.getElementById("responseLog").innerHTML = "มีข้อผิดผลาดเกิดขึ้น";
  }
};
onMounted(async () => {
  await queryUser()
})

</script>

<template>
  <div class="modal" v-if="isModalShow.state">
    <div class="backdrop" @click="onDetailCLick()"></div>
    <div class="madal">
      <div class="modal-header">
        เพิ่มผู้เช่า
      </div>
      <form @submit="submit">
        <div class="modal-body">
          <table>
            <tr>
              <td>
                <div class="modal-context"> รหัสผู้เช่า  </div>
              </td>
              <td><input type="text" name="UserID" pattern="[0-9]{13}" required></td>
            </tr>
            <tr>
              <td>
                <div class="modal-context"> ผู้เช่า  </div>
              </td>
              <td><input type="text" name="UserName" required></td>
            </tr>
            <tr>
              <td>
                <div class="modal-context"> เบอร์โทรศัพท์  </div>
              </td>
              <td><input type="text" name="UserPhone" required></td>
            </tr>
            <tr>
              <td>
                <div class="modal-context"> ที่อยู่  </div>
              </td>
              <td><input type="text" name="UserAddress" required></td>
            </tr>
          </table>
        </div>
        <div id="responseLog" class="responseLog"></div>
        <div class="modal-footer">
          <div class="btn-wrap">
            <button class="btn btn-red" @click="onDetailCLick()">ยกเลิก</button>
            <input type="submit" value="ยืนยัน" class="btn btn-blue" />
          </div>
        </div>
      </form>
    </div>
  </div>
  <section class="container">
    <header class="header">
      ผู้เช่า:
    </header>
    <div class="table">
      <div class="thead">
        <div class="tr">
          <div class="th roomNumber">ชื่อผู้เช่า</div>
          <div class="th date">เบอร์โทรศัพท์</div>
          <div class="th totalPrice">ที่อยู่</div>
          <div class="th detail">แก้ไข</div>
        </div>
      </div>
      <div class="tbody">
        <div class="Trow" v-for="(item, index) in data.RentingData" :key="index">
          <UserDetailBox :item="item" />
        </div>
      </div>
    </div>
    <div class="freeBTN" @click="onDetailCLick()">
      <div class="addBTN">เพิ่มผู้ใช้</div>
    </div>
  </section>
</template>

<style scoped>
.responseLog {
  width: 100%;
  text-align: center;
  color: red;
}

input {
  height: 1.4rem;
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

.modal-context {
  padding: 0.2rem 0;
}

.modal-body {
  min-width: 20rem;
  
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

.freeBTN {
  position: fixed;
  bottom: 5rem;
  right: 5rem;
}

.addBTN {
  margin: 0 auto;
  color: white;
  cursor: pointer;
  font-weight: bold;
  width: fit-content;
  padding: 0.4rem 0.4rem;
  background-color: var(--menuColor);
  border-radius: 0.3rem;
  white-space: nowrap;
  text-overflow: ellipsis;
  min-width: 3rem;
}

.addBTN:hover {
  background-color: gray;
  color: white;
}

.btn {
  background-color: #f1f1f1;
  min-width: 5rem;
  height: 1.75rem;
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
  margin: 0 auto;
  font-size: 1rem;
  align-items: center;
  color: var(--bgColor);
  border-radius: 0.5rem;
  justify-content: space-around;
  background-color: var(--menuColor);
  box-shadow: 0px 3px 2px var(--menuSelectedColor);
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
  max-height: 75dvh;
  overflow-y: auto;
  border-radius: 0 0 0.5rem 0.5rem;

}

.tr {
  display: flex;
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
    max-height: 70dvh;
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
