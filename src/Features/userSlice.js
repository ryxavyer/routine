import {createSlice} from '@reduxjs/toolkit';

const userSlice = createSlice({
    name:'user',
    initialState:{
        isSignedIn:false,
        userData:null,
        itemData:[],
        listData:[],
        selectedIndex:0,
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
        setListData:(state, action)=> {
            state.listData = action.payload;
        },
        setSelectedIndex:(state, action)=> {
            state.selectedIndex = action.payload;
        },
        setUserInput:(state, action)=> {
            state.userInput = action.payload
        }
    },
})

export const {setSignedIn, setUserData, setItemData, setListData, setSelectedIndex, setUserInput} = userSlice.actions

export const selectSignedIn = (state) => state.user.isSignedIn
export const selectUserData = (state) => state.user.userData
export const selectItemData = (state) => state.user.itemData
export const selectListData = (state) => state.user.listData
export const selectSelectedIndex = (state) => state.user.selectedIndex
export const selectUserInput = (state) => state.user.userInput

export default userSlice.reducer