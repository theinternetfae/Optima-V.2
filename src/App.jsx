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
import Welcome from "./components/Welcome.jsx";
import WelcomeBack from "./components/WelcomeBack.jsx";
import Verify from "./Verify.jsx";
import user from "./appwrite/accounts.js";
import st from "./appwrite/storage.js"
import db from "./appwrite/databases.js";
import Loader from "./components/Loader.jsx";
import { Query, ID } from "appwrite";
import Offline from "./Offline.jsx";


function App() {

  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {

    const handleOnline = () => {
      setIsOnline(true);
      authProfile();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    }

  }, [isOnline]);

  const [currentUser, setCurrentUser] = useState(() => {
    return JSON.parse(localStorage.getItem("currentUser")) || null;
  });
  
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
    }
  }, [currentUser]);


  const [userData, setUserData] = useState(() => {
    return JSON.parse(localStorage.getItem("userData")) || null;
  });
  

  useEffect(() => {
    if (userData) {
      localStorage.setItem("userData", JSON.stringify(userData));
    } else {
      localStorage.removeItem("userData");
    }
  }, [userData]);


  const [taskList, setTaskList] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if(taskList) {
      localStorage.setItem("tasks", JSON.stringify(taskList));
    } else {
      localStorage.removeItem("taskList");
    }
  }, [taskList]);

  const [profileImage, setProfileImage] = useState(() => {
    const saved = localStorage.getItem("profileImage");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if(profileImage) {
      localStorage.setItem("profileImage", JSON.stringify(profileImage));
    } else {
      localStorage.removeItem("profileImage");
    }
  }, [profileImage]);

  const [loading, setLoading] = useState(true);

  
  async function authProfile() {

    try {
      setLoading(true);

      const userInfo = await user.get();
      setCurrentUser(userInfo);

      //USER-INFO
      try {

        const data = await db.profiles.get(userInfo.$id);
        setUserData(data)

        
      } catch (err) {
        if (err.code === 404) {

          const payload = {
            name: userInfo.name,
            email: userInfo.email,
            tasks: [],
            theme: "dark",
            accent: "blue",
            quirk: true,
            quote: false,
            streak: true,
            pfpId: null,
          };

          const newData = await db.profiles.create(payload, null, userInfo.$id);
          setUserData(newData);

        } else {

          console.log("Loading user data:", err);

        }
      }


      //TASK-LIST
      try {
        
        const tasks = await db.tasks.list([
          Query.equal("userId", userInfo.$id),
          Query.orderAsc("appearId")
        ]);

        setTaskList(tasks.documents);
      
      } catch (err) {

        setTaskList([]);
                
        console.log("Loading tasks list:", err);

      }

    } catch {
      setCurrentUser(null);
      setUserData(null);

    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    authProfile();
  }, []);


  useEffect(() => {
    console.log(userData);
  }, [userData])



























  //TASKDONE
  const [tasksDone, setTasksDone] = useState(() => {
    const savedTD = localStorage.getItem("tasksDone");
    return savedTD ? JSON.parse(savedTD) : [];
  });

  useEffect(() => {
      localStorage.setItem("tasksDone", JSON.stringify(tasksDone));
  }, [tasksDone]);


  const root = document.documentElement;

  useLayoutEffect(() => {

    if (!userData) return;

    if(userData.theme === 'light') {
        root.classList.add('light');
    } else {
        root.classList.remove('light');
    }

  }, [userData?.theme])

  
  

  useLayoutEffect(() => {

    if (!userData) return;

    root.classList.remove(
      'accent-purple',
      'accent-pink',
      'accent-green'
    );

    if (userData.accent === 'purple') root.classList.add('accent-purple');
    if (userData.accent === 'pink') root.classList.add('accent-pink');
    if (userData.accent === 'green') root.classList.add('accent-green');
  
  }, [userData?.accent]);




  


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

    if(!taskList) return;

    const todayKey = normalizeDate(new Date()); 
    const LAST_EVAL = localStorage.getItem('lastLevelEvaluation') || normalizeDate(yesterday);
    if (LAST_EVAL === todayKey) return;

    let counter = 0;

    const startDate = taskList.length > 0 && taskList[0].start;
  
    if(!startDate) return;

    const calculatedDays = generateDayRange(new Date(startDate), new Date(yesterday));

    for(let day of calculatedDays) {

      const taskToDay = taskList.filter(t => normalizeDate(t.appearId) === normalizeDate(day));
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


    setLevelCounter(counter);

    localStorage.setItem('lastLevelEvaluation', todayKey);
  }, [taskList, level]);


  useEffect(() => {
    if (level === 1 && levelCounter >= 7) setLevel(2);
    if (level === 2 && levelCounter >= 14) setLevel(3);
    if (level === 2 && levelCounter < 7) setLevel(1);
    if (level === 3 && levelCounter < 14) setLevel(2);
  }, [levelCounter]);


  // useEffect(() => {

  //   if (level === 1) {
  //     alert('You are now at level one. You can commit to two tasks in a day. Optima recommends committing to at least two tasks a day to get the ball rolling. Complete tasks consistently to level up!');
  //   }

  //   if(level === 2) {
  //     alert('You are now at level two. You can commit to four tasks in a day. Optima recommends committing to at least three tasks a day to keep the ball rolling. Complete tasks consistently to level up!');
  //   }

  //   if(level === 3) {  
  //     alert('You are now at level three, the max level! You can commit to six tasks in a day. At this stage, Optima recommends committing to at least four tasks a day and no more than six a day. Congratulations.');
  //   };
  
  // }, [level])












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

    const startAfter = fromDate ? new Date(fromDate) : new Date(baseTask.appearId);

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
          $id: ID.unique(),
          appearId: d.getTime(),
          isDone: false,
          isCommited: false,
          isPaused: false
        });

        d = new Date(d);
        d.setDate(d.getDate() + 7);
      }
    }

    future.sort((a, b) => a.appearId - b.appearId);

    return future;
  }  

  function calculateUpdates(prev, editedTask) {
    const editedDate = new Date(editedTask.appearId);

    const cleaned = prev.filter(t => 
      t.createdId !== editedTask.createdId ||
      new Date(t.appearId) < editedDate
    );

    const dbCleaned = prev.filter(t => 
      t.createdId === editedTask.createdId &&
      new Date(t.appearId) > editedDate
    )

    const updatedList = [...cleaned, editedTask];

    const series = updatedList.filter( t =>
      t.createdId === editedTask.createdId
    );

    const latest = series.reduce((a, b) => 
      new Date(a.appearId) > new Date(b.appearId) ? a : b
    );

    const future = generateFutureTasks(latest, new Date(latest.appearId));

    return {
      updatedList,
      future,
      dbCleaned
    }
  }

  async function  updateTasks(editedTask) {
    
    const current = taskList; 

    const { updatedList, future, dbCleaned } =
      calculateUpdates(current, editedTask);

    
    await Promise.all(
      dbCleaned.map(dc =>
        db.tasks.delete(dc.$id)
      )
    );


    await db.tasks.update(editedTask.$id, editedTask);

  
    await Promise.all(
      future.map(f =>
        db.tasks.create(f, null, f.$id)
      )
    );

    setTaskList([...updatedList, ...future]);
    
  }

  return (

    <TaskContext.Provider value={{taskList, setTaskList, profileImage, setProfileImage, tasksDone, setTasksDone, updateTasks, generateFutureTasks, userData, authProfile, setUserData}}>
      <SettingsContext.Provider value={{level, setLevel}}>

        <BrowserRouter>    

          { !isOnline ? (
              <Offline/>
            ): 
            (loading) ? (
              <Loader />
            ) : (
              <Routes>
                <Route element={<AppLayout />}>

                  <Route path="/verify" element={<Verify />}/>

                  <Route path="/" element={currentUser ? <Navigate to="/home" replace /> : <Welcome/>}/>
                  <Route path="/signin" element={currentUser ? <Navigate to="/home" replace /> : <WelcomeBack/>}/>
                  
                  <Route path="/home" element={currentUser ? <DateMenu /> : <Navigate to="/signin" replace />}/>
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
            )
          }

        </BrowserRouter>

      </SettingsContext.Provider>
    </TaskContext.Provider>

  )
}

export default App;