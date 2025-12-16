import { useState, useContext, useEffect, useMemo } from "react";
import { TaskContext } from "./components/TaskContext.js";
import TaskDisplay from "./components/TaskDisplay.jsx";

function TaskHistory() {
    
    const { taskList } = useContext(TaskContext);
    const history = true;

    const [month, setMonth] = useState('');
    const [day, setDay] = useState('');
    const [year, setYear] = useState('');
    const [chosenDate, setChosenDate] = useState('');
    
    const today = new Date();
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

    function toDayKey(date) {
        const d = new Date(date);

        return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
    }

    function searchDate() {
        if(!month || !year || !day) return;
        setChosenDate(`${year}-${month}-${day}`);
        setMonth('');
        setDay('');
        setYear('');
    }

    const tasksPerDay = useMemo(() => {
        const tasks = taskList.filter(t => !chosenDate ? toDayKey(t.id) === toDayKey(today) : toDayKey(t.id) === toDayKey(chosenDate));
        console.log(tasks);
        console.log(tasks.length === 0 ? 'NO TASKS' : toDayKey(tasks[0].id));
        console.log(toDayKey(today));
        console.log(toDayKey(chosenDate));

        return tasks;
    }, [chosenDate, taskList])

    return ( 
        <div className="history-cont">

            <div className="date-header">
                <div className="setter">
                    <input type="number" value={month} className="selecting" placeholder="MM" onChange={(e) => setMonth(e.target.value)}/>
                    <input type="number" value={day} className="selecting" placeholder="DD" onChange={(e) => setDay(e.target.value)}/>
                    <input type="number" value={year} className="selecting" placeholder="YYYY" onChange={(e) => setYear(e.target.value)}/>
                    <button className="bi bi-search" onClick={() => searchDate()}></button>
                </div>
                
                <div className="chosen" onClick={() => setChosenDate(`${today.getFullYear()}-${months[today.getMonth()]}-${today.getDate()}`)}>
                    {!chosenDate ? toDayKey(today) : toDayKey(chosenDate)}
                </div>
            </div>

            <div className="tasks-per-day">
                {
                    tasksPerDay.length === 0 ? (
                        <p className="no-tasks">No tasks...</p>
                    ) : tasksPerDay.map(t => {
                        return <TaskDisplay 
                            key={t.keyUUID}
                            taskE={t}
                            history={history}
                        />
                    })
                }
            </div>

            <div className="chosen-task-info">

            </div>
        </div> 
    );
}

export default TaskHistory;