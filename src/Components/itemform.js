import React from 'react';
import '../Styling/itemform.css';

export const ItemForm = ({ userInput, onFormChange, onFormSubmit}) => {

    const handleChange = (event) => {
        onFormChange(event.target.value)
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        onFormSubmit()
    }
    return(
        <>
            <div className='input__div'>
                <form onSubmit={handleSubmit}>
                    <input className='input__form' type='text' required value={userInput} onChange={handleChange} placeholder='Add a task ...'></input>
                    <input className='input__submit' type='submit'></input>
                </form>
            </div>
        </>
    )
}