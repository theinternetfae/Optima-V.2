    import React, {useContext, useState, useEffect} from "react";
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

        const [taskDays, setTaskDays] = useState([]);


        function toggleSelected(id, task) {
            setSelectedId(id);
            setSelectedTask(task);

        }

        const uniqueTasks = Object.values(
            taskList.reduce((acc, task) => {
                if(!acc[task.baseId] && task.days.length > 0) acc[task.baseId] = task;
                return acc;
            }, {})
        )

        function cutWords(text, limit = 1) {
            const words = text.split(" ");
            if (words.length <= limit) return text; 
            return words.slice(0, limit).join(" ") + "...";
        }

        function getDaysFor(now, totalYears) {
            const resultDays = [];
            const start = new Date(now);
            start.setFullYear(start.getFullYear() - 1);
            const totalDays = totalYears * 365;

            for (let i = 0; i < totalDays; i++) {
                resultDays.push(new Date(start));
                start.setDate(start.getDate() + 1);
            }

            return resultDays;
        }

        useEffect(() => {
            setTaskDays(getDaysFor(today, 20));
        }, []);

        const [currentMonth, setCurrentMonth] = useState(new Date());
        const [monthDays, setMonthDays] = useState([]);
        
        useEffect(() => {

            const daysForCurrentMonth = taskDays.filter(day => {
                return day.toLocaleDateString("en-US", { month: "long", year: "numeric" }) === currentMonth.toLocaleDateString("en-US", {month: "long", year: "numeric"});
            })

            setMonthDays(daysForCurrentMonth);

        }, [currentMonth, taskDays, taskList]);

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

                const start = new Date(taskList[0].start);
                const end = new Date(taskList[taskList.length - 1].end);

                const validDays = taskDays.filter(d => d >= start && d <= end);
                
                const generalStreak = validDays.reduce((acc, d) => {

                    const tasksNDays = taskList.filter(tl => normalizeDate(tl.id) === normalizeDate(d));

                    // console.log(tasksNDays.length > 0 && tasksNDays.every(td => td.isDone));
                    // console.log(tasksNDays.length > 0 && tasksNDays.some(td => !td.isDone));

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


        }, [selectedTask, taskDays])


























        useEffect(() => {

            if(!selectedTask) {

                const tasksByBase = taskList.reduce((acc, t) => {
                    if (!acc[t.baseId]) acc[t.baseId] = [];
                    acc[t.baseId].push(t);
                    return acc;
                }, {})

                const lastTasks = Object.values(tasksByBase).map(ta => {
                    
                    const lastTask = ta.reduce((latest, current) =>
                        new Date(current.id) > new Date(latest.id) ? current : latest
                    , ta[0]);

                    return lastTask;
                });

                const lastEndDates = lastTasks.map(t => t.end);
                console.log(lastEndDates);
                let count = 0;

                lastEndDates.forEach(ld => new Date(ld).getTime() > new Date(today).getTime() && count++)

                setActiveCount(count);

            } else {
                const validTasks = taskList.filter(t => t.baseId === selectedTask.baseId);

                const end = validTasks[validTasks.length - 1].end;
                console.log(new Date(end).getTime() > new Date(today).getTime());
            
                new Date(end).getTime() > new Date(today).getTime() ? setActiveStatus(true) : setActiveStatus(false);

            }

        

        }, [selectedTask])










        useEffect(() => {

            if(!selectedTask) {

                const total = taskList.length;

                const totalDone = taskList.filter(t => t.isDone).length;
                
                const totalRate = Number(((totalDone / total) * 100).toFixed(2));
                
                setGeneralRate(totalRate);

            } else {
                
                const selectedTotal = taskList.filter(t => t.baseId === selectedTask.baseId);
                
                const selectedCompleted = selectedTotal.filter(t => t.isDone);
                
                const selectedRate = Number(((selectedCompleted.length / selectedTotal.length) * 100).toFixed(2)); 
                
                setSelectedRate(selectedRate);
            
            }

        }, [selectedTask, taskDays]);

































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

                const start = new Date(taskList[0].start);

                const validDays = taskDays.filter(d => d >= start && d <= today);

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

                const validDays = taskDays.filter(d => d >= start && d <= today);

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

        }, [selectedTask, taskDays])





















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
                            <li onClick={() => toggleSelected(0)} className={selectedId === 0 ? 'border-bluelight' : ""}>
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
                                                {isToday ? <i className="bi bi-geo-alt text-bluet"></i> : day.getDate()}
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
                            <section className="sec-one">
                                <i className="bi-trophy "></i>
                                <p className="calculator">{amountGeneralStreak()}</p>
                                <p className="calculator-label">Top streak</p>
                            </section>
                            <section className="sec-two">
                                <i className="bi-fire"></i>
                                <p className="calculator">{amountGeneralCurrentStreak()}</p>
                                <p className="calculator-label">current streak</p>
                            </section>
                        </div>
                        <div className="bottom">
                            <section className="sec-one">
                                <i className="bi bi-check2-circle"></i>
                                <p className="calculator">{selectedTaskCount}</p>
                                <p className="calculator-label">{selectedTask ? 'Times Done' : 'Habits done'}</p>
                            </section>
                            <section className="sec-two">
                                <i className="bi-info-circle"></i>
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