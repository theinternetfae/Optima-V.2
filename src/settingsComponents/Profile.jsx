import { useContext, useEffect, useState } from "react";
import { TaskContext } from "../components/TaskContext";
import { useNavigate } from "react-router-dom";
import user from "../appwrite/accounts.js";
import db from "../appwrite/databases.js";
import st from "../appwrite/storage.js";
import { ID } from "appwrite";
import Alert from "../components/Alert.jsx";
function Profile() {
    
    const navigate = useNavigate();
   
    const { authProfile, userData, setUserData, profileImage, setProfileImage } = useContext(TaskContext);

    const [alertShow, setAlertShow] = useState(false);

    async function handleImageChange(e) {

        const file = e.target.files[0];
        if (!file) return;

        const pfpId = ID.unique();
        const prevPfpId = userData.pfpId;

        const imageURL = URL.createObjectURL(file);
        setProfileImage(imageURL);


        try {

            if(userData.pfpId) {
        
                await st.pfp.delete(prevPfpId);
                console.log("Old pfp deleted!");

            }

            await st.pfp.create(pfpId, file);
            console.log("New pfp created!");

            await db.profiles.update(userData.$id, {pfpId});
            console.log("DB updated!");

            setUserData(prev => ({
                ...prev,
                pfpId
            }));

        } catch(err) {

            console.log("Pfp Upload:", err);
            setProfileImage(null);

        }
    }


    async function signOut() {

        await user.logout();
        setProfileImage(null);
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

    //Deleting the user data and account
    //tasks, pfp, userData, user

    async function deleteAccount() {
        
        try {
    
            // if(userData) {
            //     const tasks = await db.tasks.list([
            //         Query.equal("userId", userData.$id)
            //     ]);
        
            //     await Promise.all(
            //         tasks.documents.map(t => 
            //             db.tasks.delete(t.$id)
            //         )
            //     );
            
            //     if (userData.pfpId) {
            //         await st.pfp.delete(userData.pfpId);
            //         setProfileImage(null)
            //     }
            
            //     await db.profiles.delete(userData.$id); 
            // }

            // console.log("account object:", account);
            // console.log("methods:", Object.getOwnPropertyNames(Object.getPrototypeOf(account)));

            // console.log(currentUser);

            const userId = userData.$id;
            await user.delete(userId);

            // localStorage.clear();
            // navigate("/");
            
        } catch(err) {

            console.log("Deleting account:", err);
            return;

        }

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
                        <div className={`ball ease duration-800 ${userData?.quirk && "translate-x-33 lg:translate-x-43"}`}></div>
                    </div>

                </div>

                <div className="preference">
                    
                    <p>Daily quote</p>

                    {/* Set quote function for this already created above */}
                    {/*${userData?.quote && "bg-[var(--color-accentprimary)]"}*/}
                    {/*${userData?.quote && "translate-x-9 md:translate-x-43"}*/}
                    <div className="toggle" onClick={() => alert("Feature coming soon!")}>
                        <div className="ball ease duration-800"></div>
                    </div>

                </div>

                <div className="preference">
                    
                    <p>Streak</p>

                    <div className={`toggle ${userData?.streak && "bg-[var(--color-accentprimary)]"}`} onClick={() => setStreak()}>
                        <div className={`ball ease duration-800 ${userData?.streak && "translate-x-33 lg:translate-x-43"}`}></div>
                    </div>

                </div>
                
            </div>

            <div className="handle-session">

                <div className="session">

                    <p>Log out</p>

                    <button className="bi bi-person-walking logout" onClick={() => setAlertShow(prev => !prev)}></button>

                </div>

                <div className="session">

                    <p>Delete Account</p>

                    <button className="bi bi-person-x delacc" onClick={() => alert("Feature coming soon!")}></button>

                </div>

            </div>

            {alertShow && <Alert different={"Are you sure you want to logout?"} yesDelete={() => signOut()} noDelete={() => setAlertShow(prev => !prev)} popUp={false}/>}

        </div>
    );
}

export default Profile;