import { defineStore } from "pinia"

export const useUserStore = defineStore('Userdata', {
  state: () => ({ data:{} }),
  actions: {
    setInfo(info){
      this.data = info
    }
  }
})

export default useUserStore;