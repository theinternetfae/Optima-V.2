import { BrowserRouter, Routes, Route } from "react-router-dom";
import DateMenu from "./Date.jsx";
import SideMenu from "./SideMenu.jsx";
import TaskStats from "./TaskStats.jsx";
import { useState, useEffect } from "react";
import { TaskContext } from "./components/TaskContext.js";

function App() {

  const [days, setDays] = useState([]);

    function getDaysAround(today, totalYears) {
        
        const result = [];
        const start = new Date(today);
        start.setFullYear(start.getFullYear() - 1);
        const totalDays = totalYears * 365;

        for (let i = 0; i < totalDays; i++) {
            result.push(new Date(start));
            start.setDate(start.getDate() + 1);
        }

        return result;
        
    }

    // Fix to make sure that past dates show up as needed instead of only loading 1 year back in case user has data past that
    // useEffect(() => {
    //     const earliestTask = Math.min(...taskList.map(t => new Date(t.baseId)));
    //     const latestTask = Math.max(...taskList.map(t => new Date(t.baseId)));

    //     if (earliestTask < days[0].getTime() || latestTask > days[days.length - 1].getTime()) {
    //         setDays(getDaysAround(today, 20));
    //     }
    // }, [taskList]);

    useEffect(() => {
        const today = new Date();
        setDays(getDaysAround(today, 20));
    }, []);
  

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

    <TaskContext.Provider value={{taskList, setTaskList, tasksDone, setTasksDone, days, setDays}}>
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