import { useMemo, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { SettingsContext, TaskContext } from "./components/TaskContext.js";

function SideMenu() {

    const location = useLocation();

    const { userData } = useContext(TaskContext);
    const { level } = useContext(SettingsContext);

    const setPath = useMemo(() => {
        if(location.pathname !== "/" && location.pathname !== "/taskStats" && location.pathname !== "/taskHistory" && location.pathname !== "/settings" && location.pathname !== "/home") return "/settings";

        return location.pathname;
    }, [location]);







    return ( 
        <nav className="side-menu">

            <div className="road-cont">

                <Link to="/home" className={`road ${setPath === "/home" && 'border-[var(--color-accentprimary)]'}`}>
                    <i className="bi-house-fill"></i>
                    <p>Home</p>
                </Link>

                <Link to="/taskStats" className={`road ${setPath === "/taskStats" && 'border-[var(--color-accentprimary)]'}`}>
                    <i className="bi-bar-chart-line"></i>
                    <p>Task Stats</p>
                </Link>

                <Link to="/taskHistory" className={`road ${setPath === "/taskHistory" && 'border-[var(--color-accentprimary)]'}`}>
                    <i className="bi-clock-history"></i>
                    <p>History</p>
                </Link>

                <Link to="/settings" className={`road ${setPath === "/settings" && 'border-[var(--color-accentprimary)]'}`}>
                    <i className="bi bi-gear"></i>
                    <p>Settings</p>
                </Link>

            </div>

            {userData.quirk && 
                <div className="progress-bar-cont" title=" Level One">
                    <div className="level-counter">1</div>
                    <div className="level">
                        <div className="level-loader">
                            <span className={`level-start ${level > 0 ? 'border-[var(--color-accentprimary)] bg-[var(--color-accentprimary)]' : ''}`}></span>
                            <span className={`${level >= 2  ? 'border-[var(--color-accentprimary)] bg-[var(--color-accentprimary)]' : ''}`}></span>
                            <span className={`level-end ${level === 3 ? 'border-[var(--color-accentprimary)] bg-[var(--color-accentprimary)]' : ''}`}></span>
                        </div>
                    </div>
                </div>
            }

        </nav>
    );
}

export default SideMenu;