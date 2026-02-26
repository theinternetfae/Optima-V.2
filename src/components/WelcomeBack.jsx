import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import user from "../appwrite/accounts.js";
import { TaskContext } from "./TaskContext.js";
import Alert from "./Alert.jsx";


function WelcomeBack() {
    
    const navigate = useNavigate();
    const { authProfile } = useContext(TaskContext);

    const [emailInput, setEmailInput] = useState('');
    const [password, setPassword] = useState('');
    
    const [emailPassError, setEmailPassError] = useState(false);
    const [formError, setFormError] = useState('');

    const [passShow, setPassShow] = useState(false);

    function isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 

        return regex.test(email);
    }

    useEffect(() => {

        if(!emailPassError) return;

        const timer = setTimeout(() =>{
            setEmailPassError(prev => !prev);
        }, 3000)

        return () => clearTimeout(timer);
    }, [emailPassError]);



    async function signIn() {

        try {

            if (!emailInput || !password) {
                return;
            }

            const emailexists = emailInput !== '';

            if(emailexists && !isValidEmail(emailInput)) {
                setEmailPassError(prev => !prev);
                setFormError('Invalid Email.')
                setEmailInput('')
                return;
            }

            const userDetails = {
                email: emailInput.toLowerCase(),
                password: password
            }

            await user.login(userDetails);

            const currentUser = await user.get();

            if (!currentUser.emailVerification) {

                if (!currentUser.emailVerificationRequested) {
                    await user.createVer("http://localhost:5173/verify");
                }

                alert("We can't log you in just yet, check your inbox for 'AppWrite' and Verify your email first");
                return;
            } 

            authProfile();
            setEmailInput('');
            setPassword('');
            navigate("/home");            

        } catch(error) {

            console.log('ERROR:', error);
     
            if (error?.type === "user_invalid_credentials") {
                setEmailPassError(prev => !prev);
                setFormError('Your email or password is wrong')
                setEmailInput('');
                setPassword('');
            } 
            else {
                alert("Login failed. Try again.");
                setEmailInput('');
                setPassword('');
            }
     
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
                        {emailPassError && <p className="text-start text-sm text-fromcolorr mb-6">{formError}</p>}
                        <input type="email" placeholder="Email" value={emailInput} onChange={(e) => setEmailInput(e.target.value)}/>
                    </div>


                    <div className="flex flex-col">
                        <div className= 'flex justify-between items-center justify-end'>
                            <i className={`bi text-lg text-end pr-2 ${passShow ? 'bi-eye' : 'bi-eye-slash'}`} 
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