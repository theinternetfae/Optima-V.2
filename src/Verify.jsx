import { useEffect, useRef } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { createPortal } from "react-dom";

import user from "./appwrite/accounts";

function Verify() {
    const navigate = useNavigate();

    const hasVerified = useRef(false);

    useEffect(() => {

        console.log("Verify mounted");

        if(hasVerified.current) return;

        hasVerified.current = true;

        console.log("Verify effect running");
       
        
        const params = new URLSearchParams(window.location.search);
        const userId = params.get("userId");
        const secret = params.get("secret");

        console.log("UserId & Promise:", `${userId}-${secret}`);

        if (!userId || !secret) return;

        async function verifyEmail() {
            console.log("Calling updateEmailVerification");

            try {
                
                await user.updateVer(userId, secret);

                alert("Email verification successful!");
                console.log("Verified.")
                navigate('/home');
               

            } catch (err) {

                alert(
                    JSON.stringify({
                        code: err.code,
                        type: err.type,
                        message: err.message,
                    })
                )
                
            }
        }

        console.log("Verification returned");
        verifyEmail();

    }, []);

    return createPortal ( 
        <div className="verify">
            <h1>Verifying your email...</h1>
        </div>,
        document.getElementById("modal-root")
    );
}


export default Verify;