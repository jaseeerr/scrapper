import { createSlice  } from "@reduxjs/toolkit";





const userSlice = createSlice({
    name:"userInfo",
    initialState:{
       
        login:null,
        userdata:null,
        busy:false,
        address:{}

    },
    reducers:{
        
       
        loginStatus:(state,action)=>{
            state.login = action.payload
        },
        updateUserdata:(state,action)=>{
        
            state.userdata = action.payload
            localStorage.setItem('account',action.payload.username)
        },
        updateBusy:(state,action)=>{
            
            state.busy = action.payload
        },
        updateAddress:(state,action)=>{
            
            state.address = action.payload
        }
        
    }
})

export const {loginStatus,updateUserdata,updateBusy, updateAddress} = userSlice.actions

export default userSlice.reducer


  
  
  
  
  


