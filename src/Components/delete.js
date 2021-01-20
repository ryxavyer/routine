import React from 'react';

export const Delete = () => {

    const deleteItem = ({ id }) => {
        fetch(`/api/${id}`, {
            method: 'POST',
            body: JSON.stringify({
                id: id
            })
        }).then(response => response.json()).then(data=>{
            console.log(data)
        })
    }

    return(
        <>
            <button>Delete</button>
        </>
    )
}