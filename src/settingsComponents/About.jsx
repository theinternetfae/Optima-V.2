import { useState } from "react";

function About() {



    const [toggleOne, setToggleOne] = useState(false);
    const [toggleTwo, setToggleTwo] = useState(false);

    const [contactOne, setContactOne] = useState(false);
    const [contactTwo, setContactTwo] = useState(false);

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

                    {toggleOne && <p>Optima is a productivity app that analyzes task completion patterns to dynamically adapt its behavior. Its core feature, a self-evolving system, adjusts based on user consistency to encourage sustainable productivity rather than burnout.</p>}

                </section>

                <section className="dropdown">
                    <div className="toggle-dropdown" onClick={() => setToggleTwo(prev => !prev)}>
                        <i className={toggleTwo ? "bi bi-caret-down-fill" :"bi bi-caret-right-fill"}></i>
                        <span>Contact us</span>
                    </div>
                    
                    {toggleTwo && 
                    
                        <div className="contact-us">
                            <div className="toggle-dropdown" onClick={() => setContactOne(prev => !prev)}>
                                <i className={contactOne ? "bi bi-caret-down-fill" :"bi bi-caret-right-fill"}></i>
                                <span>Feature suggestion</span>
                            </div>

                            {contactOne && <div className="contacting-box">
                                <textarea name="" id="" placeholder="What suggestion?"></textarea>
                                <button>Submit</button>
                            </div>}

                            <div className="toggle-dropdown" onClick={() => setContactTwo(prev => !prev)}>
                                <i className={contactTwo ? "bi bi-caret-down-fill" :"bi bi-caret-right-fill"}></i>
                                <span>Report a bug</span>
                            </div>    

                            {contactTwo && <div className="contacting-box">
                                <textarea name="" id="" placeholder="What bug?"></textarea>
                                <button>Submit</button>
                            </div>}
                        </div>
                    
                    }

                </section>

                <section className="controls">
                    <h2>More</h2>

                    <div className="controller-about">
                        <div>
                            <p>Documentation</p>
                            <span>See the behind the scenes build of the app</span>
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
                            <span>Share Optima to your family and friends! Appreciate you 🤞</span>
                        </div>
    
                        <button onClick={handleCopyLink} className="btn-icon">
                            {copied ? <i className="bi bi-check"></i> : <i className="bi bi-link-45deg"></i>}
                        </button>

                    </div>
                </section>

                <section className="version-info">
                    <p>© 2025 • Built with sweat & tears by Favour Egwele — v1.0</p>
                </section>

            </div>
            
        </div>
    );
}

export default About;