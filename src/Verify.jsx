import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createPortal } from "react-dom";

import user from "./appwrite/accounts";

function Verify() {
    const navigate = useNavigate();

    const hasVerified = useRef(false);

    console.log("Window location:", window.location.href)
    
    useEffect(() => {

        if(hasVerified.current) return;

        hasVerified.current = true;

        console.log("Verify effect running");
       
        const params = new URLSearchParams(window.location.search);
        
        const userId = params.get("userId");
        const secret = params.get("secret");

        if (!userId || !secret) return;

        async function verifyEmail() {
            try {
                
                console.log("userId:", userId);
                console.log("secret:", secret);
                await user.updateVer(userId, secret);

                alert("Email verification successful!");
                navigate('/home');
               
            } catch (err) {
                console.log("Verification Error:", err)
                alert(
                    JSON.stringify({
                        code: err.code,
                        type: err.type,
                        message: err.message,
                    })
                )
            }
        }

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