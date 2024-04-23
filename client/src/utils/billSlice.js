import { createSlice  } from "@reduxjs/toolkit";





const billSlice = createSlice({
    name:"billInfo",
    initialState:{
       
        bill:{},
       
        

    },
    reducers:{
        
       
        
        updateBill:(state,action)=>{
        
            state.bill = action.payload
         
        },
       
       
        
    }
})

export const {updateBill} = billSlice.actions

export default billSlice.reducer


  
  
  
  
  


