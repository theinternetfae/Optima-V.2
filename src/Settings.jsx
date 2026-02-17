import { useContext } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { TaskContext } from "./components/TaskContext.js";
import db from "./appwrite/databases.js";

function Settings() {

    const location = useLocation();
    const { userData, setUserData} = useContext(TaskContext); 


    function settingTheme() {

        if(userData.theme === 'dark') {

            const theme = 'light';
            db.profiles.update(userData.$id, {theme})
            setUserData({...userData, theme});

        } else {

            const theme = 'dark';
            db.profiles.update(userData.$id, {theme})
            setUserData({...userData, theme});

        }
    
    }

    
    function checking() {
        if(location.pathname === '/settings/profile') {
            return "> Profile & Preferences"
        } else if(location.pathname === '/settings/taskHandler') {
            return "> Task Handler"
        } else if(location.pathname === '/settings/dataPrivacy') {
            return "> Data & Privacy"
        } else {
            return "> About"
        }
     }

    return ( 
        <div className="settings-main-cont">
            
            <div className="settings-info-box">

                <div className="settings-info">
    
                    <h1 className="settings-header">Settings <span className="checking">{`${checking()}`}</span></h1>

                    <p className="settings-subheader">Manage your account settings and preferences</p>

                </div>

                <div className="light-dark 'bg-[var(--color-accentprimary)]'}" onClick={() => {
                    settingTheme();
                }}>
                    <div className={`light-dark-ball transition ease duration-600 ${userData.theme === "light" && 'translate-x-38'}`}> 
                        <i className={`${userData.theme === "light" ? "bi bi-sun text-[var(--color-accentprimary)]" : "bi bi-moon text-black"} `}></i>
                    </div>
                </div>

            </div>

            <div className="settings-body">

                <aside className="settings-router">
                    
                    <Link to="profile" className={`sett-link ${location.pathname === "/settings/profile" && 'border-[var(--color-accentprimary)]'}`}>
                        <p>Profile & Preferences</p>
                    </Link>

                    <Link to="taskHandler" className={`sett-link ${location.pathname === "/settings/taskHandler" && 'border-[var(--color-accentprimary)]'}`}>
                        <p>Task Handler</p>
                    </Link>

                    <Link to="dataPrivacy" className={`sett-link ${location.pathname === "/settings/dataPrivacy" && 'border-[var(--color-accentprimary)]'}`}>
                        <p>Data & Privacy</p>
                    </Link>

                    <Link to="about" className={`sett-link ${location.pathname === "/settings/about" && 'border-[var(--color-accentprimary)]'}`}>
                        <p>About</p>
                    </Link>

                </aside>

                <main>
                    <Outlet />
                </main>

            </div>

        </div>
    );
}

export default Settings;