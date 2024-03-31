import { useUserStore } from "./userstore"
import axios from "axios"

export const authenticate = async () => {
    const userstore = useUserStore()
    try{
        const result = await axios.get("http://localhost:3001"+"/api/user/accessSession",{withCredentials:true});
            if(result.data.status === "success" ){
            userstore.setInfo(result.data);
            return true;
        }
        return userstore.data?true:false;

    }catch{
        console.log("authentication error")
        return false;
    }
    
}

export default authenticate;