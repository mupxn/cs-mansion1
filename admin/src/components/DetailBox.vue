<script setup>
import { reactive } from 'vue';
defineProps(["DetailName", "DetailPrice"])
const Switch = reactive({ IsOpen: "false" })
const onModeChange = () => {
  if (Switch.IsOpen === 'false' || null) {
    Switch.IsOpen = 'true'
  } else if (Switch.IsOpen === 'true') {
    Switch.IsOpen = 'false'
  }
}
/*เพิ่ม*/
const isEdit = reactive({ state: false });
const onEditBTNClick = () => {
  isEdit.state = !isEdit.state;
};
const submit = (event) => {
  event.preventDefault();
  isEdit.state = false;
}
</script>
<template>
  <section class="table">
    <div class="thead">
      <div class="tr">
        <div class="th" style="min-width: fit-content">
          <div>
            {{ DetailName }}
          </div>
        </div>
        <div class="th">
          <div class="toggle-container" @click="onModeChange"
            :style="`background-color:${Switch.IsOpen === 'true' ? 'var(--menuColor)' : ''}; `">
            <div class="toggle-circle"
              :style="`margin-left:${Switch.IsOpen === 'true' ? '1.275rem' : '0'}; border:${Switch.IsOpen === 'true' ? '1px solid white' : ''}; background-color:${Switch.IsOpen === 'true' ? 'white' : ''};`">
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="tbody" v-if="!isEdit.state">
      <div class="td detail">{{ DetailPrice }}</div>
      <div class="td edit" @click="onEditBTNClick()">
        <div class="editBTN">แก้ไข</div>
      </div>
    </div>
    <!--เพิ่ม-->
    <div class="tbody" v-else>
      <input class="td detail" style="font-size: 1rem ; height: 1rem ; margin-top: 0.2rem;" :value="DetailPrice" />

    </div>

    <div style="width: 100%; text-align: center ;" v-if="isEdit.state">
      <form @submit="submit">
        <div class="box" style="margin-right: 0; display: flex;">
          <div class="td detail" @click="onEditBTNClick()">
            <input style="border: none; font-size: 1rem;" type="submit" class="detailBTN" value="ยืนยัน">
          </div>
          <div class="td detail" @click="onEditBTNClick()">
            <div style="font-size: 1rem;" class="detailBTN">ยกเลิก</div>
          </div>
        </div>
      </form>

    </div>
    <!-- </div> -->
  </section>
</template>
<style scoped>
.toggle-container {
  width: 2.5rem;
  border: 1px solid white;
  border-radius: 10px;
  background-color: white;
  height: 1.15rem;
  transition: all 0.2s ease-out;
}

.toggle-circle {
  width: 1rem;
  height: 1rem;
  border: 1px solid var(--menuColor);
  border-radius: 50%;
  transition: all 0.2s ease-out;
  position: relative;
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

.editBTN {
  margin-right: 1rem;
  color: white;
  cursor: pointer;
  font-weight: bold;
  width: fit-content;
  padding: 0.2rem 0.5rem;
  background-color: var(--btnColor);
  border-radius: 0.5rem;
  white-space: nowrap;
  text-overflow: ellipsis;
  height: fit-content;
}

.table {
  width: 15rem;
  border-radius: 0.5rem;
  box-shadow: 2px 2px 2px 2px var(--menuSelectedColor);
  margin-top: 1rem;
  margin-left: 1rem;
}

.thead {
  color: var(--bgColor);
  border-radius: 0.5rem 0.5rem 0 0;
  background-color: var(--menuColor);
}

.tbody {
  border-radius: 0 0 0.5rem 0.5rem;
  justify-content: space-around;
  margin: 0 auto;
  display: flex;
}

.tr {
  display: flex;
  padding-top: 0.5%;
  justify-content: space-between;
  align-items: center;
}

.td {
  text-align: left;
  margin-left: 5%;
  padding-top: 1%;
  padding-bottom: 1%;
  width: 50%;
}

.th {
  padding: 0.2rem 1.5rem;
  width: fit-content;
  font-weight: bold;
  display: flex;
  justify-content: space-around;

}

.tbody>.tr>.td {
  padding: 0.5rem 0.5rem;
}

.detail {
  width: 70%;
  padding: 0.5rem 1rem;
}

.edit {
  width: 30%;
}

@media screen and (min-width: 826px) {
  .table {
    font-size: 1.2rem;
  }
}

@media screen and (min-width: 1200px) {}
</style>
