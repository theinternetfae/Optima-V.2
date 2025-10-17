import { useEffect, useState, useRef} from "react";
import NewTask from "./components/NewTask.jsx";
import TaskDisplay from "./components/TaskDisplay.jsx";

function DateMenu() {
    const [days, setDays] = useState([]);
    const containerRef = useRef(null);
    const todayRef = useRef(null);

    const [newTaskDisplay, setNewTaskDisplay] = useState(false);
    const [taskList, setTaskList] = useState([]);
    const [taskShow, setTaskShow] = useState([]);
    const [taskFilter, setTaskFilter] = useState('all');

    function getDaysAround(today, rangeInDays = 90) {
        
        const result = [];
        const start = new Date(today);
        start.setDate(start.getDate() - rangeInDays);

        for (let i = 0; i < rangeInDays * 90; i++) {
            const day = new Date(start);
            result.push(day);
            start.setDate(start.getDate() + 1);
        }

        return result;
    }

    function addTask() {
        setNewTaskDisplay(!newTaskDisplay);
    }

    const today = new Date();

    useEffect(() => {
        const today = new Date();
        setDays(getDaysAround(today, 90));
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

    useEffect(() => {
        if (taskFilter === 'all') {
            setTaskShow(taskList);
        } else if (taskFilter === 'met') {
            setTaskShow(taskList.filter(task => task.isDone));
        } else {
            setTaskShow(taskList.filter(task => !task.isDone));
        }

        console.log(taskList);
    }, [taskList, taskFilter]);

    function toggleTodayDisplay() {
        const navDate = document.querySelector('.nav-date');
        navDate.innerText = `${today.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })}`;
        if (todayRef.current && containerRef.current) {
            todayRef.current.scrollIntoView({
                behavior: "auto",
                inline: "center",
                block: "nearest",
            });
        }
    }

    function toggleTaskDisplay(operator) {
        setTaskFilter(operator);
        if(operator === 'all') {
            return setTaskShow(taskList) || 'No tasks';
        } else if (operator === 'met') {
            return setTaskShow(taskList.filter(task => task.isDone));
        } else {
            return setTaskShow(taskList.filter(task => !task.isDone));
        }
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
                        <p className="nav-date" onClick={toggleTodayDisplay}>{today.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })}</p>
                        <button className="bi bi-plus-circle-fill add" onClick={() => addTask()}></button>
                    </div>

                    <div className="date-menu" ref={containerRef}>
                        <div className="date-track" ref={containerRef}>
                            {days.map((day, index) => {
                                const isToday = day.toDateString() === new Date().toDateString();
                                const weekday = dayNames[day.getDay()];
                                const isMonday = weekday.toLowerCase() === "mon";

                                function toggleDateDisplay() {
                                    const navDate = document.querySelector('.nav-date');
                                    navDate.innerText = `${day.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })}`;
                                }

                                return (
                                    <div key={index} onClick={toggleDateDisplay} className={`ind-date-box ${isMonday ? "snap-start monday" : ""} ${isToday ? "border-bluelight" : ""}`} ref={isToday ? todayRef : null}>
                                        <span className="date-name">{weekday}</span>
                                        <span className="other-days">{day.getDate()} </span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>

                {newTaskDisplay ? <NewTask exit={addTask} newTasks={((addingTask) => setTaskList(prev => [...prev, addingTask].sort((a, b) => a.isDone - b.isDone)))} /> : ""}
            </div>

            <div className="task-display">

                
                {taskShow.length === 0 ? (
                    <p className="no-tasks">{taskFilter === 'all' ? 'No tasks' : taskFilter === 'met' ? 'No tasks completed...' : 'None!'}</p>
                ) : (
                    taskShow.map(task => (
                    <TaskDisplay
                        key={task.name}
                        taskE={task}
                        editedTasks={(editedList) => setTaskList([...editedList].sort((a, b) => a.isDone - b.isDone))}
                        prevTasks={taskList}
                    />
                    ))
                )}

            </div>
        </> 
        
    );
}

export default DateMenu;