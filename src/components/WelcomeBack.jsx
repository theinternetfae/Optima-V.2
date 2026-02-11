import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import user from "../appwrite/accounts.js";
import Alert from "./Alert.jsx";



function WelcomeBack() {
    
    const navigate = useNavigate();

    const [currentUser, setCurrentUser] = useState({});

    const [emailInput, setEmailInput] = useState('');
    const [password, setPassword] = useState('');
    
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);

    const [passShow, setPassShow] = useState(false);

    function isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 

        return regex.test(email);
    }

    useEffect(() => {

        if(!passwordError) return;

        const timer = setTimeout(() =>{
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



    async function signIn() {

        // await user.logout()

        try {

            const userDetails = {
                email: emailInput.toLowerCase(),
                password: password
            }

            await user.login(userDetails);

            console.log(await user.get());

            const currentUser = await user.get();

            if (!currentUser.emailVerification) {

                if (!currentUser.emailVerificationRequested) {
                    await user.createVer("http://localhost:5173/verify");
                }

                alert("We can't log you in just yet, check your inbox for 'AppWrite' and Verify your email first");
                return;
            } 

            setEmailInput('');
            setPassword('');
            navigate("/home");            

        } catch(error) {

            console.log(error);
            alert("Login failed, please try again.")

        }
        
    }




    return createPortal(
        <form className="welcome-page">

            {/* <p>Welcome!</p> */}

            <div className="sign-inputs-cont">

                <div className="welcome-note">
                    <h1>Welcome Back!</h1>
                    <p>Sign In to access the app</p>    
                </div>                    

                <div className="sign-inputs-box">
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

        
                </div>
        
                <p className="cursor-pointer text-start mt-8 text-sm text-grey">Forgot password?</p>

                <button type="button" className="button" onClick={() => signIn()}>
                    Sign In
                </button>

                <p>
                    Don't have an account?{" "}

                    <Link to={"/"}>
                        <span className="text-tocolorb cursor-pointer">Sign Up</span>                       
                    </Link>    

                </p>
    
            </div>
        
            {/* <Alert/> */}
        </form>,
        document.getElementById("modal-root")
    );
}

export default WelcomeBack;