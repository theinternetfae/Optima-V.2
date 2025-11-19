import { BrowserRouter, Routes, Route } from "react-router-dom";
import DateMenu from "./Date.jsx";
import SideMenu from "./SideMenu.jsx";
import TaskStats from "./TaskStats.jsx";
import { useState, useEffect } from "react";
import { TaskContext } from "./components/TaskContext.js";

function App() {

  const [taskList, setTaskList] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
      localStorage.setItem("tasks", JSON.stringify(taskList));
  }, [taskList]);

  const [tasksDone, setTasksDone] = useState(() => {
    const savedTD = localStorage.getItem("tasksDone");
    return savedTD ? JSON.parse(savedTD) : [];
  });

  useEffect(() => {
      localStorage.setItem("tasksDone", JSON.stringify(tasksDone));
  }, [tasksDone]);

  return (

    <TaskContext.Provider value={{taskList, setTaskList, tasksDone, setTasksDone}}>
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
    </TaskContext.Provider>
  )
}

export default App;