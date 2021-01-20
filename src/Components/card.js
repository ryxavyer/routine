import React from 'react';
import '../Styling/card.css';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import CheckIcon from '@material-ui/icons/Check';


const useStyles = makeStyles((theme) => ({
    body: {
        maxWidth: 400,
        maxHeight: 20,
        boxShadow: '0px 2px 15px rgba(0, 0, 0, 0.3)',
        margin: 'auto',
        backgroundColor: 'rgb(150, 96, 204)',
    },
}))

export const Card = ({listOfItems}) => {

    const classes = useStyles()

    const deleteItem = (id) => {
        fetch(`/api/${id}`, {
            method: 'POST',
            body: JSON.stringify({
                id: id
            })
        }).then(response => response.json()).then(data=>{
            console.log(data)
        })
    }

    const formatItems = () => {
        return (
            listOfItems.map(item => {
            return (
                <div className={classes.body}>
                    <List>
                        <ListItem key={item.id}>
                            <ListItemText primary={item.content} style={{ color:'white' }}/>
                            <ListItemSecondaryAction>
                                <IconButton edge='end' onClick={() => deleteItem(item.id)} style={{color:'white'}}> 
                                    <CheckIcon />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    </List>
                </div>
            )
            })
        )
    }

    return(
        formatItems()
    )
}