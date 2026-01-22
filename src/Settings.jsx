import { useState } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";

function Settings() {

    const location = useLocation();

    const [larkMode, setLarkMode] = useState(false)

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

                <div className={`light-dark ${larkMode && 'bg-accentlight'}`} onClick={() => setLarkMode(prev => !prev)}>
                    <div className={`light-dark-ball transition ease duration-600 ${larkMode && 'translate-x-38'}`}> 
                        <i className={`${larkMode ? "bi bi-sun text-yellow" : "bi bi-moon text-grey"} `}></i>
                    </div>
                </div>

            </div>

            <div className="settings-body">

                <aside className="settings-router">
                    
                    <Link to="profile" className={`sett-link ${location.pathname === "/settings/profile" && 'border-accentlight'}`}>
                        <p>Profile & Preferences</p>
                    </Link>

                    <Link to="taskHandler" className={`sett-link ${location.pathname === "/settings/taskHandler" && 'border-accentlight'}`}>
                        <p>Task Handler</p>
                    </Link>

                    <Link to="dataPrivacy" className={`sett-link ${location.pathname === "/settings/dataPrivacy" && 'border-accentlight'}`}>
                        <p>Data & Privacy</p>
                    </Link>

                    <Link to="about" className={`sett-link ${location.pathname === "/settings/about" && 'border-accentlight'}`}>
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