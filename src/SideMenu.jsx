import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

function SideMenu() {

    const location = useLocation();

    return ( 
        <nav className="side-menu">

            <Link to="/" className={`road ${location.pathname === "/" && 'border-bluelight'}`} onClick={() => handleActive('div1')}>
                <i className="bi-house-fill"></i>
                <p>Home</p>
            </Link>

            <Link to="/taskStats" className={`road ${location.pathname === "/taskStats" && 'border-bluelight'}`} onClick={() => handleActive('div2')}>
                <i className="bi-bar-chart-line"></i>
                <p>Task Stats</p>
            </Link>

        </nav>
    );
}

export default SideMenu;