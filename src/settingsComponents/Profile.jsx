import { useState } from "react";


function Profile() {
    
    const [profileImage, setProfileImage] = useState(null);
    const [quirkState, setQuirkState] = useState(true);
    const [quoteState, setQuoteState] = useState(false);

    function handleImageChange(e) {
        const file = e.target.files[0];
        if (!file) return;

        const imageURL = URL.createObjectURL(file);
        setProfileImage(imageURL);
    }

    return ( 
        <div className="sett-body">
        
            <div className="the-user">

                <label className="pfp-upload">
                    {profileImage ? (
                        <img src={profileImage} alt="your-pfp" className="pfp-image" />
                    ) : (
                        <span className="bi bi-plus pfp-plus"></span>
                    )}

                    <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleImageChange}
                        hidden
                    />
                </label>

                <div className="the-user-info">
                    
                    <div className="name-title">

                        <input type="text" placeholder="Name" className="the-user-name-title"/>

                        <input type="text" placeholder="Title i.e The inventor" className="the-user-name-title"/>

                    </div>
                    
                    <div className="the-user-bio">
                        <textarea name="" id="" placeholder="Who are you?"></textarea>
                    </div>

                </div>
                
                <div className="user-location">
                    <input type="text" placeholder="Location"/>
                    <input type="text" placeholder="Time-zone"/>
                </div>

            </div>

            <div className="user-preferences">
                <div className="preference">
                    
                    <p>Themes</p>

                    <div className="themes">
                        
                        <div className="theme-box one">
                            <div className="in-one"></div>
                        </div>

                        <div className="theme-box two">
                            <div className="in-two"></div>
                        </div>
                        
                        <div className="theme-box three">
                            <div className="in-three"></div>
                        </div>
                        
                        <div className="theme-box four">
                            <div className="in-four"></div>
                        </div>
                        
                    </div>

                </div>

                <div className="preference">
                    
                    <p>Optima Quirk</p>

                    <div className={`quirk-toggle ${quirkState && "bg-bluelight"}`} onClick={() => setQuirkState(prev => !prev)}>
                        <div className={`quirk-ball ease duration-800 ${quirkState && "translate-x-9 md:translate-x-43"}`}></div>
                    </div>

                </div>
                <div className="preference">
                    
                    <p>Daily quote</p>

                    <div className={`quote-toggle ${quoteState && "bg-bluelight"}`} onClick={() => setQuoteState(prev => !prev)}>
                        <div className={`quote-ball ease duration-800 ${quoteState && "translate-x-9 md:translate-x-43"}`}></div>
                    </div>

                </div>
            </div>

        </div>
    );
}

export default Profile;