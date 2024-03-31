<script setup>
import Sidebar from './components/Sidebar.vue';
import { reactive, onMounted } from 'vue';
import { teamColor } from './module/team.js';
import axios from "axios"

const dropdownData = reactive({ roomId: [],status:[],roomStatus:[] });
const queryExpenses = async () => {
  const billstatus = await axios.get("http://localhost:3001/api/user/billstatus");
  // const RoomID = await axios.get("http://localhost:3001/api/user/RoomID");
  // const roomStatus = await axios.get("http://localhost:3001/user/admin/roomstatus");
  dropdownData.status = await billstatus.data;
  // dropdownData.roomId = await RoomID.data;
  // dropdownData.roomStatus = await roomStatus.data;
}
onMounted(async () => {
  await queryExpenses()
})
</script>

<template>
  <div class="container" :style="`--bgColor:${teamColor.bgColor};
      --textColor:${teamColor.textColor};
      --menuColor:${teamColor.menuColor};
      --btnColor:${teamColor.btnColor};
      --menuShadowColor:${teamColor.menuShadowColor};
      --menuGradientColor:${teamColor.menuGradientColor};
      --menuSelectedColor:${teamColor.menuSelectedColor};`">
    <aside class="navContainer">
      <Sidebar />
    </aside>
    <div class="page">
      <router-view :dropdownData="dropdownData"/>
    </div>
  </div>
</template>

<style scoped>
.container {
  width: 100%;
  height: 100%;
  display: block;
}

.navContainer {
  width: 100%;
  border-right: 1px solid var(--menuSelectedColor);
  height: fit-content;
}

.page {
  width: 100%;
}

@media screen and (min-width:826px) {
  .container {
    display: flex;
  }

  .navContainer {
    width: 20vw;
    height: 98dvh;
  }

  .page {
    width: 80vw;
    padding: 1rem 1rem ;
    overflow-y:hidden;
  }
}
</style>
