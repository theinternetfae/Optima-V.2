import { useEffect } from "react";
import { account } from "./appwrite/config";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createPortal } from "react-dom";

function Verify() {
    const [params] = useSearchParams();
    const navigate = useNavigate();
;
    useEffect(() => {
        const userId = params.get("userId");
        const secret = params.get("secret");

        if (!userId || !secret) return;

        async function verify() {
            try {
                await account.updateEmailVerification(userId, secret);
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