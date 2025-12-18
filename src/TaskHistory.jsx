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



    const [topHistStreak, setTopHistStreak] = useState(0);

    useEffect(() => {

        if(!chosenHist) return;
     
        const tasksToCalculate = taskList.filter(t => t.baseId === chosenHist.baseId)

        const resultStreak = tasksToCalculate.reduce((acc, tc) => {
            if(tc.isDone) {
                acc.count++;
            } else {
                acc.count > 0 && acc.streaks.push(acc.count);
                acc.count = 0;
            }

            return acc;
        }, {count: 0, streaks: []})

        resultStreak.count > 0 && resultStreak.streaks.push(resultStreak.count);

        setTopHistStreak(resultStreak.streaks);

    }, [chosenHist]);



    const [currentHistStreak, setCurrentHistStreak] = useState(0);

    useEffect(() => {
    
        if(!chosenHist) return;
        
        const tasksToCalculate = taskList.filter(t => t.baseId === chosenHist.baseId);

        const start = new Date(tasksToCalculate[0].start);

        const validDays = generateDayRange(start, today);

        let count = 0;

        for(let i = validDays.length - 1; i >= 0; i--) {
            const tasksNDays = tasksToCalculate.filter(tl => normalizeDate(tl.id) === normalizeDate(validDays[i]));
            
            if(tasksNDays.length > 0 && tasksNDays.some(td => td.isDone)) {
                count++;
            } else if (tasksNDays.length > 0 && tasksNDays.some(td => !td.isDone)) {
                break;
            }
        }

        setCurrentHistStreak(count);

    }, [chosenHist])




    const [histTaskDone, setHistTaskDone] = useState(0);
    useEffect(() => {
        
        if(!chosenHist) return;

        const uniqueDone = taskList.filter(tl => tl.baseId === chosenHist.baseId && tl.isDone === true);
        setHistTaskDone(uniqueDone.length);

    }, [chosenHist])






    const [histActiveStatus, setHistActiveStatus] = useState(false)

    useEffect(() => {

        if(!chosenHist) return;
        
        const validTasks = taskList.filter(t => t.baseId === chosenHist.baseId);

        const end = validTasks[validTasks.length - 1].end;
    
        new Date(end).getTime() > new Date(today).getTime() ? setHistActiveStatus(true) : setHistActiveStatus(false);
    
    }, [chosenHist])








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

            <div className="chosen-task-info">
                {chosenHist === '' ? (
                    <p className="no-chosen">Choose task to see stats...</p>
                ) : (
                    <>

                        <div className="top">
                            <section className="sec" style={{border: chosenHist && `2px solid ${chosenHist.color}`}}>
                                <i className="bi-trophy bi-bi" style={{color: chosenHist && `${chosenHist.color}`}}></i>
                                <p className="calculator">{topHistStreak.length > 0 ? Math.max(...topHistStreak) : 0}</p>
                                <p className="calculator-label">Top streak</p>
                            </section>
                            <section className="sec" style={{border: chosenHist && `2px solid ${chosenHist.color}`}}>
                                <i className="bi-fire bi-bi" style={{color: chosenHist && `${chosenHist.color}`}}></i>
                                <p className="calculator">{currentHistStreak}</p>
                                <p className="calculator-label">current streak</p>
                            </section>
                        </div>
                        <div className="top">
                            <section className="sec" style={{border: chosenHist && `2px solid ${chosenHist.color}`}}>
                                <i className="bi-bi bi-check2-circle" style={{color: chosenHist && `${chosenHist.color}`}}></i>
                                <p className="calculator">{histTaskDone}</p>
                                <p className="calculator-label">Tasks done</p>
                            </section>
                            <section className="sec" style={{border: chosenHist && `2px solid ${chosenHist.color}`}}>
                                <i className="bi-info-circle bi-bi" style={{color: chosenHist && `${chosenHist.color}`}}></i>
                                <p className="calculator">{histActiveStatus ? 'Active' : 'Inactive'}</p>
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