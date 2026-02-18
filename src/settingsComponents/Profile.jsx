import { useContext, useState } from "react";
import { SettingsContext, TaskContext } from "../components/TaskContext";
import { useNavigate } from "react-router-dom";
import user from "../appwrite/accounts.js";
import db from "../appwrite/databases.js";

function Profile() {
    
    const navigate = useNavigate();
    const [profileImage, setProfileImage] = useState(null);

    const { authProfile, userData, setUserData } = useContext(TaskContext);

    function handleImageChange(e) {
        const file = e.target.files[0];
        if (!file) return;

        const imageURL = URL.createObjectURL(file);
        setProfileImage(imageURL);
    }

    async function signOut() {

        await user.logout();
        authProfile();
        navigate("/");
        
    }

    async function changeAccent(color) {

        const accent = color;
        db.profiles.update(userData.$id, {accent});
        setUserData({...userData, accent});

    }

    async function setQuirk() {
        
        const quirk = !userData.quirk;
        db.profiles.update(userData.$id, {quirk});
        setUserData({...userData, quirk});
    
    }

    async function setQuote() {
        
        const quote = !userData.quote;
        db.profiles.update(userData.$id, {quote});
        setUserData({...userData, quote});
    
    }

    async function setStreak() {
        
        const streak = !userData.streak;
        db.profiles.update(userData.$id, {streak});
        setUserData({...userData, streak});

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
                    <p className="the-user-name-title">{userData?.name}</p>
                    <p className="the-user-name-title">{userData?.email}</p>
                </div>

            </div>

            <div className="user-preferences">
                <div className="preference">
                    
                    <p>Themes</p>

                    <div className="themes">
                        
                        <div className={`theme-box one ${userData?.accent === 'blue' ? 'border-[var(--color-accentprimary)]' : ''}`} onClick={() => changeAccent('blue')}>
                            <div className="in-one"></div>
                        </div>

                        <div className={`theme-box two ${userData?.accent === 'purple' ? 'border-[var(--color-accentprimary)]' : ''}`} onClick={() => changeAccent('purple')}>
                            <div className="in-two"></div>
                        </div>
                        
                        <div className={`theme-box three ${userData?.accent === 'pink' ? 'border-[var(--color-accentprimary)]' : ''}`} onClick={() => changeAccent('pink')}>
                            <div className="in-three"></div>
                        </div>
                        
                        <div className={`theme-box four ${userData?.accent === 'green' ? 'border-[var(--color-accentprimary)]' : ''}`} onClick={() => changeAccent('green')}>
                            <div className="in-four"></div>
                        </div>
                        
                    </div>

                </div>

                <div className="preference">
                    
                    <p>Optima Quirk</p>

                    <div className={`toggle ${userData?.quirk && "bg-[var(--color-accentprimary)]"}`} onClick={() => setQuirk()}>
                        <div className={`ball ease duration-800 ${userData?.quirk && "translate-x-9 md:translate-x-43"}`}></div>
                    </div>

                </div>

                <div className="preference">
                    
                    <p>Daily quote</p>

                    <div className={`toggle ${userData?.quote && "bg-[var(--color-accentprimary)]"}`} onClick={() => setQuote()}>
                        <div className={`ball ease duration-800 ${userData?.quote && "translate-x-9 md:translate-x-43"}`}></div>
                    </div>

                </div>

                <div className="preference">
                    
                    <p>Streak</p>

                    <div className={`toggle ${userData?.streak && "bg-[var(--color-accentprimary)]"}`} onClick={() => setStreak()}>
                        <div className={`ball ease duration-800 ${userData?.streak && "translate-x-9 md:translate-x-43"}`}></div>
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