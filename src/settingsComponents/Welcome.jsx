import { useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { addUser } from "../actions/userActions.js";

function Welcome() {

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmedPassword, setConfirmedPassword] = useState('');

    console.log(password);
    console.log(confirmedPassword);

    const profile = {
        fname: firstName,
        lname: lastName,
        email: email,
    }

    function handleSubmit() {

        addUser(profile);

        setFirstName('');
        setLastName('');
        setEmail('');
        setPassword('');
        setConfirmedPassword('');


        console.log('Yes you can!');
    
    }

    return createPortal(
        <form className="welcome-page">

            {/* <p>Welcome!</p> */}

            <div className="sign">

                <div className="sign-inputs-cont">

                    <div className="welcome-note">
                        <h1>Welcome!</h1>
                        <p>Sign up to access the app</p>    
                    </div>                    

                    <div className="sign-inputs-box">
                        <input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)}/>
                        <input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)}/>
                        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                        <input type="password" placeholder="Confirm Password" value={confirmedPassword} onChange={(e) => setConfirmedPassword(e.target.value)}/>
                    </div>
                    <button type="button" className="button" onClick={handleSubmit}>
                        Sign up
                    </button>
                    <p>Already have an account? Sign in</p>
                </div>
            </div>

        </form>,
        document.getElementById("modal-root")
    );
}

export default Welcome;