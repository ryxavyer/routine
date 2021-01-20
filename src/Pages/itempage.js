import React, {useState, useEffect} from 'react';
import { ItemForm } from '../Components/itemform';
import { ListForm } from '../Components/listform'
import { useSelector } from 'react-redux';
import { selectUserData } from '../Features/userSlice';
import Navbar from '../Components/navbar';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import CheckIcon from '@material-ui/icons/Check';
import { FixedSizeList } from 'react-window';


const useStyles = makeStyles((theme) => ({
    body: {
        maxWidth: 400,
        boxShadow: '0px 3px 8px rgba(0, 0, 0, 0.5)',
        margin: 'auto auto 10px auto',
        backgroundColor: 'rgb(150, 96, 204)',
        color: 'white',
    },
}))

export const ItemPage = () => {

    const classes = useStyles()

    const userData = useSelector(selectUserData)

    const [selectedIndex, setSelectedIndex] = useState(1)
    const [lists, setLists] = useState([])
    const [items, setItems] = useState([])
    const [addItem, setAddItem] = useState('')
    const [addList, setAddList] = useState('')

    const handleListItemClick = (index) => {
        setSelectedIndex(index)
        setItems(Array.from(lists[index].items))
        renderItems()
    }

    const updateLists = (data) => {
        setItems(data)
        let newArr = lists
        newArr[selectedIndex] = data
        setLists(newArr)
    }

    useEffect(() => {
        fetch(`/api/fetchinfo`).then(response => {
            if(response.ok){
               return response.json()
            }
        }).then(data => {
            setLists(Array.from(data))
            handleListItemClick(selectedIndex)
        })
    },[userData?.email]) // eslint-disable-line

    const handleFormChange = (inputValue) => {
        setAddItem(inputValue)
    }

    const handleListFormChange = (inputValue) => {
        setAddList(inputValue)
    }

    const handleFormSubmit = () => {
        fetch(`/api/${list.id}/create`, {
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
            let newArr = lists.concat(Array.from(data))
            setLists(newArr)
            handleListItemClick(lists.length)
        })
    }

    const getLatestItems = () => {
        fetch(`/api/${list.id}`).then(response => {
            if (response.ok){
                return response.json()
            }
        }).then(data => {
            updateLists(data)
            renderItems()
        })
    }

    const deleteItem = (id) => {
        fetch(`/api/delete`, {
            method: 'POST',
            body: JSON.stringify({
                id: id
            })
        }).then(response => response.json()).then(data=>{
            getLatestItems()
        })
    }

    const renderItems = () => {
        return (
            <div className={classes.body}>
                <FixedSizeList height={400} width={300} itemSize={46} itemCount={items.length}>
                    {items.map(item => {
                        return (
                                <ListItem key={item.id}>
                                    <ListItemText primary={item.content}/>
                                    <ListItemSecondaryAction>
                                        <IconButton edge='end' onClick={() => deleteItem(item.id)} style={{color:'white'}}> 
                                            <CheckIcon />
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                        )
                        })}
                </FixedSizeList>
            </div>
        )
    }

    const renderLists = () => {
        return (
            <div className={classes.list}>
                <List component='nav'>
                    {formatLists()}
                </List>
            </div>
        )
    }

    const formatLists = () => {
        return(
            lists.map((list,index) => {
                return (
                    <ListItem key={list.id} button selected={selectedIndex === index} onClick={(event) => handleListItemClick(event, index)}>
                        <ListItemText primary={list.name}/>
                    </ListItem>
                )
            }))
    }

    return(
        <>
            <Navbar />
            <ItemForm userInput={addItem} onFormChange={ handleFormChange } onFormSubmit={ handleFormSubmit }/>
            <ListForm userInput={addList} onFormChange={ handleListFormChange } onFormSubmit={ handleListFormSubmit }/>
            {renderLists()}
        </>
    )
}