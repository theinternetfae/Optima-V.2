import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DateMenu from "./Date.jsx";
import TaskHistory from "./TaskHistory.jsx";
import TaskStats from "./TaskStats.jsx";
import { useState, useEffect, useLayoutEffect } from "react";
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

  const root = document.documentElement;

  //THEMES
  const [theme, setTheme] = useState(() => {
      const savedTheme = localStorage.getItem('theme'); 
      return savedTheme ? savedTheme : 'dark';
  });

  useEffect(() => {
      localStorage.setItem('theme', theme);
  }, [theme]);



  useLayoutEffect(() => {

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
  }, [accent]);

  useLayoutEffect(() => {
    root.classList.remove(
      'accent-purple',
      'accent-pink',
      'accent-green'
    );

    if (accent === 'red') root.classList.add('accent-purple');
    if (accent === 'pink') root.classList.add('accent-pink');
    if (accent === 'green') root.classList.add('accent-green');
  }, [accent]);




  


  //LEVEL
  const [level, setLevel] = useState(() => {
    const savedLevel = localStorage.getItem("level");
    return savedLevel ? JSON.parse(savedLevel) : 1;
  });

  useEffect(() => {
    localStorage.setItem("level", JSON.stringify(level));
  }, [level])
























  //LEVEL CALCULATIONS

  function addDays(date, days) {
    return new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate() + days
    );
  }

  function generateDayRange(startDate, endDate) {
    if (!startDate || ! endDate) return;

    const days = [];
    const start = new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate()
    );
    const end = new Date(
      endDate.getFullYear(),
      endDate.getMonth(),
      endDate.getDate()
    );

    for (let d = start; d <= end; d = addDays(d, 1)) {
      days.push(d);
    }

    return days;
  }

  const [levelCounter, setLevelCounter] = useState(0);

  function normalizeDate(d) {
    const newDate = new Date(d)
    return new Date(
      newDate.getFullYear(),
      newDate.getMonth(),
      newDate.getDate()
    )
  };

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);


  useEffect(() => {
    const todayKey = normalizeDate(new Date()); 
    const LAST_EVAL = localStorage.getItem('lastLevelEvaluation') || normalizeDate(yesterday);
    console.log(LAST_EVAL);
    if (LAST_EVAL === todayKey) return;

    let counter = 0;

    const startDate = taskList.length > 0 && taskList[0].start;
  
    if(!startDate) return;

    const calculatedDays = generateDayRange(new Date(startDate), new Date(yesterday));

    for(let day of calculatedDays) {

      const taskToDay = taskList.filter(t => normalizeDate(t.id) === normalizeDate(day));
      console.log(taskToDay);
      const taskExists = taskToDay.length > 0;
      const moreThanOne =  taskToDay.filter(t => t.isCommited).length > 1;
      const requiredDone = level === 1 ? 2 : level === 2 ? 3 : 4;
      const isDoneCommited = taskToDay.filter(t => t.isCommited && t.isDone).length >= requiredDone;

      if(moreThanOne && isDoneCommited && taskExists){
        counter = Math.min(14, counter + 1);
      } else if (taskExists && moreThanOne && !isDoneCommited) {
        counter = Math.max(0, counter - 1);
      }
    }

    console.log(counter);

    setLevelCounter(counter);

    localStorage.setItem('lastLevelEvaluation', todayKey);
  }, [taskList, level]);

  useEffect(() => {
    console.log(levelCounter);
  }, [levelCounter])


  useEffect(() => {
    if (level === 1 && levelCounter >= 7) setLevel(2);
    if (level === 2 && levelCounter >= 14) setLevel(3);
    if (level === 2 && levelCounter < 7) setLevel(1);
    if (level === 3 && levelCounter < 14) setLevel(2);
  }, [levelCounter]);


  useEffect(() => {

    if (level === 1) {
      alert('You are now at level one. You can commit to two tasks in a day. Optima recommends committing to at least two tasks a day to get the ball rolling. Complete tasks consistently to level up!');
    }

    if(level === 2) {
      alert('You are now at level two. You can commit to four tasks in a day. Optima recommends committing to at least three tasks a day to keep the ball rolling. Complete tasks consistently to level up!');
    }

    if(level === 3) {  
      alert('You are now at level three, the max level! You can commit to six tasks in a day. At this stage, Optima recommends committing to at least four tasks a day and no more than six a day. Congratulations.');
    };
  
  }, [level])














  //OPTIONAL QUIRKS

  const [optimaQuirk, setOptimaQuirk] = useState(() => {
    const savedQuirk = localStorage.getItem("optimaQuirk");
    return savedQuirk ? JSON.parse(savedQuirk) : true;
  });

  useEffect(() => {
    localStorage.setItem("optimaQuirk", JSON.stringify(optimaQuirk));
  }, [optimaQuirk])


  const [streakState, setStreakState] = useState(() => {
    const savedStreakState = localStorage.getItem("streakState");
    return savedStreakState ? JSON.parse(savedStreakState) : true;
  });

  useEffect(() => {
    localStorage.setItem("streakState", JSON.stringify(streakState));
  }, [streakState])

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