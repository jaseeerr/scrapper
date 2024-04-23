import { createSlice  } from "@reduxjs/toolkit";





const commonSlice = createSlice({
    name:"commonInfo",
    initialState:{
       
        page:1,
        

    },
    reducers:{
        
       
        loginStatus:(state,action)=>{
            state.login = action.payload
        },
        updatePage:(state,action)=>{
        
            state.page = action.payload
          
        },
        
        updateBusy:(state,action)=>{
            
            state.busy = action.payload
        }
        
    }
})

export const {loginStatus,updatePage,updateBusy} = commonSlice.actions

export default commonSlice.reducer


  
  
  
  
  


