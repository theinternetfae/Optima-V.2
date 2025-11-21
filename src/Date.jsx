import { useEffect, useState, useRef} from "react";
import NewTask from "./components/NewTask.jsx";
import TaskDisplay from "./components/TaskDisplay.jsx";
import React, {useContext} from "react";
import { TaskContext } from "./components/TaskContext.js";


function DateMenu() {
    const { taskList, setTaskList } = useContext(TaskContext); 
    const [days, setDays] = useState([]);
    const containerRef = useRef(null);
    const todayRef = useRef(null);

    const [newTaskDisplay, setNewTaskDisplay] = useState(false);
    
    const today = new Date();
    const [navDate, setNavDate] = useState(today.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" }));

    function getWeekdayName(date) {
     const days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
     return days[new Date(date).getDay()];
    }

    useEffect(() => {
        
        const repeatTasks = taskList.filter(task => task.days.length > 0);

        days.forEach(day => {
            repeatTasks.forEach(rt => {
                const theDate = new Date(day);
                const startDate = new Date(rt.start);
                const endDate = new Date(rt.end);

                if(theDate >= startDate && theDate <= endDate) {
                    
                    if (rt.days.some(d => d.toLowerCase() === getWeekdayName(day).toLowerCase())) {

                        const alreadyExists = taskList.some(
                            t =>
                            t.name === rt.name &&
                            new Date(t.id).toDateString() === theDate.toDateString()
                        );                    
            
                        if (alreadyExists) return;

                        const repeat = {
                            ...rt,
                            id: theDate.getTime() 
                        }                    
                    
                        setTaskList (prev => [...prev, repeat]);

                    } 

                }

            })

        })


    }, [days, taskList]);

    //Check for duplicates and make sure it's not created again if it already exists, use either the id or copyid and the name

    const [beforeTaskShow, setbeforeTaskShow] = useState([]);
    const [taskShow, setTaskShow] = useState([]);
    const [taskFilter, setTaskFilter] = useState('all');

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

    function openCloseNewTaskSetter() {
        setNewTaskDisplay(!newTaskDisplay);
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

    useEffect(() => {
        if (todayRef.current && containerRef.current) {
            todayRef.current.scrollIntoView({
                behavior: "auto",
                inline: "center",
                block: "nearest",
            });
        }
    }, [days]);

    function toggleTodayDisplay() {
        if (todayRef.current && containerRef.current) {
            todayRef.current.scrollIntoView({
                behavior: "auto",
                inline: "center",
                block: "nearest",
            });
        }
    }

    const [activeDate, setActiveDate] = useState(new Date());
    const [border, setBorder] = useState(new Date().toDateString());

    useEffect(() => {
        console.log('the tasklistttttt', taskList);
    }, [activeDate])

    function redirectDateTask() {
        setActiveDate(new Date());
        setBorder(new Date().toDateString());
        setNavDate(today.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" }));
    }

    useEffect(() => {
        
        if (taskList.length === 0) {
            setbeforeTaskShow([]); 
            return;
        }

        const activeDateString = activeDate.toLocaleDateString("en-US", { 
            day: "numeric", 
            month: "long", 
            year: "numeric" 
        });

        const todayTasks = taskList.filter(task => {
            const taskDate = new Date(task.id).toLocaleDateString("en-us", {
                day: "numeric", 
                month: "long", 
                year: "numeric"
            });
            return taskDate === activeDateString;
        });

        setbeforeTaskShow(todayTasks.sort((a, b) => a.isDone - b.isDone));

    }, [taskList, activeDate])

    useEffect(() => {
        if (taskFilter === 'all') {
            setTaskShow(beforeTaskShow);
        } else if (taskFilter === 'met') {
            setTaskShow(beforeTaskShow.filter(task => task.isDone));
        } else {
            setTaskShow(beforeTaskShow.filter(task => !task.isDone));
        }
    }, [beforeTaskShow, taskFilter]);

    useEffect(() => {
      console.log("Updated beforeTaskShow:", beforeTaskShow);
    }, [beforeTaskShow]);

    function toggleTaskDisplay(operator) {
        setTaskFilter(operator);
    }

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        
        <>
            <div>
                <div className="full-date-cont">
                    <div className="task-handler">
                        <select name="show" className="show" value={taskFilter} onChange={(e) => toggleTaskDisplay(e.target.value)}>
                            <option value="all">All</option>
                            <option value="unmet">Unmet</option>
                            <option value="met">Met</option>
                        </select>
                        <p className="nav-date" onClick={() => {
                            toggleTodayDisplay();
                            redirectDateTask();
                        }}>{navDate}</p>
                        <button className="bi bi-plus-circle-fill add" onClick={() => openCloseNewTaskSetter()}></button>
                    </div>

                    <div className="date-menu">
                        <div className="date-track" ref={containerRef}>
                            {days.map((day, index) => {
                                const isToday = day.toDateString() === new Date().toDateString();
                                const weekday = dayNames[day.getDay()];
                                const isMonday = weekday.toLowerCase() === "mon";

                                function toggleDateDisplay() {
                                    setNavDate(day.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" }));
                                }

                                function saveToDays(dateDate) {
                                    if (taskList.length === 0) return;

                                    const parsedDate = new Date(dateDate);
                                    setActiveDate(parsedDate);

                                    const selectedDayTasks = taskList.filter(task => {
                                        const taskDate = new Date(task.id).toLocaleDateString("en-us", {
                                            day: "numeric", 
                                            month: "long", 
                                            year: "numeric"
                                        });
                                        return taskDate === dateDate;
                                    });                      

                                    setbeforeTaskShow(selectedDayTasks.sort((a, b) => a.isDone - b.isDone));
                                }

                                return (
                                    <div key={index} onClick={() => {
                                        toggleDateDisplay();
                                        setBorder(day.toDateString());
                                        saveToDays(day.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" }));
                                    }} className={`ind-date-box ${isMonday ? "snap-start monday" : ""} ${border === day.toDateString() ? "border-bluelight" : ""}`} ref={isToday ? todayRef : null}>
                                        <span className="date-name">{weekday}</span>
                                        <span className="other-days">{day.getDate()} </span>
                                    </div>
                                )
                            })}

                        </div>
                    </div>
                </div>

                {newTaskDisplay ? <NewTask exit={openCloseNewTaskSetter} /> : ""}
            </div>

            <div className="task-display">

                
                {taskShow.length === 0 || beforeTaskShow.length === 0 ? (
                    <p className="no-tasks">{taskFilter === 'all' ? 'No tasks' : taskFilter === 'met' ? 'No tasks completed...' : 'None!'}</p>
                ) : (
                    taskShow.map(task => (
                        <TaskDisplay
                            key={task.id}
                            taskE={task}
                        />
                    ))
                )}

            </div>
        </> 
    );
}

export default DateMenu;