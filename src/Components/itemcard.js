import React, { useEffect } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import CheckIcon from '@material-ui/icons/Check';
import List from '@material-ui/core/List';
import Tooltip from '@material-ui/core/Tooltip';
import { useSelector, useDispatch } from 'react-redux';
import { selectItemData, selectListData, selectSelectedIndex, setItemData, setListData } from '../Features/userSlice';


const useStyles = makeStyles((theme) => ({
    body: {
        width: '100%',
        paddingBottom: 0,
        paddingTop: 0,
        boxShadow: '0px 3px 8px rgba(0, 0, 0, 0.5)',
        backgroundColor: 'rgb(150, 96, 204)',
        color: 'white',
        fontFamily: 'Inter',
    },
    text: {
        fontSize: 16,
    },
    icon: {
       padding: 8,
       '& svg': {
           fontSize: 20,
       }
    },
}))

const LightTooltip = withStyles((theme) => ({
    tooltip: {
      backgroundColor: theme.palette.common.white,
      color: 'rgba(0, 0, 3, 3)',
      boxShadow: theme.shadows[1],
      fontSize: 11,
      fontFamily: 'Inter',
    },
  }))(Tooltip);

export const ItemCard = () => {

    const classes = useStyles()

    const dispatch = useDispatch()
    const items = useSelector(selectItemData)
    const lists = useSelector(selectListData)
    const selectedIndex = useSelector(selectSelectedIndex)

    useEffect(() => {
        renderItems()
        //eslint-disable-next-line
    },[items])

    const deleteItem = (id) => {
        fetch(`/api/delete`, {
            method: 'POST',
            body: JSON.stringify({
                list_id: lists[selectedIndex].id,
                id: id
            })
        }).then(response => response.json()).then(data=>{
            console.log(data)
            let filteredItems = items.filter(item => item.id !== id)
            let newLists = []
            for (const [index, value] of lists.entries()) {
                if (index === selectedIndex) {
                    newLists.push({id:lists[selectedIndex].id, items:filteredItems, name:lists[selectedIndex].name})
                }
                else newLists.push(value)
            }
            dispatch(setListData(newLists))
            dispatch(setItemData(filteredItems))
        })
    }

    const renderItems = () => {
        return (
            <div className={classes.body}>
                <List className={classes.body}>
                    {items.map(item => {
                        return (
                                <ListItem key={item.id}>
                                    <ListItemText primary={item.content} classes={{primary: classes.text}}/>
                                    <ListItemSecondaryAction>
                                        <LightTooltip title="Mark complete" placement='right'>
                                        <IconButton edge='end' onClick={() => deleteItem(item.id)} style={{color:'white'}} className={classes.icon}> 
                                            <CheckIcon />
                                        </IconButton>
                                        </LightTooltip>
                                    </ListItemSecondaryAction>
                                </ListItem>
                        )
                        })}
                </List>
            </div>
        )
    }

    return(
        renderItems()
    )
}