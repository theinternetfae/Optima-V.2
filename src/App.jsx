import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DateMenu from "./Date.jsx";
import TaskHistory from "./TaskHistory.jsx";
import TaskStats from "./TaskStats.jsx";
import { useState, useEffect } from "react";
import { TaskContext, SettingsContext } from "./components/TaskContext.js";
import AppLayout from "./AppLayout.jsx";
import Settings from "./Settings.jsx";
import Profile from "./settingsComponents/Profile.jsx";
import TaskHandler from "./settingsComponents/TaskHandler.jsx";
import DataPrivacy from "./settingsComponents/DataPrivacy.jsx";
import About from "./settingsComponents/About.jsx";


function App() {

  //TASKLIST
  const [taskList, setTaskList] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
      localStorage.setItem("tasks", JSON.stringify(taskList));
  }, [taskList]);

  //TASKDONE
  const [tasksDone, setTasksDone] = useState(() => {
    const savedTD = localStorage.getItem("tasksDone");
    return savedTD ? JSON.parse(savedTD) : [];
  });

  useEffect(() => {
      localStorage.setItem("tasksDone", JSON.stringify(tasksDone));
  }, [tasksDone]);

  //TASKS COMMITED

  //THEMES
  const [theme, setTheme] = useState(() => {
      const savedTheme = localStorage.getItem('theme'); 
      return savedTheme ? savedTheme : 'dark';
  });

  useEffect(() => {
      localStorage.setItem('theme', theme);
  }, [theme]);


  const root = document.documentElement;

  useEffect(() => {

    if(theme === 'light') {
        root.classList.add('light');
    } else {
        root.classList.remove('light');
    }

  }, [theme])

  
  
  //ACCENTS
  const [accent, setAccent] = useState(() => {
    const savedAccent = localStorage.getItem("accent");
    return savedAccent ? savedAccent : 'blue';
  });
  
  useEffect(() => {
    localStorage.setItem("accent", accent);
  })

  useEffect(() => {

    if(accent === 'blue') {
    
      root.classList.remove('accent-purple');
      root.classList.remove('accent-pink');
      root.classList.remove('accent-green');    
    
    } else if (accent === 'red') {
// CHECKING
      root.classList.add('accent-purple');

      root.classList.remove('accent-pink');
      root.classList.remove('accent-green');

    } else if (accent === 'pink') {

      root.classList.add('accent-pink');

      root.classList.remove('accent-purple');
      root.classList.remove('accent-green');

    } else {

      root.classList.add('accent-green');
      
      root.classList.remove('accent-pink');
      root.classList.remove('accent-purple');

    }

  }, [accent])


  //LEVEL
  const [optimaQuirk, setOptimaQuirk] = useState(true);
  const [level, setLevel] = useState(1);


  //STREAK
  const [streakState, setStreakState] = useState(true);


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
          isDone: false
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
      <SettingsContext.Provider value={{theme, setTheme, accent, setAccent, level, setLevel, optimaQuirk, setOptimaQuirk, streakState, setStreakState}}>

        <BrowserRouter>    

          <Routes>

            <Route element={<AppLayout />}>
            
              <Route path="/" element={<DateMenu />} />
              <Route path="/taskStats" element={<TaskStats />} />
              <Route path="/taskHistory" element={<TaskHistory />} />

              <Route path="settings" element={<Settings />}>
                <Route index element={<Navigate to="profile" replace />} />
                <Route path="profile" element={<Profile />} />
                <Route path="taskHandler" element={<TaskHandler />} />
                <Route path="dataPrivacy" element={<DataPrivacy />} />
                <Route path="about" element={<About />} />
              </Route>

            </Route>

          </Routes>
          
        </BrowserRouter>

      </SettingsContext.Provider>
    </TaskContext.Provider>

  )
}

export default App;