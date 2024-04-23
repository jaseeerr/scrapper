import { createSlice  } from "@reduxjs/toolkit";





const cartSlice = createSlice({
    name:"cartInfo",
    initialState:{
       
        items:[],
        counterItems:[],
        couponApplied:false,
        couponCode:""
        

    },
    reducers:{
        
       
        loginStatus:(state,action)=>{
            state.login = action.payload
        },
        updateCart:(state,action)=>{
        
            state.items = action.payload
         
        },
        updateCounterCart:(state,action)=>{
        
            state.counterItems = action.payload
         
        },
        updateCouponApplied:(state,action)=>{
            
            state.couponApplied = action.payload
        },
        updateCouponCode:(state,action)=>{
            
            state.couponCode = action.payload
        },
        
        updateBusy:(state,action)=>{
            
            state.busy = action.payload
        },
       
        
    }
})

export const {loginStatus,updateCart,updateBusy,updateCouponApplied,updateCouponCode,updateCounterCart} = cartSlice.actions

export default cartSlice.reducer


  
  
  
  
  


