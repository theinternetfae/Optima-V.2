import { Outlet } from "react-router-dom";
import SideMenu from "./SideMenu.jsx";


function AppLayout() {
    return ( 
    
        <div className="named">
            <SideMenu />

            <div className="a-body">
                <Outlet/>
            </div>

        </div> 

    );
}

export default AppLayout;