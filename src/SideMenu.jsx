import { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";

function SideMenu() {

    const location = useLocation();

    const setPath = useMemo(() => {
        if(location.pathname !== "/" && location.pathname !== "/taskStats" && location.pathname !== "/taskHistory" && location.pathname !== "/settings") return "/settings";

        return location.pathname;
    }, [location]);







    return ( 
        <nav className="side-menu">

            <Link to="/" className={`road ${setPath === "/" && 'border-accentlight'}`}>
                <i className="bi-house-fill"></i>
                <p>Home</p>
            </Link>

            <Link to="/taskStats" className={`road ${setPath === "/taskStats" && 'border-accentlight'}`}>
                <i className="bi-bar-chart-line"></i>
                <p>Task Stats</p>
            </Link>

            <Link to="/taskHistory" className={`road ${setPath === "/taskHistory" && 'border-accentlight'}`}>
                <i className="bi-clock-history"></i>
                <p>History</p>
            </Link>

            <Link to="/settings" className={`road ${setPath === "/settings" && 'border-accentlight'}`}>
                <i className="bi bi-gear"></i>
                <p>Settings</p>
            </Link>

            <div className="color-test"></div>
        </nav>
    );
}

export default SideMenu;