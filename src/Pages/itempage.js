import React, {useState, useEffect} from 'react';
import { ItemForm } from '../Components/itemform';
import { ListForm } from '../Components/listform';
import { ItemCard } from '../Components/itemcard';
import { ListCard } from '../Components/listcard';
import { useDispatch, useSelector } from 'react-redux';
import { selectListData, selectSelectedIndex, setListData, setItemData, setSelectedIndex } from '../Features/userSlice';
import Navbar from '../Components/navbar';
import '../Styling/itempage.css';


export const ItemPage = () => {

    const dispatch = useDispatch()

    const selectedIndex = useSelector(selectSelectedIndex)
    const lists = useSelector(selectListData)

    const [addItem, setAddItem] = useState('')
    const [addList, setAddList] = useState('')
    const [isEmpty, setIsEmpty] = useState(false)


    useEffect(() => {
        updateInfo()
    },[]) //eslint-disable-line

    const updateInfo = () => {
        fetch(`/api/fetchinfo`).then(response => {
            if(response.ok){
               return response.json()
            }
        }).then(data => {
            if(!(!data.length)){
                if(data[selectedIndex] === undefined) {
                    dispatch(setSelectedIndex(0))
                    dispatch(setListData(Array.from(data)))
                    dispatch(setItemData(data[0].items))
                } else {
                    dispatch(setListData(Array.from(data)))
                    dispatch(setItemData(data[selectedIndex].items))
                }
            } else {
                dispatch(setListData([]))
                dispatch(setItemData([]))
                setIsEmpty(true)
            }
        })
    }

    const handleFormChange = (inputValue) => {
        setAddItem(inputValue)
    }

    const handleListFormChange = (inputValue) => {
        setAddList(inputValue)
    }

    const handleFormSubmit = () => {
        fetch(`/api/${lists[selectedIndex].id}/create`, {
            method: 'POST',
            body: JSON.stringify({
                content:addItem
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        }).then(response => response.json()).then(message => {
            setAddItem('')
            getLatestItems()
        })
    }

    const handleListFormSubmit = () => {
        fetch(`/api/createlist`, {
            method: 'POST',
            body: JSON.stringify({
                name:addList
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        }).then(response => response.json()).then(data => {
            setAddList('')
            let newArr = lists.concat(data)
            dispatch(setListData(newArr))
            dispatch(setItemData(newArr[newArr.length-1].items))
            dispatch(setSelectedIndex(newArr.length-1))
            if (isEmpty) setIsEmpty(false)
        })
    }

    const getLatestItems = () => {
        fetch(`/api/${lists[selectedIndex].id}`).then(response => {
            if (response.ok){
                return response.json()
            }
        }).then(data => {
            let currList = {id:lists[selectedIndex].id, items:data.items, name:lists[selectedIndex].name}
            let newLists = []
            for (const [index, value] of lists.entries()) {
                if (index === selectedIndex) {
                    newLists.push(currList)
                }
                else newLists.push(value)
            }
            dispatch(setListData(newLists))
            dispatch(setItemData(data.items))
        })
    }

    return(
        <>
            <Navbar />
            <div className="outer__div"><div className="list__div">
                    <ListForm userInput={addList} onFormChange={ handleListFormChange } onFormSubmit={ handleListFormSubmit }/>
                    <ListCard update={ updateInfo }/>
                </div><div className="item__div">
                    <ItemForm userInput={addItem} onFormChange={ handleFormChange } onFormSubmit={ handleFormSubmit } isEmpty={ isEmpty }/>
                    <ItemCard update={ updateInfo }/>
                </div>
            </div>
        </>
    )
}