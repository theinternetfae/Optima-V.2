import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createPortal } from "react-dom";

import user from "./appwrite/accounts";

function Verify() {
    const navigate = useNavigate();

    useEffect(() => {
        // const hash = window.location.search;
        // const queryString = hash.split("?")[1];
        const params = new URLSearchParams(window.location.search);
        
        const userId = params.get("userId");
        const secret = params.get("secret");

        console.log("Params:", params.toString());
        console.log("userId:", userId);
        console.log("secret:", secret);
        
        if (!userId || !secret) return;

        async function verify() {
            try {
                await user.updateVer(userId, secret);
                alert("Email verification successful!");
                navigate("/home");
            } catch (err) {
                console.log(err)
                alert("Verification failed.");
            }
        }

        verify();

    }, []);

    return createPortal ( 
        <div className="verify">
            <h1>Verifying your email...</h1>
        </div>,
        document.getElementById("modal-root")
    );
}

export default Verify;