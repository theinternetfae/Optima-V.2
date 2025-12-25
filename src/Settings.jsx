import { useState } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";

function Settings() {

    const location = useLocation();

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
            
            <h1 className="settings-header">Settings <span className="checking">{`${checking()}`}</span></h1>

            <p className="settings-subheader">Manage your account settings and preferences</p>

            <div className="settings-body">

                <aside className="settings-router">
                    
                    <Link to="profile" className={`sett-link ${location.pathname === "/settings/profile" && 'border-bluelight'}`}>
                        <p>Profile & Preferences</p>
                    </Link>

                    <Link to="taskHandler" className={`sett-link ${location.pathname === "/settings/taskHandler" && 'border-bluelight'}`}>
                        <p>Task Handler</p>
                    </Link>

                    <Link to="dataPrivacy" className={`sett-link ${location.pathname === "/settings/dataPrivacy" && 'border-bluelight'}`}>
                        <p>Data & Privacy</p>
                    </Link>

                    <Link to="about" className={`sett-link ${location.pathname === "/settings/about" && 'border-bluelight'}`}>
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