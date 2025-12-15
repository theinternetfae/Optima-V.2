import { useState, useContext, useEffect, useMemo } from "react";
import { TaskContext } from "./components/TaskContext.js";

function TaskHistory() {
    
    const { taskList } = useContext(TaskContext);

    const [month, setMonth] = useState('');
    const [day, setDay] = useState('');
    const [year, setYear] = useState('');
    const [chosenDate, setChosenDate] = useState('');
    
    const today = new Date();
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

    function toDayKey(date) {
        const d = new Date(date);

        return `${months[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
    }

    function searchDate() {
        if(!month || !year || !day) return;
        setChosenDate(`${year}-${month}-${day}`);
        setMonth('');
        setDay('');
        setYear('');
    }

    useEffect(() => {
        console.log(chosenDate);
    }, [chosenDate]);

    return ( 
        <div className="history-cont">

            <div className="date-header">
                <div className="setter">
                    <input type="number" value={month} className="selecting" placeholder="MM" onChange={(e) => setMonth(e.target.value)}/>
                    <input type="number" value={day} className="selecting" placeholder="DD" onChange={(e) => setDay(e.target.value)}/>
                    <input type="number" value={year} className="selecting" placeholder="YYYY" onChange={(e) => setYear(e.target.value)}/>
                    <button className="bi bi-search" onClick={() => searchDate()}></button>
                </div>
                
                <div className="chosen">
                    {!chosenDate ? toDayKey(today) : toDayKey(chosenDate)}
                </div>
            </div>

            <div className="tasks-per-day">

            </div>

            <div className="chosen-task-info">

            </div>
        </div> 
    );
}

export default TaskHistory;