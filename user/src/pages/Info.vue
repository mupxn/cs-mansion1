<script setup>
import { reactive, onMounted } from "vue";
import axios from "axios"
import { useUserStore } from "../module/userstore"
const userstore = useUserStore();
const props = defineProps(["item"]);
const emit = defineEmits(["dropdownData"]);
const data = reactive({
  RentingData: undefined,
});
const queryExpenses = async () => {
    const response = await axios.post("http://localhost:3001/api/user/info", { RentingID: userstore.data.response.RentingID});
    data.RentingData = await response.data[0];
}
onMounted(async () => {
    queryExpenses()
})
</script>

<template>
  <div class="container">
    <header class="header">
      ข้อมูลอื่นๆ:
    </header>
    <div class="table">
      <div class="thead">
        <div class="tr">
          <div class="th">ข้อมูลหอพัก</div>
        </div>
      </div>
      <div class="tbody">
        <div class="tr">
          <div class="td head">เลขห้อง</div>
          <div class="td context">{{ data.RentingData?.RoomID }}</div>
        </div><hr>
        <div class="tr">
          <div class="td head">ข้อมูลห้อง</div>
          <div class="td context">{{ data.RentingData?.RoomDetail }}</div>
        </div><hr>
        <div class="tr">
          <div class="td head">ประเภทห้อง</div>
          <div class="td context">{{ data.RentingData?.RoomTypeID }}</div>
        </div><hr>
        <div class="tr">
          <div class="td head">ราคาห้อง</div>
          <div class="td context">{{ data.RentingData?.RoomPrice }}</div>
        </div><hr>
        <div class="tr">
          <div class="td head">เริ่มเช่าตั้งแต่วันที่</div>
          <div class="td context">{{ data.RentingData?.RentingStart.slice(0,10) }}</div>
        </div>
      </div>
    </div>

    <div class="table">
      <div class="thead">
        <div class="tr">
          <div class="th">ข้อมูลผู้เช่า</div>
        </div>
      </div>
      <div class="tbody">
        <div class="tr">
          <div class="td head">ชื่อ</div>
          <div class="td context">{{ data.RentingData?.UserName }}</div>
        </div><hr>
        <div class="tr">
          <div class="td head">เบอร์โทรศัพท์</div>
          <div class="td context">{{ data.RentingData?.UserPhone }}</div>
        </div><hr>
        <div class="tr">
          <div class="td head">ที่อยู่</div>
          <div class="td context">{{ data.RentingData?.UserAddress }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  width: 100%;
  height: 100%;
  display: block;
}

hr{
  margin: 0 auto;
  border-top: 0.1px solid rgb(234, 233, 233);
  width: 95%;
  align-items: center;
}

.header {
  font-size: 2rem;
  font-weight: 1000;
  margin-top: 0.5rem;
  display: none;
}

.thead {
  color: var(--bgColor);
  border-radius: 0.5rem 0.5rem 0 0;
  background-color: var(--menuColor);
}

.tbody {
  max-height: 75dvh;
  overflow-y: auto;
  border-radius:0 0 0.5rem 0.5rem ;
}


.table {
  width: 70%;
  border-radius: 0.5rem;
  box-shadow: 2px 2px 2px 2px var(--menuSelectedColor);
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

.th {
  padding: 0.2rem 1.5rem;
  font-size: 1.2rem;
  width: fit-content;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.tbody {
  overflow-y: auto;
  border-radius: 0 0 0.5rem 0.5rem;
  justify-content: space-around;
  margin: 0 auto;

}




.tr {
  display: flex;
  /* flex-wrap: wrap; */
  padding-top: 0.5%;
}


.td {
  text-align: left;
  display: flex;
  margin-left: 5%;
  padding-top: 1%;
  padding-bottom: 1%;
  width: 50%;
  align-items: stretch;
}

.head {
  width: 60%;
}

.context {
  width: 45%;
}



@media screen and (min-width:826px) {
  .header {
    display: block;
  }

  .table {
    font-size: 1.2rem;
  }


  .topic {
    font-size: 1.4rem;
    margin-bottom: 0.5%;
  }



}

@media screen and (min-width:1200px) {

  .topic {
    font-size: 1.5rem;
    margin-bottom: 0.5%;
  }

}
</style>

