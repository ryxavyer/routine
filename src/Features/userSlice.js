import {createSlice} from '@reduxjs/toolkit';

const userSlice = createSlice({
    name:'user',
    initialState:{
        isSignedIn:false,
        userData:null,
        itemData:null,
        userInput:null,
    },
    reducers:{
        setSignedIn:(state,action)=> {
            state.isSignedIn = action.payload;
        },
        setUserData:(state, action)=> {
            state.userData = action.payload;
        },
        setItemData:(state, action)=> {
            state.itemData = action.payload;
        },
        setUserInput:(state, action)=> {
            state.userInput = action.payload
        }
    },
})

export const {setSignedIn, setUserData, setItemData, setUserInput} = userSlice.actions

export const selectSignedIn = (state) => state.user.isSignedIn
export const selectUserData = (state) => state.user.userData
export const selectItemData = (state) => state.user.itemData
export const selectUserInput = (state) => state.user.userInput

export default userSlice.reducer