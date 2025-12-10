import { useEffect, useState, useRef, useMemo} from "react";
import NewTask from "./components/NewTask.jsx";
import TaskDisplay from "./components/TaskDisplay.jsx";
import React, {useContext} from "react";
import { TaskContext } from "./components/TaskContext.js";


function DateMenu() {
    const today = new Date();
    const { taskList, setTaskList } = useContext(TaskContext); 
    const containerRef = useRef(null);
    const todayRef = useRef(null);

    const [newTaskDisplay, setNewTaskDisplay] = useState(false);
    
    const [activeDate, setActiveDate] = useState(new Date());
    const [border, setBorder] = useState(new Date().toDateString());

    const [taskFilter, setTaskFilter] = useState('all');

    // function generateDayWindow(centerDate, rangeInDays = 30) {

    // }

    function generateDayWindow(centerDate, rangeInDays = 30) {
        const result = [];
        const start = new Date(centerDate);

        start.setDate(start.getDate() - rangeInDays);
        const totalDays = rangeInDays * 3;
        
        for (let i = 0; i <= totalDays; i++) {
            result.push(new Date(start));
            start.setDate(start.getDate() + 1);
        }

        return result;
    }

    const days = useMemo(() => {
        return generateDayWindow(activeDate, 30);
    }, [today]);
    
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

    function redirectDateTask() {
        setActiveDate(new Date());
        setBorder(new Date().toDateString());
    }

    const tasksForActiveDate = useMemo(() => {
        if(!taskList.length) return [];

        const activeDateString = activeDate.toLocaleDateString("en-US", { 
            day: "numeric", 
            month: "long", 
            year: "numeric" 
        });

        return taskList.filter(task => {
            const taskDate = new Date(task.id).toLocaleDateString("en-us", {
                day: "numeric", 
                month: "long", 
                year: "numeric"
            });
            return taskDate === activeDateString;
        }).sort((a, b) => a.isDone - b.isDone);

    }, [taskList, activeDate]);

    const visibleTasks = useMemo(() => {
        if (taskFilter === 'all') return tasksForActiveDate;
        if (taskFilter === 'met') return tasksForActiveDate.filter(ta => ta.isDone);
        return tasksForActiveDate.filter(ta => !ta.isDone);
    }, [tasksForActiveDate, taskFilter])

    function toggleTaskDisplay(operator) {
        setTaskFilter(operator);
    }

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const [startIndex, setStartIndex] = useState(7);
    const [windowedDates, setWindowedDates] = useState(days.slice(0, 7));

    useEffect(() => {

        function scrollBar(e) {
            if(e.key === 'ArrowLeft') {
                if(startIndex === 7) {
                    setWindowedDates(days.slice(0, 7));
                    return;
                }

                setStartIndex(s => s - 7);
            }

            if(e.key === 'ArrowRight') {
                if(startIndex >= days.length) {
                    return
                };
                
                setStartIndex(s => s + 7);
            }

        }   

        window.addEventListener('keydown', scrollBar);

        return () => window.removeEventListener('keydown', scrollBar);
    })

    useEffect(() => {
        setWindowedDates(days.slice(startIndex, startIndex + 7))
    }, [startIndex])

    useEffect(() => {
        console.log(windowedDates.toLocaleString('en-US', {day: 'numeric', month: 'long', year: 'numeric'}));
        console.log(startIndex)
    }, [startIndex, windowedDates]);

    ///FIX: When going back it disappears ✅, fix the UI ✅, Initialize all that needs to be initalized, add animation if possible, set snap day to Sundays, fix border to snap day

    useEffect(() => {
        console.log(days.map(d => d.toLocaleDateString('en-US', {day: 'numeric', month: 'long', year: 'numeric'})))
    }, [days])

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
                        }}>{activeDate.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })}</p>
                        <button className="bi bi-plus-circle-fill add" onClick={() => openCloseNewTaskSetter()}></button>
                    </div>

                    <div className="date-menu">
                        <div className="date-track" ref={containerRef}>
                            <ul className="test-box-cont">

                                {/* <li className="test-box">
                                    <span className="d-name"></span>
                                    <span className="d-other"></span>
                                </li>

                                <li className="test-box">
                                    <span className="d-name"></span>
                                    <span className="d-other"></span>
                                </li>

                                <li className="test-box">
                                    <span className="d-name"></span>
                                    <span className="d-other"></span>
                                </li>

                                <li className="test-box">
                                    <span className="d-name"></span>
                                    <span className="d-other"></span>
                                </li>

                                <li className="test-box">
                                    <span className="d-name"></span>
                                    <span className="d-other"></span>
                                </li>

                                <li className="test-box">
                                    <span className="d-name"></span>
                                    <span className="d-other"></span>
                                </li>

                                <li className="test-box">
                                    <span className="d-name"></span>
                                    <span className="d-other"></span>
                                </li>     */}
                                
                                {
                                    windowedDates.map((d, i) => {
                                
                                    const weekday = dayNames[d.getDay()];

                                    return <li key={i} className="test-box">
                                            <span className="d-name">{weekday}</span>
                                            <span className="d-other">{d.getDate()}</span>
                                        </li> 
                                    })
                                     

                                }
                            </ul>
                            {/* {days.map((day, index) => {
                                const isToday = day.toDateString() === new Date().toDateString();
                                const weekday = dayNames[day.getDay()];
                                const isMonday = weekday.toLowerCase() === "mon";                

                                return (
                                    <div key={index} onClick={() => {
                                        setBorder(day.toDateString());
                                        setActiveDate(new Date(day));
                                    }} className={`ind-date-box ${isMonday ? "snap-start monday" : ""} ${border === day.toDateString() ? "border-bluelight" : ""}`} ref={isToday ? todayRef : null}>
                                        <span className="date-name">{weekday}</span>
                                        <span className="other-days">{day.getDate()} </span>
                                    </div>
                                )
                            })} */}

                        </div>
                    </div>
                </div>

                {newTaskDisplay ? <NewTask exit={openCloseNewTaskSetter} /> : ""}
            </div>

            <div className="task-display">

                
                {visibleTasks.length === 0 ? (
                    <p className="no-tasks">{taskFilter === 'all' ? 'No tasks' : taskFilter === 'met' ? 'No tasks completed...' : 'None!'}</p>
                ) : (
                    visibleTasks.map(task => {
                        console.log(taskList);
                        return <TaskDisplay
                            key={task.keyUUID}
                            taskE={task}
                        />
                    })
                )}

            </div>
        </> 
    );
}

export default DateMenu;