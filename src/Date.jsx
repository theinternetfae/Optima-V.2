import { useEffect, useState, useRef, useMemo} from "react";
import NewTask from "./components/NewTask.jsx";
import TaskDisplay from "./components/TaskDisplay.jsx";
import React, {useContext} from "react";
import { TaskContext, SettingsContext } from "./components/TaskContext.js";


function DateMenu() {

    const { taskList } = useContext(TaskContext); 

    const containerRef = useRef(null);
    const dayRefs = useRef(new Map());
    const todayRef = useRef(null);

    const [newTaskDisplay, setNewTaskDisplay] = useState(false);

    const [taskFilter, setTaskFilter] = useState('all');

    //////////////////////////////////////////////////////////////


    function dayKey(d) {
        return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    }



    const ONE_DAY = 24 * 60 * 60 * 1000;

    function addDaysUTC(date, days) {
        return new Date(
            Date.UTC(
                date.getUTCFullYear(),
                date.getUTCMonth(),
                date.getUTCDate() + days
            )
        );
    }

    function diffDays(a, b) {
        return Math.round((b - a) / ONE_DAY);
    }

    function isSameDay(a, b) {
        return dayKey(a) === dayKey(b);
    }

    const CHUNK = 30;
    const today = new Date();

    const [startDate, setStartDate] = useState(() => addDaysUTC(today, -CHUNK));
    const [endDate, setEndDate] = useState(() => addDaysUTC(today, CHUNK));
    const [selectedDate, setSelectedDate] = useState(today);

    const days = useMemo(() => {
        const arr = [];
        for (let i = 0; ; i++){
            const d = addDaysUTC(startDate, i);
            if (d > endDate) break;
            arr.push(d);
        }

        return arr;
    }, [startDate, endDate]);


    useEffect(() => {
        const el = dayRefs.current.get(dayKey(selectedDate));
        if (el && containerRef.current) {
            el.scrollIntoView({inline: "center", block: "nearest", behavior: "smooth"});
        }
    }, [selectedDate, days]);

    const MIN_DATE = new Date(1900, 0, 1);
    const MAX_DATE = new Date(2100, 11, 31);

    useEffect(() => {
        if(selectedDate < MIN_DATE) setSelectedDate(MIN_DATE);
        if(selectedDate > MAX_DATE) setSelectedDate(MIN_DATE);
    }, [selectedDate]);

    useEffect(() => {
        function onKey(e) {
            if (e.key === "ArrowLeft") {
                setSelectedDate(prev => addDaysUTC(prev, -7));
            } else if (e.key === "ArrowRight") {
                setSelectedDate(prev => addDaysUTC(prev, 7));
            }
        }

        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    useEffect(() => {
        const THRESHOLD = 5;

        const distFromStart = diffDays(startDate, selectedDate);
        const distFromEnd = diffDays(selectedDate, endDate);

        if (distFromStart <= THRESHOLD) {
            setStartDate(prev => addDaysUTC(prev, -CHUNK));
        }
        if (distFromEnd <= THRESHOLD) {
            setEndDate(prev => addDaysUTC(prev, CHUNK));
        }
    }, [selectedDate, startDate, endDate]);

    function getWeekWindow(date) {
        const day = date.getUTCDay();
        const sunday = new Date(date);
        sunday.setDate(date.getDate() - day);

        const week = [];
        for(let i = 0; i < 7; i++) {
            const d = new Date(sunday);
            d.setDate(sunday.getDate() + i);
            week.push(d);
        }

        return week;
    }


    const week = useMemo(() => {
        if(!selectedDate) return;
        return getWeekWindow(selectedDate);
    }, [selectedDate]);
















    ///////////////////////////////////////////////////
    
    function openCloseNewTaskSetter() {
        setNewTaskDisplay(prev => !prev);
    }

    function toggleTodayDisplay() {
        if (todayRef?.current && containerRef.current) {
            todayRef?.current.scrollIntoView({
                behavior: "auto",
                inline: "center",
                block: "nearest",
            });
        }
    }

    function redirectDateTask() {
        setSelectedDate(new Date());
    }

    const tasksForSelectedDate = useMemo(() => {
        if(!taskList.length) return [];

        const selectedDateString = selectedDate.toLocaleDateString("en-US", { 
            day: "numeric", 
            month: "long", 
            year: "numeric" 
        });

        return taskList.filter(task => {
            const taskDate = new Date(task.appearId).toLocaleDateString("en-us", {
                day: "numeric", 
                month: "long", 
                year: "numeric"
            });
            return taskDate === selectedDateString;
        }).sort((a, b) => a.isDone - b.isDone);

    }, [taskList, selectedDate]);

    const visibleTasks = useMemo(() => {
        if (taskFilter === 'all') return tasksForSelectedDate;
        if (taskFilter === 'met') return tasksForSelectedDate.filter(ta => ta.isDone);
        if (taskFilter === 'commitments') return tasksForSelectedDate.filter(ta => ta.isCommited);
        return tasksForSelectedDate.filter(ta => !ta.isDone);
    }, [tasksForSelectedDate, taskFilter])

    function toggleTaskDisplay(operator) {
        setTaskFilter(operator);
    }


    const { level } = useContext(SettingsContext); 
    const levelLimit = useMemo(() => {
        
        if(!level) return;

        if (level === 1) {
            return 2;
        } else if (level === 2) {
            return 4;
        } else {
            return 6;
        }

    }, [level]);

    const limitReached = useMemo(() => {

        const todaysTasks = taskList.filter(t => new Date(t.appearId).toDateString() === new Date(today).toDateString());
        const commitedTasks = todaysTasks.filter(t => t.isCommited);
        const limitReached = commitedTasks.length >= levelLimit;
        return limitReached;

    }, [taskList, today, levelLimit])

    return (
        
        <>
            
            <div className="full-date-cont">
                <div className="task-handler">
                    <select name="show" className="show" value={taskFilter} onChange={(e) => toggleTaskDisplay(e.target.value)}>
                        <option value="all">All</option>
                        <option value="unmet">Unmet</option>
                        <option value="met">Met</option>
                        <option value="commitments">Commitments</option>
                    </select>
                    <p className="nav-date" onClick={() => {
                        toggleTodayDisplay();
                        redirectDateTask();
                    }}>{selectedDate.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })}</p>
                    <button className="bi bi-plus-circle-fill add" onClick={() => openCloseNewTaskSetter()}></button>
                </div>

                <div className="date-menu">
                    <div className="date-track" ref={containerRef}>
                        <ul className="test-box-cont">                            


                            {
                                week.map((d, i) => {
                                    const dateString = dayKey(d);
                                    const isSelected = isSameDay(d, selectedDate);

                                    return(
                                        <li 
                                            key={i} 
                                            ref={el => {
                                            if (el) dayRefs.current.set(dateString, el);
                                            else dayRefs.current.delete(dateString);
                                            }} 
                                            className={`test-box ${isSelected ? "border-[var(--color-accentprimary)]" : ""}`} 
                                            onClick={() => setSelectedDate(new Date(d))}
                                        >

                                            <span className="d-name">{d.toLocaleDateString(undefined, {weekday: 'short'})}</span>
                                            <span className="d-other">{d.getDate()}</span>

                                        </li>
                                    )
                                })
                            }
                        </ul>

                    </div>
                </div>
                {newTaskDisplay ? <NewTask exit={openCloseNewTaskSetter} /> : ""}
            </div>

            <div className="task-display">
                
                {/* <button className="border border-2 h-20 cursor-pointer" onClick={() => setLevel(prev => {
                    if(prev === 3) return 3;
                    return prev + 1;
                })}>{`Level ${level} - ${levelLimit} Tasks`}</button> */}

                {visibleTasks.length === 0 ? (
                    <p className="no-tasks">{taskFilter === 'all' ? 'No tasks' : taskFilter === 'met' ? 'No tasks completed...' : taskFilter === 'commitments' ? 'No commitments' :'None!'}</p>
                ) : (
                    visibleTasks.map(task => {
                        return <TaskDisplay
                            key={task.keyUUID}
                            taskE={task}
                            limitReached={limitReached}
                        />
                    })
                )}

            </div>
        </> 
    );
}

export default DateMenu;