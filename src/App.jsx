import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DateMenu from "./Date.jsx";
import SideMenu from "./SideMenu.jsx";
import TaskStats from "./TaskStats.jsx";

function App() {
  return (
    <BrowserRouter>    
      <div className="named">
        <SideMenu/>

        <Routes>

          <Route path="/" element={
              <div className="a-body">
                <DateMenu />
              </div>
            }
          />

          <Route path="/taskStats" element={
              <div className="a-body">
                <TaskStats />
              </div>
            }
          />

        </Routes>
      
      </div>
    </BrowserRouter>
  )
}

export default App;