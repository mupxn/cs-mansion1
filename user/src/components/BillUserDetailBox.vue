<script setup>
import { reactive, onMounted } from "vue";
import axios from "axios"
const isDetailShow = reactive({ state: false });
const isModalShow = reactive({ state: false });
const props = defineProps(["item"]);
const emit = defineEmits(['queryBill'])
const data = reactive({
    expenses: undefined,
    slip: ''
});
const handleFileChange = (event) => {
    const files = event.target.files;
    if (files.length > 0) {
        convertToBase64(files);
        // console.log(convertToBase64(files))
    }
    event.target.files = null;

};

const convertToBase64 = (files) => {
    for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        reader.onload = async (event) => {
            // PostData.Content.Images.push(String(event.target?.result));
            data.slip = event.target?.result;
        };
        reader.readAsDataURL(files[i]);
    }
};

const submit = async () => {
    const response = await axios.post("http://localhost:3001/api/user/slip", { billId: props.item.BillID, slip: data.slip });
    data.expenses = await response.data;
    props.item.slip = data.slip
    emit('queryBill')
    isDetailShow.state = false;
    isModalShow.state = false;
    if (inputRef.value && inputRef.value.click) {
        inputRef.value.click();
    }
}
const onDetailCLick = () => {
    isModalShow.state = !isModalShow.state;
}
const queryExpenses = async () => {
    const response = await axios.post("http://localhost:3001/api/user/billdata/expenses", { billId: props.item.BillID });
    data.expenses = await response.data;
}
onMounted(async () => {
    await queryExpenses()
})
</script>

<template>
    <div class="modal" v-if="isModalShow.state">
        <div class="backdrop" @click="onDetailCLick()"></div>
        <div class="madal">
            <div class="modal-header">
                ห้องพัก {{ props.item.RoomID }}
            </div>
            <div class="modal-body">
                <div class="context-container" style="display: flex;flex-wrap: wrap;">
                    <img :src="props.item.slip ? props.item.slip : 'https://promptpay.io/0614077850.png/' + props.item.BillTotalPrice"
                        alt="" style="width:18rem;padding: 1rem;">
                    <div class="context-wrap">
                        <div class="modal-context"> วันที่ {{ props.item.BillDate.slice(0, 10) }}</div>
                        <div class="modal-context">ค่าน้ำ : {{ props.item.BillWaterPrice }}</div>
                        <div class="modal-context">ค่าไฟ : {{ props.item.BillElectricPrice }}</div>
                        <div class="modal-context">ค่าห้องพัก : {{ props.item.RoomPrice }}</div>
                        <div class="modal-context" v-for="(expen, index) in data.expenses" :key="index">{{ expen.ExpenTitle
                        }}:{{ expen.ExpenPrice }}</div>
                        <div class="modal-context">ราคารวม: {{ props.item.BillTotalPrice }}</div>
                    </div>
                </div>
                <input class="modal-context" type="file" accept="image/*" @change="handleFileChange($event)" v-if="props.item.BillStatusID !== 2">

            </div>
            <div class="modal-footer">
                <div class="btn-wrap" v-if="props.item.BillStatusID !== 2">
                    <button class="btn btn-red" @click="onDetailCLick()">ยกเลิก</button>
                    <button class="btn btn-blue" @click="submit()">ยืนยัน</button>
                </div>
                <div class="btn-wrap" v-else>
                    <button class="btn btn-red" @click="onDetailCLick()">ปิด</button>
                </div>
            </div>
        </div>
    </div>

    <div class=" dataTable tr">
        <div class="td roomNumber">{{ props.item.RoomID }}</div>
        <div class="td date">{{ props.item.BillDate.slice(0, 10) }}</div>
        <div class="td totalPrice">{{ props.item.BillTotalPrice }}</div>
        <div class="td status">{{ props.item.BillStatusName }}</div>
        <div class="td detail" @click="onDetailCLick()">
            <div class="detailBTN">รายละเอียด</div>
        </div>
    </div>
</template>

<style scoped>
input {
    margin-top: 1rem;
}

input::file-selector-button {
    font-weight: bold;
    color: var(--menuColor);
    padding: 0.5em;
    border: thin solid rgba(50, 49, 49, 0.388);
    border-radius: 3px;
    background-color: white;
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
    width: fit-content;
    text-align: center;
    padding: 2rem 0;
    align-items: center;
    margin: 0 auto;
}

.modal-context {
    align-items: center;
    margin: 0 auto;
    width: fit-content;
    width: 100%;
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
    padding: 0.2rem 0.5rem;
    background-color: var(--btnColor);
    border-radius: 0.3rem;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.dropdown {
    position: relative;
    display: inline-block;
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

.dropdown-content {
    position: relative;
    background-color: #f1f1f1;
    min-width: 5rem;
    height: 1.75rem;
    
    border: none;
    border-radius: 0.3rem;
    white-space: nowrap;
    padding: 0.1rem 0.3rem;
    text-overflow: ellipsis;
}


.tr {
    display: flex;
    width: 100%;
    padding: 0.2rem 0.5rem;
}


.td {
    display: flex;
    align-items: center;
    justify-content: space-around;
    width: fit-content;
}

.detail {
    width: 20%;
}

.roomNumber,
.date,
.totalPrice,
.status {
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