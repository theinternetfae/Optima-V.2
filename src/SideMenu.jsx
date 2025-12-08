import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

function SideMenu() {

    const location = useLocation();

    return ( 
        <nav className="side-menu">

            <Link to="/" className={`road ${location.pathname === "/" && 'border-bluelight'}`}>
                <i className="bi-house-fill"></i>
                <p>Home</p>
            </Link>

            <Link to="/taskStats" className={`road ${location.pathname === "/taskStats" && 'border-bluelight'}`}>
                <i className="bi-bar-chart-line"></i>
                <p>Task Stats</p>
            </Link>

            <Link to="/taskHistory" className={`road ${location.pathname === "/taskHistory" && 'border-bluelight'}`}>
                <i className="bi-clock-history"></i>
                <p>History</p>
            </Link>

        </nav>
    );
}

export default SideMenu;