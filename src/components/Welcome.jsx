import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import user from "../appwrite/accounts.js";
import { Link } from "react-router-dom";
import Alert from "./Alert.jsx";


function Welcome() {

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [emailInput, setEmailInput] = useState('');
    const [password, setPassword] = useState('');
    const [passwordCheck, setPasswordCheck] = useState('');
    
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);

    const [passShow, setPassShow] = useState(false);

    function isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 

        return regex.test(email);
    }

    function isStrongPassword(password) {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#])[A-Za-z\d@$!%*?&.#]{8,}$/;

        return regex.test(password);
    }

    async function creatingUser(e) {
        try {
            e.preventDefault();

            if(!firstName || !lastName || !emailInput || !password || !passwordCheck) return;
            if(password !== passwordCheck) {
                alert("Your passwords don't match");
                setPasswordCheck('');
                return;
            }

            const nameArray = [firstName, lastName];
            const name = nameArray.join(' ');
            const email = emailInput.toLowerCase();

            if(!isValidEmail(email)) {
                setEmailError(prev => !prev);
                setEmailInput('')
                return;
            }

            if(!isStrongPassword(password)) {
                setPasswordError(prev => !prev);
                setPassword('');
                setPasswordCheck('');
                return;
            }

            const userDetails = {
                name,
                email,
                password
            }

            await user.create(userDetails);
            await user.login({email, password});
            await user.createVer("http://localhost:5173/verify");
            alert("Account created successfully! Please check your inbox and verify your email to log in properly.");

            setFirstName('');
            setLastName('');
            setEmailInput('');
            setPassword('');
            setPasswordCheck('');

        } catch (error) {

            console.log(error);

            if (error?.type === "user_already_exists") {
                alert("You already have an account.");
            } else {
                alert("Something went wrong. Try again.");
            }        
        }
    }

    useEffect(() => {

        if(!passwordError) return;

        const timer = setTimeout(() => {
            setPasswordError(prev => !prev);
        }, 3000)

        return () => clearTimeout(timer);

    }, [passwordError]);

    useEffect(() => {

        if(!emailError) return;

        const timer = setTimeout(() =>{
            setEmailError(prev => !prev);
        }, 3000)

        return () => clearTimeout(timer);
    }, [emailError]);

    return createPortal(
        <form className="welcome-page">

            {/* <p>Welcome!</p> */}

            <div className="sign-inputs-cont">

                <div className="welcome-note">
                    <h1>Welcome!</h1>
                    <p>Sign Up to access the app</p>    
                </div>                    

                <div className="sign-inputs-box">
                    <input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)}/>
                    <input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)}/>
                    
                    <div className="flex flex-col">
                        {emailError && <p className="text-start text-sm text-fromcolorr">Please enter a valid email address</p>}
                        <input type="email" placeholder="Email" value={emailInput} onChange={(e) => setEmailInput(e.target.value)}/>
                    </div>


                    <div className="flex flex-col">
                        <div className={`flex justify-between items-center ${!passwordError ? 'justify-end' : ''}`}>
                            {passwordError && <p className="text-fromcolorr text-sm">Password must be at least 8 characters and include uppercase, lowercase, number, and symbol.</p>}
                            <i className={`bi text-lg pr-2 ${passShow ? 'bi-eye' : 'bi-eye-slash'}`} 
                                onClick={() => setPassShow(prev => !prev)}    
                            ></i>
                        </div> 
                        <input type={passShow ? 'text' : 'password'} value={password} placeholder="Password" onChange={e => setPassword(e.target.value)}/>
                    </div>

                    <div className="flex flex-col"> 
                        <i className={`bi text-end text-lg pr-2 ${passShow ? 'bi-eye' : 'bi-eye-slash'}`}
                            onClick={() => setPassShow(prev => !prev)}
                        ></i>
                        <input type={passShow ? 'text' : 'password'} value={passwordCheck} placeholder="Confirm Password" onChange={e => setPasswordCheck(e.target.value)}/>
                    </div>
        
                </div>
    
                <button type="button" className="button" onClick={e => creatingUser(e)}>Sign Up</button>

                <p>
                    Already have an account?{" "} 

                    <Link to={"/signin"}>
                        <span className="text-tocolorb cursor-pointer">Sign In</span>                       
                    </Link>    

                </p>
    
            </div>
        
            {/* <Alert/> */}
            {/* <Verify /> */}
        </form>,
        document.getElementById("modal-root")
    );
}

export default Welcome;