import { useEffect, useState, useRef} from "react";
import NewTask from "./components/NewTask.jsx";
import TaskDisplay from "./components/TaskDisplay.jsx";

function DateMenu() {
    const [days, setDays] = useState([]);
    const containerRef = useRef(null);
    const todayRef = useRef(null);


    const [newTaskDisplay, setNewTaskDisplay] = useState(false);
    
    const today = new Date();
    const [navDate, setNavDate] = useState(today.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" }));

    const [taskList, setTaskList] = useState(() => {
        const saved = localStorage.getItem("tasks");
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem("tasks", JSON.stringify(taskList));
    }, [taskList]);

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

    function addTask() {
        setNewTaskDisplay(!newTaskDisplay);
    }

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

        console.log(taskList);
    }, [beforeTaskShow, taskFilter]);

    useEffect(() => {
      console.log("Updated beforeTaskShow:", beforeTaskShow);
    }, [beforeTaskShow]);

    function toggleTaskDisplay(operator) {
        setTaskFilter(operator);
    }

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];

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
                        <button className="bi bi-plus-circle-fill add" onClick={() => addTask()}></button>
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

                {newTaskDisplay ? <NewTask exit={addTask} newTasks={((addingTask) => setTaskList(prev => [...prev, addingTask]))} /> : ""}
            </div>

            <div className="task-display">

                
                {taskShow.length === 0 || beforeTaskShow.length === 0 ? (
                    <p className="no-tasks">{taskFilter === 'all' ? 'No tasks' : taskFilter === 'met' ? 'No tasks completed...' : 'None!'}</p>
                ) : (
                    taskShow.map(task => (
                    <TaskDisplay
                        key={task.name}
                        taskE={task}
                        editedTasks={(update) => {
                            if(Array.isArray(update)) {
                                setTaskList(update);
                            } else {
                                setTaskList(prev => prev.map(t => t.id === update.id ? update : t ))     
                            }
                        }}
                        prevTasks={taskList}
                    />
                    ))
                )}

            </div>
        </> 
        
    );
}

export default DateMenu;