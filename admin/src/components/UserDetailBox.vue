<script setup>
import { reactive } from "vue";
import axios from "axios"
const props = defineProps(["item"]);
const isEdit = reactive({ state: false });

const onEditBTNClick = () => {
    isEdit.state = !isEdit.state;
};
const submit = async (event) => {
    event.preventDefault();
    const body = {
        UserID : props.item.UserID,
        UserName: event.target.UserName.value,
        UserPhone: event.target.UserPhone.value,
        UserAddress: event.target.UserAddress.value
    }
    const response = await axios.post("http://localhost:3001/api/admin/user/update", body);

    if (response.data.status === 'success') {
        props.item.UserName = body.UserName
        props.item.UserPhone = body.UserPhone
        props.item.UserAddress = body.UserAddress
    }
    isEdit.state = false;
}
</script>

<template>
    <form @submit="submit">
        <div class="dataTable tr" v-if="!isEdit.state">
            <div class="td roomNumber">{{ props.item.UserName }}</div>
            <div class="td date">{{ props.item.UserPhone }}</div>
            <div class="td totalPrice">{{ props.item.UserAddress }}</div>
            <div class="td detail" @click="onEditBTNClick()">
                <div class="detailBTN">แก้ไข</div>
            </div>
        </div>
        <div class="dataTable tr" v-else>
            <input class="td roomNumber" name="UserName" :value="props.item.UserName" />
            <input class="td date" name="UserPhone" :value="props.item.UserPhone" />
            <input class="td totalPrice" name="UserAddress" :value="props.item.UserAddress" />

        </div>
        <div style="width:50%; text-align: center;margin: 1rem auto;" v-if="isEdit.state">
            <div style="width: 100%;display: flex;justify-content: space-around;">
                <div class="td detail">
                    <input style="border: none; font-size: 1rem;" type="submit" class="detailBTN" value="ยืนยัน">
                </div>
                <div class="td detail" @click="onEditBTNClick()">
                    <div style="font-size: 1rem;" class="detailBTN">ยกเลิก</div>
                </div>
            </div>
        </div>
    </form>
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

.tr {
    display: flex;
    padding: 0.2rem 0.5rem;

}

.td {
    display: flex;
    align-items: center;
    justify-content: space-around;
}

.tr>.td {
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

.detail-button {
    width: 6%;
}

.button-box {
    display: flex;
    flex-direction: row-reverse;
}
</style>