import React from 'react';
import { GoogleLogin } from 'react-google-login';
import { useSelector, useDispatch } from 'react-redux';
import { selectSignedIn, setSignedIn, setUserData } from "../Features/userSlice";
import "../Styling/homepage.css";

const Homepage = () => {

    const dispatch = useDispatch()

    const Login = async googleData => {
        
        const res = await fetch("/api/authorize", {
            method: "POST",
            body: JSON.stringify({
                token: googleData.tokenId
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })

        const data = await res.json()
        //console.log(data)
        dispatch(setSignedIn(true))
        dispatch(setUserData(data))
    }

    const isSignedIn = useSelector(selectSignedIn)

    return(
        <div className='home__page' style={{ display:isSignedIn? "none" : "" }}>
            {!isSignedIn ? <div className='login__message'>
                <h1>Routine</h1>
                <p>
                    Keep track of your daily tasks and get more done.<br></br>Log in to get started.
                </p>
                <GoogleLogin
                    clientId = '337980151831-tjeibe2b4gbe5bkc14g3mkjbc15ts9fk.apps.googleusercontent.com'
                    // render={(renderProps) => (
                    //     <button
                    //         onClick={renderProps.onClick}
                    //         disabled={renderProps.disabled}
                    //         className='login__button'
                    //     >Sign in with Google</button>
                    // )}
                    onSuccess={Login}
                    onFailure={Login}
                    icon={true}
                    isSignedIn={true}
                    className="login__button"
                    cookiePolicy={'single_host_origin'}
                />
            </div> : '' }
        </div>
    )
}

export default Homepage