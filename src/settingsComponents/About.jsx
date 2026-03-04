import { useState } from "react";
import Message from "./Message.jsx";

function About() {

    const [toggleOne, setToggleOne] = useState(false);
    const [message, setMessage] = useState(false);


    const [copied, setCopied] = useState(false);

    function handleCopyLink() {
    navigator.clipboard.writeText(`${window.location.origin}/`)
        .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        });
    }


    return (
        <div className="sett-body">

            <div className="about-background">

                <section className="dropdown">
                    
                    <div className="toggle-dropdown" onClick={() => setToggleOne(prev => !prev)}>
                        <i className={toggleOne ? "bi bi-caret-down-fill" :"bi bi-caret-right-fill"}></i>
                        <span>What is Optima?</span>
                    </div>

                    {toggleOne && <p className="drop">Optima is a productivity app that analyzes task completion patterns to dynamically adapt its behavior. Its core feature, a self-evolving system, adjusts based on user consistency to encourage sustainable productivity rather than burnout.</p>}

                </section>

                <section className="controls">
                    <h2>More</h2>

                    <div className="controller-about">

                        <div>
                            <p>Contact Us</p>
                            <span>Send us a message</span>
                        </div>
                        <button
                            className="bi bi-envelope-fill btn-icon"
                            onClick={() => setMessage(prev => !prev)}
                        ></button>
                    
                    </div>

                    <div className="controller-about">
                        <div>
                            <p>Documentation</p>
                            <span>Behind the scenes</span>
                        </div>
                        <a
                            href="https://github.com/theinternetfae/Optima-V.2"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bi bi-github btn-icon"
                        ></a>
                    
                    </div>

                    <div className="controller-about">
                        <div>
                            <p>Share</p>
                            <span>Share to family and friends 🤞</span>
                        </div>
    
                        <button onClick={handleCopyLink} className="btn-icon">
                            {copied ? <i className="bi bi-check"></i> : <i className="bi bi-link-45deg"></i>}
                        </button>

                    </div>

                    <p className="version-info">© 2025 • Built with sweat & tears by Favour Egwele — v1.0</p>
                </section>

            </div>
            
            {message && <Message setMessage={setMessage}/>}
        </div>
    );
}

export default About;