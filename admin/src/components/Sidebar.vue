<script setup>
import { reactive } from 'vue';
import axios from "axios";
import { useRouter } from 'vue-router';
const route = useRouter();
const menuReactive = reactive({ isShow: false });
const isModalShow = reactive({ state: false });
const onMenuIconClick = () => {
    if (window.innerWidth >= 826){ return}
    if (menuReactive.isShow) {
        menuReactive.isShow = false;
        document.getElementById("Menu").style.display = "none";
        document.getElementById("logout").style.display = "none";
        document.getElementById("icon").style.transform = "rotate(0deg)";
    } else {
        menuReactive.isShow = true;
        document.getElementById("Menu").style.display = "block";
        document.getElementById("logout").style.display = "flex";
        document.getElementById("icon").style.transform = "rotate(90deg)";
    }
}
const submit = async () =>{
    const response = await axios.get("http://localhost:3001/api/admin/removesessions",{withCredentials:true});
    if(response.data.status==='success'){
        isModalShow.state = !isModalShow.state;
        route.push("/login")
    }
}
const onDetailCLick = () => {
  isModalShow.state = !isModalShow.state;
}
</script>

<template>
    <div class="modal" v-if="isModalShow.state">
        <div class="backdrop" @click="onDetailCLick()"></div>
        <div class="madal">
            <div class="modal-header">
                ออกจากระบบ
            </div>
            <div class="modal-body">
                คุณต้องการออกจากระบบใช่หรือไม่
            </div>
            <div class="modal-footer">
                <div class="btn-wrap">
                    <button class="btn btn-red" @click="onDetailCLick()">ยกเลิก</button>
                    <button class="btn btn-blue" @click="submit()">ยืนยัน</button>
                </div>
            </div>
        </div>
    </div>
    <nav class="navContainer">
        <div class="logo">
            <p class="text">cs mansion</p>
            <div class="icon" @click="onMenuIconClick" id="icon">
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
        <div class="menu-list" id="Menu" >
            <router-link to="/" @click="onMenuIconClick">
                <div class="menu-wrap">
                    หน้าแรก
                </div>
            </router-link>
            <router-link to="/waitingbill" @click="onMenuIconClick">
                <div class="menu-wrap">
                    รายการรอยืนยัน
                </div>
            </router-link>
            <router-link to="/bill" @click="onMenuIconClick">
                <div class="menu-wrap">
                    บิลค่าเช่า
                </div>
            </router-link>
            <router-link to="/room" @click="onMenuIconClick">
                <div class="menu-wrap">
                    ห้องพัก
                </div>
            </router-link>
            <router-link to="/user" @click="onMenuIconClick">
                <div class="menu-wrap">
                    ผู้เช่า
                </div>
            </router-link>
            <router-link to="/create-bill" @click="onMenuIconClick">
                <div class="menu-wrap">
                    สร้างบิล
                </div>
            </router-link>
            <router-link to="/rented-history" @click="onMenuIconClick">
                <div class="menu-wrap">
                    รายการเช่าห้องพัก
                </div>
            </router-link>
            <!-- <router-link to="/detail" @click="onMenuIconClick">
                <div class="menu-wrap">
                    รายละเอียดหอพัก
                </div>
            </router-link> -->
        </div>
        <div  @click="onDetailCLick" >
            <div class="logoutContainer" id="logout">
                <div class="logoutText-wrap">
                    ออกจากระบบ
                </div>
            </div>
        </div>
    </nav>
</template>

<style scoped>
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
.madal {
    background-color: white;
    padding: 1.5rem 2rem;
    border-radius: 0.5rem;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 100;
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
    z-index: 99;
}
.navContainer {
    width: 100%;
    text-align: space-between;
    background-color: white;
}

.logo {
    width: 95%;
    height: 3rem;
    margin: 1rem auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 1.5rem;
    background-color: var(--menuColor);
    border-radius: 0.3rem;
    color: white;
    margin-bottom: 0.5rem;
    box-shadow: 0px 0px 2px 2.5px var(--menuShadowColor);
}

.logo>.text,
.icon {
    margin: 0 0.5rem;
    transition: all 100ms;
}

.icon {
    width: 1.5rem;
    height: 1.5rem;
}

.icon>div {
    height: 5px;
    width: 100%;
    background-color: white;
    border-radius: 3rem;
    margin: 3px auto;
}

.menu-list {
    width: 80%;
    left: 9%;
    height: fit-content;
    display: none;
    position: fixed;
}

.menu-wrap {
    width: 100%;
    height: 2rem;
    color: var(--textColor);
    align-items: center;
    display: flex;
    justify-content: space-around;
    padding: 0.5rem;
    border-radius: 0.2rem;
    margin: 0 auto;
    background-color: var(--bgColor);
}

.menu-wrap:hover {
    background-color: var(--menuSelectedColor);
    cursor: pointer;
}

.logoutContainer {
    width: 82%;
    left: 9%;
    height: fit-content;
    display: none;
    position: fixed;
    background-color: var(--bgColor);
    top: 25.5rem;
    border-radius: 0.2rem;
}

.logoutText-wrap {
    width: 100%;
    height: 2rem;
    color: var(--textColor);
    align-items: center;
    display: flex;
    justify-content: space-around;
    padding: 0.5rem;
    border-radius: 0.2rem;
    margin: 0 auto;
}

.logoutContainer:hover {
    background-color: var(--menuSelectedColor);
    cursor: pointer;
}


@media screen and (min-width:826px) {
    .logo {
        width: 90%;
        justify-content: space-around;
    }

    .icon {
        display: none;
    }

    .menu-list {
        width: 80%;
        height: 80vh;
        display: block;
        position: relative;
    }

    .menu-wrap {
        justify-content: left;
        padding:0 0.5rem 0 -0.5rem;
    }

    .logoutContainer {
        width: 80%;
        justify-content: left;
        display: block;
        position: relative;
        top: 0rem;
    }

    .logoutText-wrap {
        justify-content: left;
    }
}
</style>
