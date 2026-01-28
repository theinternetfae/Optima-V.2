import { createPortal } from "react-dom";
import { Link, useLocation } from "react-router-dom";

function Welcome() {
    return createPortal( 
        <div className="welcome-page">

            {/* <p>Welcome!</p> */}

            <div className="sign">
                <img src="/Optima-banner-cropped.png" alt="" />
                <div className="sign-inputs-cont">
                    <div className="sign-inputs-box">
                        <input type="text" placeholder="First Name"/>
                        <input type="text" placeholder="Last Name"/>
                        <input type="text" placeholder="Email"/>
                        <input type="text" placeholder="Password"/>
                        <input type="text" placeholder="Confirm Password"/>
                    </div>
                    <Link to="/home" className="button" onClick={() => console.log('Yes you can!')}>
                        Sign up
                    </Link>
                    <p>Already have an account? Sign in</p>
                </div>
            </div>

        </div>,
        document.getElementById("modal-root")
    );
}

export default Welcome;