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
    
    const [chosenHist, setChosenHist] = useState(null);

    const today = new Date();
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

    function toDayKey(date) {
        const d = new Date(date);

        return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
    }

    function isValidCalendarDate({ year, month, day }) {
        const y = Number(year);
        const m = Number(month);
        const d = Number(day);

        if (!y || !m || !d) return false;
        if (String(y).length !== 4) return false;

        const date = new Date(y, m - 1, d);

        return (
            date.getFullYear() === y &&
            date.getMonth() === m - 1 &&
            date.getDate() === d
        );
    }

    function searchDate() {
        
        if(!isValidCalendarDate({year: year, month: month, day: day})) {
            alert('Invalid date.');
            return;
        } else {
            setChosenDate(`${year}-${month}-${day}`);
            setMonth('');
            setDay('');
            setYear('');
        };

    }

    const tasksPerDay = useMemo(() => {
        const tasks = taskList.filter(t => !chosenDate ? toDayKey(t.id) === toDayKey(today) : toDayKey(t.id) === toDayKey(chosenDate));
        return tasks;
    }, [chosenDate, taskList])

    useEffect(() => {
        setChosenHist('');
    }, [chosenDate])

    const normalizeDate = date => new Date(date).toDateString();

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

        for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
            const nD = new Date(start) + 1;
            days.push(nD);
        }

        return days;
    
    }



    

    const stats = useMemo(() => {

        if(!chosenHist) {
            return {
                topStreak: 0,
                currentStreak: 0,
                doneCount: 0,
                isActive: false
            };
        };

        const chosensTasks = taskList.filter(t => t.baseId === chosenHist.baseId);

        if(chosensTasks.length === 0) {
            return {
                topStreak: 0,
                currentStreak: 0,
                doneCount: 0,
                isActive: false
            };
        };

        //topHistStreak
        let count = 0;
        let topStreak = 0;

        for(const c of chosensTasks) {
            if(c.isDone) {
                count++;
                topStreak = Math.max(topStreak, count);
            } else {
                count = 0;
            }
        }

        //currentHistStreak
        const start = new Date(chosensTasks[0].start);
        const validDays = generateDayRange(start, today);

        let currentStreak = 0;

        for(let i = validDays.length - 1; i >= 0; i--) {
            const tasksNDays = chosensTasks.filter(
                c => normalizeDate(c.id) === normalizeDate(validDays[i])
            );
            
            if(tasksNDays.some(td => td.isDone)) {
                currentStreak++;
            } else if (tasksNDays.some(td => !td.isDone)) {
                break;
            }
        }


        //histTaskDone
        const uniqueDone = chosensTasks.filter(tl => tl.isDone).length;


        //hisActive
        const end = chosensTasks[chosensTasks.length - 1].end;
        const isActive = new Date(end).getTime() > new Date(today).getTime();

        return {resultStreak: topStreak, count: currentStreak, uniqueDone: uniqueDone, isActive: isActive}
    }, [chosenHist, taskList]);


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
                    {!chosenDate ? toDayKey(today) : toDayKey(chosenDate)} [{tasksPerDay.length === 1 ? `${tasksPerDay.length} task` : `${tasksPerDay.length} tasks`}]
                </div>

            </div>

            <div className="tasks-per-day">
                <div className="tasks-pd-cont">

                    {
                        tasksPerDay.length === 0 ? (
                            <p className="no-tasks">No tasks...</p>
                        ) : tasksPerDay.map(t => {
                            return <TaskDisplay 
                                key={t.keyUUID}
                                taskE={t}
                                history={history}
                                chosenHist={chosenHist}
                                setChosenHist = {setChosenHist}
                            />
                        })
                    }

                </div>
            </div>

            <div className="chosen-task-info">
                {chosenHist === '' ? (
                    <p className="no-chosen">Choose task to see stats...</p>
                ) : (
                    <>

                        <div className="top">
                            <section className="sec" style={{border: chosenHist && `2px solid ${chosenHist.color}`}}>
                                <i className="bi-trophy bi-bi" style={{color: chosenHist && `${chosenHist.color}`}}></i>
                                <p className="calculator">{stats.resultStreak === 0 ? '0' : stats.resultStreak}</p>
                                <p className="calculator-label">Top streak</p>
                            </section>
                            <section className="sec" style={{border: chosenHist && `2px solid ${chosenHist.color}`}}>
                                <i className="bi-fire bi-bi" style={{color: chosenHist && `${chosenHist.color}`}}></i>
                                <p className="calculator">{stats.count === 0 ? '0' : stats.count}</p>
                                <p className="calculator-label">current streak</p>
                            </section>
                        </div>
                        <div className="top">
                            <section className="sec" style={{border: chosenHist && `2px solid ${chosenHist.color}`}}>
                                <i className="bi-bi bi-check2-circle" style={{color: chosenHist && `${chosenHist.color}`}}></i>
                                <p className="calculator">{stats.uniqueDone === 0 ? '0' : stats.uniqueDone}</p>
                                <p className="calculator-label">Times done</p>
                            </section>
                            <section className="sec" style={{border: chosenHist && `2px solid ${chosenHist.color}`}}>
                                <i className="bi-info-circle bi-bi" style={{color: chosenHist && `${chosenHist.color}`}}></i>
                                <p className="calculator">{stats.isActive ? "Active" : 'Inactive'}</p>
                                <p className="calculator-label">Status</p>
                            </section>
                        </div>
                    
                    </>
                )}
            
            </div>
        </div> 
    );
}

export default TaskHistory;