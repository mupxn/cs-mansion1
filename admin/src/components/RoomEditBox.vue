<script setup>
import { reactive, onMounted } from "vue";
import axios from "axios"
const props = defineProps(["item"]);
const isEdit = reactive({ state: false });
const isDetailShow = reactive({ state: false });
const roomStatus = reactive({ status: [] });
const queryRoomStatus = async () => {
    const response = await axios.get("http://localhost:3001/api/admin/roomtype");
    roomStatus.status = response.data;
}
const onDetailBTNClick = () => {
    isDetailShow.state = !isDetailShow.state;
    isEdit.state = false;
};
const onEditBTNClick = () => {
    isEdit.state = !isEdit.state;
};
const submit = async (event) => {
  event.preventDefault();
  const body = {
    RoomID: props.item.RoomID,
    RoomPrice: event.target.RoomPrice.value,
    RoomDetail: event.target.RoomDetail.value,
    RoomTypeID:JSON.parse(event.target.RoomType.value).RoomTypeID
  }
  const response = await axios.post("http://localhost:3001/api/admin/room/update", body);
  if (response.data.status === 'success') {
    props.item.RoomPrice = body.RoomPrice
    props.item.RoomDetail = body.RoomDetail
    props.item.RoomTypeID = body.RoomTypeID
    props.item.RoomTypeName = JSON.parse(event.target.RoomType.value).RoomTypeName
  }
  isEdit.state = false;
}
onMounted(async () => {
    await queryRoomStatus()
})
</script>
<template>
    <!-- data ถ้า edit state เป็น false ( เมื่อยังไม่กด edit )-->
    <div class="dataTable tr" v-if="!isEdit.state">
        <div class="td roomNumber">{{ props.item.RoomID }}</div>
        <div class="td price">{{ props.item.RoomPrice }}</div>
        <div class="td type">{{ props.item.RoomTypeName }}</div>
        <div class="td status">{{ props.item.RoomStatusName }}</div>
        <div class="td detail" style="display:block;text-align: left;">{{ props.item.RoomDetail }}</div>
        <div class="td edit" @click="onEditBTNClick()">
            <div class="editBTN">แก้ไข</div>
        </div>
    </div>

    <div class="" style="width: 100%; text-align: center; display: flex;" v-if="isEdit.state">
        <form @submit="submit" style="width: 100%; text-align: center">
            <div class="dataTable tr">
                <input class="td roomNumber" disabled style="font-size: 1rem; text-align: center;"
                    :value="props.item.RoomID">
                <input class="td price" style="font-size: 1rem; text-align: center;" name="RoomPrice" :value="props.item.RoomPrice">
                <!-- <input class="td type" style="font-size: 1rem; text-align: center;" :value="props.item.RoomTypeName"> -->
                <span class="td type" style="font-size: 1rem; text-align: center;">
                    <select name="RoomType" id="RoomType">
                        <option :value="JSON.stringify({RoomTypeID: props.item.RoomTypeID,RoomTypeName: props.item.RoomTypeName})">{{
                            props.item.RoomTypeName }}</option>
                        <option v-for="(item, index) in roomStatus.status" :key="index" :value="JSON.stringify({RoomTypeID:item.RoomTypeID,RoomTypeName:item.RoomTypeName})">{{
                            item.RoomTypeName }}</option>
                    </select>
                </span>
                <input class="td status" disabled style="font-size: 1rem; text-align: center;"
                    :value="props.item.RoomStatusName">
                <input class="td detail" style="font-size: 1rem; text-align: center;" name="RoomDetail" :value="props.item.RoomDetail">
                <div class="td edit"></div>
            </div>
            <div class="dataTable tr" style="width: 40%; justify-content:space-around; margin:0 auto;">
                <div class="td edit">
                    <input style="border: none; font-size: 1rem;" type="submit" class="editBTN" value="ยืนยัน">
                </div>
                <div class="td edit" @click="onEditBTNClick()">
                    <div style="font-size: 1rem;" class="editBTN">ยกเลิก</div>
                </div>
            </div>
        </form>
    </div>
</template>


<style scoped>
.editBTN {
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
    min-width: 3rem;
}

.tr {
    display: flex;
    padding: 0.2rem 0.5rem;
}

.td {
    overflow: hidden;
    text-wrap: nowrap;
    text-overflow: ellipsis;
    text-align: center;
}

.tbody>.tr>.td {
    padding: 0.5rem 0.5rem;
}

.detail {
    width: 20%;
    text-align: center;
}

.roomNumber,
.type,
.price,
.status {
    width: 20%;
}

.edit {
    width: 20%;
    min-width: 5rem;
}

input[disabled] {
    border: none;
    outline: none;
}
</style>