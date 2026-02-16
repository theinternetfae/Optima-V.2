import { useContext, useState } from "react";
import { SettingsContext, TaskContext } from "../components/TaskContext";
import { useNavigate } from "react-router-dom";
import user from "../appwrite/accounts.js";
import db from "../appwrite/databases.js";

function Profile() {
    
    const navigate = useNavigate();
    const [profileImage, setProfileImage] = useState(null);
    const [quoteState, setQuoteState] = useState(false);

    const {optimaQuirk, setOptimaQuirk, streakState, setStreakState} = useContext(SettingsContext);
    const {setLoading, setCurrentUser, userData, setuserData } = useContext(TaskContext)

    function handleImageChange(e) {
        const file = e.target.files[0];
        if (!file) return;

        const imageURL = URL.createObjectURL(file);
        setProfileImage(imageURL);
    }

    async function signOut() {

        setCurrentUser(null);
        await user.logout();

        navigate("/");
        
        // try {
        //     setLoading(true)
        //     setCurrentUser(null);
        //     await user.logout();
        //     setuserData({});
        //     navigate("/");
        // } catch(err) {
            
        //     console.log(error);

        // } finally {

        //     setLoading(false);
        
        // }
    }

    async function changeAccent(color) {

        const accent = color;
        db.profiles.update(userData.$id, {accent})
        setuserData({...userData, accent})

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
                    <p className="the-user-name-title">Jane Doe</p>
                    <p className="the-user-name-title">janedoe@gmail.com</p>
                </div>

            </div>

            <div className="user-preferences">
                <div className="preference">
                    
                    <p>Themes</p>

                    <div className="themes">
                        
                        <div className={`theme-box one ${userData.accent === 'blue' ? 'border-[var(--color-accentprimary)]' : ''}`} onClick={() => changeAccent('blue')}>
                            <div className="in-one"></div>
                        </div>

                        <div className={`theme-box two ${userData.accent === 'purple' ? 'border-[var(--color-accentprimary)]' : ''}`} onClick={() => changeAccent('purple')}>
                            <div className="in-two"></div>
                        </div>
                        
                        <div className={`theme-box three ${userData.accent === 'pink' ? 'border-[var(--color-accentprimary)]' : ''}`} onClick={() => changeAccent('pink')}>
                            <div className="in-three"></div>
                        </div>
                        
                        <div className={`theme-box four ${userData.accent === 'green' ? 'border-[var(--color-accentprimary)]' : ''}`} onClick={() => changeAccent('green')}>
                            <div className="in-four"></div>
                        </div>
                        
                    </div>

                </div>

                <div className="preference">
                    
                    <p>Optima Quirk</p>

                    <div className={`toggle ${optimaQuirk && "bg-[var(--color-accentprimary)]"}`} onClick={() => setOptimaQuirk(prev => !prev)}>
                        <div className={`ball ease duration-800 ${optimaQuirk && "translate-x-9 md:translate-x-43"}`}></div>
                    </div>

                </div>

                <div className="preference">
                    
                    <p>Daily quote</p>

                    <div className={`toggle ${quoteState && "bg-[var(--color-accentprimary)]"}`} onClick={() => setQuoteState(prev => !prev)}>
                        <div className={`ball ease duration-800 ${quoteState && "translate-x-9 md:translate-x-43"}`}></div>
                    </div>

                </div>

                <div className="preference">
                    
                    <p>Streak</p>

                    <div className={`toggle ${streakState && "bg-[var(--color-accentprimary)]"}`} onClick={() => setStreakState(prev => !prev)}>
                        <div className={`ball ease duration-800 ${streakState && "translate-x-9 md:translate-x-43"}`}></div>
                    </div>

                </div>

                <button className="logout" onClick={() => signOut()}>
                    Log out
                </button>

                <button className="delacc">
                    Delete account
                </button>

            </div>

        </div>
    );
}

export default Profile;