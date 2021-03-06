import React, { useEffect } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import MuiListItem from "@material-ui/core/ListItem";
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
import Tooltip from '@material-ui/core/Tooltip';
import { useSelector, useDispatch } from 'react-redux';
import { selectListData, selectSelectedIndex, setSelectedIndex, setItemData, setListData } from '../Features/userSlice';

const ListItem = withStyles({
    root: {
      "&$selected": {
        backgroundColor: "rgb(188,120,222)",
        color: "white"
      },
      "&$selected:hover": {
        backgroundColor: "rgb(188,120,222)",
        color: "white"
      },
      "&:hover": {
        backgroundColor: "rgb(170, 120, 221)",
        color: "white"
      }
    },
    selected: {}
  })(MuiListItem);

const useStyles = makeStyles((theme) => ({
    list: {
        width: '100%',
        paddingBottom: 0,
        paddingTop: 0,
        //boxShadow: '0px 3px 8px rgba(0, 0, 0, 0.4)',
        backgroundColor: 'transparent',
        color: 'white',
        fontFamily: 'Inter',
    },
    listItem: {
        boxShadow: '0px 3px 8px rgba(0, 0, 0, 0.5)',
        backgroundColor: 'rgb(150, 96, 204)',
        marginBottom: 10,
    },
    body: {
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

export const ListCard = ({update}) => {

    const classes = useStyles()

    const dispatch = useDispatch()

    const lists = useSelector(selectListData)
    const selectedIndex = useSelector(selectSelectedIndex)

    useEffect(() => {
        renderLists()
        //eslint-disable-next-line
    },[lists])

    const handleListItemClick = (index) => {
        dispatch(setSelectedIndex(index))
        dispatch(setItemData(lists[index].items))
    }

    const deleteList = (id) => {
        fetch(`/api/deletelist`, {
            method: 'POST',
            body: JSON.stringify({
                id: id
            })
        }).then(response => response.json()).then(data=>{
            dispatch(setSelectedIndex(0))
            let filteredArr = lists.filter(list => list.id !== id)
            dispatch(setListData(filteredArr))
            dispatch(setItemData(lists[0].items))
            update()
        })
    }

    const renderLists = () => {
        return (
            <div className={classes.list}>
                <List component='nav' className={classes.list}>
                    {lists.map((list,index) => {
                        return (
                            <ListItem className={classes.listItem} key={list.id} button selected={selectedIndex === index} onClick={() => handleListItemClick(index)}>
                                <ListItemText primary={list.name} classes={{primary: classes.body}}/>
                                <ListItemSecondaryAction>
                                    <LightTooltip title="Delete" placement='right'>
                                    <IconButton edge='end' onClick={() => deleteList(list.id)} style={{color:'white'}} className={classes.icon}> 
                                        <ClearIcon />
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
        renderLists()
    )
}