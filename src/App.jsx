import { BrowserRouter, Routes, Route } from "react-router-dom";
import DateMenu from "./Date.jsx";
import SideMenu from "./SideMenu.jsx";
import TaskHistory from "./TaskHistory.jsx";
import TaskStats from "./TaskStats.jsx";
import { useState, useEffect } from "react";
import { TaskContext } from "./components/TaskContext.js";

function App() {

  //LOCAL STORAGE
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


  //REPEATING TASKS LOGIC
  const weekDaysMap = [ "sun", "mon", "tue", "wed", "thu", "fri", "sat"];

  function normalizeDayKey(str) {
    return String(str || "").trim().toLowerCase().slice(0, 3);
  }

  function getFirstOnOrAfter(startDate, targetWeekday) {
    const d = new Date(startDate);

    d.setHours(0,0,0,0);
    const offset = (targetWeekday - d.getDay() + 7) % 7;
    d.setDate(d.getDate() + offset);
    return d;
  }

  function generateFutureTasks(baseTask, fromDate = null) {
    if (!baseTask || !Array.isArray(baseTask.days) || baseTask.days.length === 0) return [];

    const startBoundary = new Date(baseTask.start);
    const endBoundary = new Date(baseTask.end);

    const startAfter = fromDate ? new Date(fromDate) : new Date(baseTask.id);

    startAfter.setDate(startAfter.getDate() + 1);
    startAfter.setHours(0, 0, 0, 0);

    const generationStart = startAfter > startBoundary ? startAfter : new Date(startBoundary);

    const future = [];

    const weekDayIndexes = baseTask.days
    .map(d => normalizeDayKey(d))
    .map(k => weekDaysMap.indexOf(k))
    .filter(i => i >= 0);

    for (const weekDayIdx of weekDayIndexes) {
      
      let d = getFirstOnOrAfter(generationStart, weekDayIdx);
      
      while (d <= endBoundary) {
        future.push({
          ...baseTask,
          keyUUID: crypto.randomUUID(),
          id: d.getTime(),
        });

        d = new Date(d);
        d.setDate(d.getDate() + 7);
      }
    }

    future.sort((a, b) => a.id - b.id);

    return future;
  }
  

  function updateTasks(editedTask) {
    setTaskList(prev => {
      const editedDate = new Date(editedTask.id)
    
      const cleaned = prev.filter(t => t.baseId !== editedTask.baseId || new Date(t.id) < editedDate);

      return [...cleaned, editedTask];
    });
  }

  function regenerateRepeats(baseId) {
    setTaskList(prev => {

      const series = prev.filter(t => t.baseId === baseId);

      if(series.length === 0) return prev;

      const latest = series.reduce((a,b) => (new Date(a.id) > new Date(b.id) ? a : b), series[0]);

      const future = generateFutureTasks(latest, new Date(latest.id));

      if (future.length === 0) return prev;

      const existingIds = new Set(prev.map(t => t.keyUUID));
      const filteredFuture = future.filter(f => !existingIds.has(f.keyUUID));

      return [...prev, ...filteredFuture];

    });
  }

  function saveEditedTask(editedTask) {
    updateTasks(editedTask);

    regenerateRepeats(editedTask.baseId);
  }

  return (

    <TaskContext.Provider value={{taskList, setTaskList, tasksDone, setTasksDone, saveEditedTask}}>
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

            <Route path="/taskHistory" element={
              <div className="a-body">
                <TaskHistory />
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