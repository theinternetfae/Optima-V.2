import React, {useContext, useState, useEffect, useMemo} from "react";
import { TaskContext } from "./components/TaskContext.js";

function TaskStats() {
    const today = new Date();
    const normalizeDate = date => new Date(date).toDateString();

    const { taskList, setTaskList, tasksDone, setTasksDone } = useContext(TaskContext);

    const [selectedId, setSelectedId] = useState(0);

    const [selectedTask, setSelectedTask] = useState(null);
    const [selectedTaskCount, setSelectedTaskCount] = useState(0);

    const [selectedTaskStreaks, setSelectedTaskStreaks] = useState([]);
    const [generalStreak, setGeneralStreak] = useState([]);

    const [currentStreak, setCurrentStreak] = useState(0);
    const [generalCurrentStreak, setGeneralCurrentStreak] = useState(0);

    const [selectedRate, setSelectedRate] = useState(0);
    const [generalRate, setGeneralRate] = useState(0);

    const [activeStatus, setActiveStatus] = useState(false);
    const [activeCount, setActiveCount] = useState(0);

    const [matchingBorderDay, setMatchingBorderDay] = useState([]);

    function toggleSelected(id, task) {
        setSelectedId(id);
        setSelectedTask(task);
    }

    function monthKey(d) {
        return `${d.getFullYear()}-${d.getMonth()}`;
    }

    const uniqueTasks = useMemo(() => {
        
        const uniqueTasksMap = new Map();

        for (const task of taskList) {
            if (task.days.length > 0) {
                uniqueTasksMap.set(task.baseId, task);
            }
        }

        const uniqueTasks = [...uniqueTasksMap.values()];
        uniqueTasks.sort((a, b) => {
            const aEnd = Number(new Date(b.end) > today);
            const bEnd = Number(new Date(a.end) > today); 
            return Number(bEnd) - Number(aEnd);
        });
        
        return uniqueTasks;

    }, [taskList, today]);

    function cutWords(text, limit = 1) {
        const words = text.split(" ");
        if (words.length <= limit) return text; 
        return words.slice(0, limit).join(" ") + "...";
    }

    const ONE_DAY = 24 * 60 * 60 * 1000;

    function addDays(date, days) {
        return new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate() + days
        );
    }


    function diffDays(a, b) {
        return Math.round((b - a) / ONE_DAY);
    }
    
    const CHUNK = 60;

    const [startDate, setStartDate] = useState(addDays(today, -CHUNK));
    const [endDate, setEndDate] = useState(addDays(today, CHUNK));

    const days = useMemo(() => {
        const arr = [];

        for (let i = 0; ; i++) {
            const m = addDays(startDate, i);
            if (m > endDate) break;
            arr.push(m);
        }

        return arr;
    }, [startDate, endDate]);

    const [currentMonth, setCurrentMonth] = useState(today);
    const [monthDays, setMonthDays] = useState([]);
    
    useEffect(() => {

        const daysForCurrentMonth = days.filter(m => {
            return monthKey(m) === monthKey(currentMonth);
        })

        setMonthDays(daysForCurrentMonth);

    }, [currentMonth, days, taskList]);
    
    const MIN_DATE = new Date(2000, 0, 1);
    const MAX_DATE = new Date(2100, 11, 31);

    useEffect(() => {
        if(currentMonth < MIN_DATE && setCurrentMonth(MIN_DATE));
        if(currentMonth > MAX_DATE && setCurrentMonth(MAX_DATE));
    })

    function oneMonthBack() {
        const newCurrentMonth = new Date(currentMonth);
        newCurrentMonth.setMonth(currentMonth.getMonth() - 1);

        setCurrentMonth(newCurrentMonth);
    }

    function oneMonthForward() {
        const newCurrentMonth = new Date(currentMonth);
        newCurrentMonth.setMonth(currentMonth.getMonth() + 1);

        setCurrentMonth(newCurrentMonth);   
    }

    useEffect(() => {
        
        const THRESHOLD = 5;
        const distFromStart = Math.abs(diffDays(startDate, currentMonth));
        const distFromEnd = Math.abs(diffDays(currentMonth, endDate));
        
        
        if(distFromStart <= THRESHOLD) {
            setStartDate(prev => addDays(prev, -CHUNK));
        }

        if(distFromEnd <= THRESHOLD) {
            setEndDate(prev => addDays(prev, CHUNK));
        }

    }, [startDate, endDate, currentMonth]);











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
    

    useEffect(() => {
        if (!selectedTask || !selectedTask.start || !selectedTask.end) return;

        const startDate = new Date(selectedTask.start);
        const endDate = new Date(selectedTask.end);
        const normalize = date => new Date(date.getFullYear(), date.getMonth(), date.getDate());

        const broderDays = monthDays.filter(day => {
            const d = normalize(new Date(day));

            const weekdayIndex = d.getDay();
            const weekdayNames = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
            const weekday = weekdayNames[weekdayIndex];
            
            const isInRange = d >= normalize(startDate) && d <= normalize(endDate);
            const isMatchingDay = Array.isArray(selectedTask.days) && selectedTask.days.some(st => st && st.toString().trim().toLowerCase() === weekday);
            

            return isInRange && isMatchingDay;
        });
            
        setMatchingBorderDay(broderDays);

    }, [selectedTask, monthDays])

    useEffect(() => {

        if(!selectedTask) {

            if(taskList.length === 0) return;

            const start = new Date(taskList[0].start);
            const end = new Date(taskList[taskList.length - 1].end);

            const validDays = generateDayRange(start, end);
            
            const generalStreak = validDays.reduce((acc, d) => {

                const tasksNDays = taskList.filter(tl => normalizeDate(tl.id) === normalizeDate(d));

                if(tasksNDays.length > 0 && tasksNDays.every(td => td.isDone)) {
                    acc.count++;
                } else if (tasksNDays.length > 0 && tasksNDays.some(td => td.isDone === false)) {
                    acc.count > 0 && acc.streak.push(acc.count);
                    acc.count = 0;
                }

                return acc;

            }, {count: 0, streak: []})

            generalStreak.count > 0 && generalStreak.streak.push(generalStreak.count);

            setGeneralStreak(generalStreak.streak);

        } else {

            const tasksToCalculate = taskList.filter(t => t.baseId === selectedTask.baseId)

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

            setSelectedTaskStreaks(resultStreak.streaks);

        };


    }, [selectedTask])












    /////////////////////////////////////////////////////////
    useEffect(() => {

        if(!selectedTask) {

            if(taskList.length === 0) return;

            const tasksByBase = taskList.reduce((acc, t) => {
                if (!acc[t.baseId]) acc[t.baseId] = [];
                acc[t.baseId].push(t);
                return acc;
            }, {});

            const lastTasks = Object.values(tasksByBase).map(ta => {
                
                const lastTask = ta.reduce((latest, current) =>
                    new Date(current.id) > new Date(latest.id) ? current : latest
                , ta[0]);

                return lastTask;
            });

            const lastEndDates = lastTasks.map(t => t.end);
            let count = 0;

            lastEndDates.forEach(ld => new Date(ld).getTime() > new Date(today).getTime() && count++)

            setActiveCount(count);

        } else {
            const validTasks = taskList.filter(t => t.baseId === selectedTask.baseId);

            const end = validTasks[validTasks.length - 1].end;
        
            new Date(end).getTime() > new Date(today).getTime() ? setActiveStatus(true) : setActiveStatus(false);

        }

    

    }, [selectedTask])


    useEffect(() => {

        if(!selectedTask) {

            if(taskList.length === 0) return;

            const total = taskList.length;

            const totalDone = taskList.filter(t => t.isDone).length;
            
            const totalRate = ((totalDone / total) * 100).toFixed(2);
            
            setGeneralRate(totalRate);

        } else {
            
            const selectedTotal = taskList.filter(t => t.baseId === selectedTask.baseId);
            
            const selectedCompleted = selectedTotal.filter(t => t.isDone);
            
            const selectedRate = ((selectedCompleted.length / selectedTotal.length) * 100).toFixed(2); 
            
            setSelectedRate(selectedRate);
        
        }

    }, [selectedTask, taskList]);

    ////////////////////////////////////////////////////////////////////

    useEffect(() => {
        if (!selectedTask) {
            setSelectedTaskCount(tasksDone.length);
            return;
        };

        const uniqueDone = taskList.filter(tl => tl.baseId === selectedTask.baseId && tl.isDone === true);
        setSelectedTaskCount(uniqueDone.length);
        
    }, [selectedTask])


    useEffect(() => {

        if(!selectedTask) {

            const start = taskList.length > 0 && new Date(taskList[0].start);

            const validDays = generateDayRange(start, today);
            if(!validDays) return;

            let count = 0;

            for(let i = validDays.length - 1; i >= 0; i--) {
                const tasksNDays = taskList.filter(tl => normalizeDate(tl.id) === normalizeDate(validDays[i]));
                
                if(tasksNDays.length > 0 && tasksNDays.every(td => td.isDone)) {
                    count++;
                } else if (tasksNDays.length > 0 && tasksNDays.some(td => !td.isDone)) {
                    break;
                }                    
            }

            setGeneralCurrentStreak(count);

        } else {

            const tasksToCalculate = taskList.filter(t => t.baseId === selectedTask.baseId);

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

            setCurrentStreak(count);

        }

    }, [selectedTask])


    function amountGeneralStreak() {
        const number = selectedTask ? (selectedTaskStreaks.length > 0 ? Math.max(...selectedTaskStreaks) : 0) : generalStreak.length > 0 ? Math.max(...generalStreak) : 0
        return `${number} ${number === 1 ? 'day' : 'days'}`;
    }

    function amountGeneralCurrentStreak() {
        const number = selectedTask ? currentStreak : generalCurrentStreak;
        return `${number} ${number === 1 ? 'day' : 'days'}`;
    }

    return ( 
        <div className="full-stats-cont">

            <div className="stats-header">
                <button className="bi bi-lightbulb-fill tips"></button>
                <select name="task-selected" value={selectedId} onChange={e => {
                    
                    uniqueTasks.forEach(task => {
                        Number(e.target.value) === task.baseId ? toggleSelected(Number(e.target.value), task) : Number(e.target.value) === 0 && toggleSelected(Number(e.target.value));
                    })
                    
                }} className="task-selected">         

                    <option value={0}>
                        {`📚 Overall`}
                    </option>
                    
                    {
                        uniqueTasks.map((task, index) => (
                            <option value={task.baseId} key={index}>
                                {task.emoji} {task.name}
                            </option>
                        ))
                    }                    
                </select>
                <button className="bi bi-plus-circle-fill add"></button>
            </div>

            <div className="selected-scroll-cont">
                <ul className="selected-scroll">
                
                    <div className="li-cont">
                        <li onClick={() => toggleSelected(0)} className={selectedId === 0 ? 'border-accentmain' : ""}>
                            <span>📚</span> {selectedId === 0 && <span>Overall</span>}
                        </li>
                    </div>

                    {
                        uniqueTasks.map((task, index) => (
                            <div key={index} className="li-cont">
                                <li onClick={() => toggleSelected(task.baseId, task)} style={selectedId === task.baseId ? { border: `2px solid ${task.color}` } : {}}>
                                    {task.emoji} {selectedId === task.baseId && <span>{cutWords(task.name)}</span>}
                                </li>
                            </div>
                        ))
                    }

                </ul>
            </div>

            <div className="date-box-main">
                <button className="bi-chevron-left bi-chevron" onClick={(() => oneMonthBack())}></button>
                <div className="date-box-cont">
                    <p onClick={() => setCurrentMonth(new Date())} className="cursor-pointer">{currentMonth.toLocaleDateString("en-US", {month: "long", year: "numeric"})}</p>
                    <div className="date-box-sub">
                        <div className="calendar-grid">

                            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d, i) => (
                                <div key={i} className="day-label">{d}</div>
                            ))}

                            {
                                monthDays.length > 0 &&
                                Array(monthDays[0].getDay()).fill(null).map((_, i) => (
                                    <div key={"blank"+i} className="blank"></div>
                                ))
                            }

                            {
                                monthDays.map((day, i) => {
                                    const isToday = day.toDateString() === today.toDateString();
                                    const isMatch = matchingBorderDay.some(border => border.toDateString() === day.toDateString());

                                    const borderStyle = !selectedTask
                                    ? { border: "2px solid #60A5FA" }
                                    : isMatch
                                        ? {border: `2px solid ${selectedTask.color}`}
                                        : {};

                                    return (
                                        <div key={i} title={day.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })} className="date-cell" style={borderStyle}>
                                            {isToday ? <i className="bi bi-geo-alt text-bluelight"></i> : day.getDate()}
                                        </div>
                                    )
                                })
                            }

                        </div>
                    </div>
                </div>
                <button className="bi-chevron-right bi-chevron" onClick={(() => oneMonthForward())}></button>
            </div>

            <div className="average-display">
                
                <div className="filler-front">

                    <div className="average-body">
                        <p className="rating">{selectedTask ? (selectedRate === 0 ? '0.00' : selectedRate) : (generalRate === 0 ? '0.00' : generalRate)}%</p>
                        <p className="rating-title">Overall rate</p>
                    </div>

                    <div className="average-loader">
                    </div>

                </div>

                <div className="the-four">
                    <div className="top">
                        <section title="Top streak" className="sec-one-two" style={uniqueTasks.some(task => selectedId === task.baseId) ? { border: `2px solid ${selectedTask.color}`} : {}}>
                            <i className="bi-trophy" style={uniqueTasks.some(task => selectedId === task.baseId) ? { color: `${selectedTask.color}`} : {}}></i>
                            <p className="calculator">{amountGeneralStreak()}</p>
                            <p className="calculator-label">Top streak</p>
                        </section>
                        <section title="Current streak" className="sec-one-two" style={uniqueTasks.some(task => selectedId === task.baseId) ? { border: `2px solid ${selectedTask.color}`} : {}}>
                            <i className="bi-fire" style={uniqueTasks.some(task => selectedId === task.baseId) ? { color: `${selectedTask.color}`} : {}}></i>
                            <p className="calculator">{amountGeneralCurrentStreak()}</p>
                            <p className="calculator-label">current streak</p>
                        </section>
                    </div>
                    <div className="bottom">
                        <section title="Tasks done" className="sec-one-two" style={uniqueTasks.some(task => selectedId === task.baseId) ? { border: `2px solid ${selectedTask.color}`} : {}}>
                            <i className="bi bi-check2-circle" style={uniqueTasks.some(task => selectedId === task.baseId) ? { color: `${selectedTask.color}`} : {}}></i>
                            <p className="calculator">{selectedTaskCount}</p>
                            <p className="calculator-label">{selectedTask ? 'Times Done' : 'Habits done'}</p>
                        </section>
                            <section title="Active status" className="sec-one-two" style={uniqueTasks.some(task => selectedId === task.baseId) ? { border: `2px solid ${selectedTask.color}`} : {}}>
                            <i className="bi-info-circle" style={uniqueTasks.some(task => selectedId === task.baseId) ? { color: `${selectedTask.color}`} : {}}></i>
                            <p className="calculator">{selectedTask ? (activeStatus ? 'Active' : 'Inactive') : `${activeCount} Active`}</p>
                            <p className="calculator-label">Status</p>
                        </section>
                    </div>
                </div>

            </div>

        </div> 
    );
}

    export default TaskStats;