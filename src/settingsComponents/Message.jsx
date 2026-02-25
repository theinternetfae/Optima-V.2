import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import db from "../appwrite/databases";
import { ID } from "appwrite";

function Message({setMessage}) {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [sendMessage, setSendMessage] = useState('');

    const [errorMessage, setErrorMessage] = useState(false);

    function isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 

        return regex.test(email);
    }


    async function sendToMe(e) {

        if(!name || !email || !sendMessage) {
            setErrorMessage(prev => !prev);
            return;
        }

        e.preventDefault();


        if(!isValidEmail(email)) {
            setErrorMessage(prev => !prev);
            setEmail('')
            return;
        }

        const payload = {
            name,
            email,
            sendMessage
        }

        db.messages.create(payload).catch(err => console.log("Sending message:", err));
        alert("Message sent! I'll get back to you");
        setName('');
        setEmail('');
        setSendMessage('');
        setMessage(prev => !prev);
    }

    useEffect(() => {

        if(!errorMessage) return;

        const clearError = setTimeout(() => {
            setErrorMessage(prev => !prev);
        }, 3000);

        return () => clearTimeout(clearError);

    }, [errorMessage])


    return createPortal( 
        <div className="message">

            <i className="bi bi-x-circle-fill cursor-pointer exit-mess"
                onClick={() => setMessage(prev => !prev)}
            ></i>


            <div className="message-box">

                <div className="message-intro">
                    <h1>Hello!</h1>
                    <p>Send me a message and I'll get back to you as soon as possible.</p>
                </div>

                <div className="idle-wrapper">

                    {errorMessage && <p className="error">Please fill out all fields properly...</p>}

                    <input type="text" placeholder="Jane Doe" value={name} onChange={(e) => setName(e.target.value)}/>
                
                </div>

                <input type="text" placeholder="janedoe@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)}/>
                
                <textarea placeholder="I'm contacting you because..." value={sendMessage} onChange={(e) => setSendMessage(e.target.value)}/>

                <button className="bi bi-envelope-fill btn-icon" onClick={e => sendToMe(e)}></button>

            </div>

        </div>, 
        document.getElementById("modal-root")
    );
}

export default Message;