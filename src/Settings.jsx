import { useMemo, useContext } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { SettingsContext } from "./components/TaskContext.js";

function Settings() {

    const location = useLocation();
    const { theme, setTheme} = useContext(SettingsContext); 
    


    const larkMode = useMemo(() => {
        let larkMode = '';

        if(theme === 'light') {
            larkMode = true;
        } else {
            larkMode = false;
        }

        return larkMode;
    }, [theme])



    function settingTheme() {

        if(theme === 'dark') {
            setTheme('light');
        } else {
            setTheme('dark');
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

                <div className={`light-dark ${larkMode && 'bg-[var(--color-accentprimary)]'}`} onClick={() => {
                    settingTheme()
                }}>
                    <div className={`light-dark-ball transition ease duration-600 ${larkMode && 'translate-x-38'}`}> 
                        <i className={`${larkMode ? "bi bi-sun text-[var(--color-accentprimary)]" : "bi bi-moon text-black"} `}></i>
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