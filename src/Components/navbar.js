import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectSignedIn, selectUserData, setUserData, setSignedIn } from '../Features/userSlice';
import { GoogleLogout } from 'react-google-login';
import '../Styling/navbar.css';

const Navbar = () => {

    const isSignedIn = useSelector(selectSignedIn)
    const userData = useSelector(selectUserData)
    const dispatch = useDispatch()

    const logout = (response) => {

        dispatch(setSignedIn(false))
        dispatch(setUserData(null))
        fetch('/api/logout').then(response => {
            if(response.ok){
                return response.json()
            }
        })

    }

    return(
        <div className='navbar'>
            <h1 className='navbar__header'>routine</h1>
            {isSignedIn ? 
            ( <div className='navbar__user__data'>
                <h1 className='signedIn'>{userData?.name}</h1>
                <GoogleLogout
                    clientId = '337980151831-tjeibe2b4gbe5bkc14g3mkjbc15ts9fk.apps.googleusercontent.com'
                    render={(renderProps) => (
                        <button
                            onClick={renderProps.onClick}
                            disabled={renderProps.disabled}
                            className='logout__button'
                        >
                            logout
                        </button>
                    )}
                    onLogoutSuccess={logout}
                />
            </div>
            ) : ''}
        </div>
    )}

export default Navbar