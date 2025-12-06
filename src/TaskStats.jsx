    import React, {useContext, useState, useEffect} from "react";
    import { TaskContext } from "./components/TaskContext.js";

    function TaskStats() {
        const today = new Date();
        const { taskList, setTaskList, tasksDone, setTasksDone } = useContext(TaskContext);

        const [selectedId, setSelectedId] = useState(0);

        const [selectedTask, setSelectedTask] = useState(null);
        const [selectedTaskCount, setSelectedTaskCount] = useState(0);

        const [selectedTaskStreaks, setSelectedTaskStreaks] = useState([]);
        const [generalStreak, setGeneralStreak] = useState([]);

        const [currentStreak, setCurrentStreak] = useState(0);
        const [generalCurrentStreak, setGeneralCurrentStreak] = useState(0);

        const [selectedAverage, setSelectedAverage] = useState(0);
        const [generalAverage, setGeneralAverage] = useState(0);

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
                const normalizeDate = date => new Date(date).toDateString();

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

                const normalizeDate = date => new Date(date).toDateString();

                const start = new Date(taskList[0].start);
                const end = new Date(taskList[taskList.length - 1].end);

                const validDays = taskDays.filter(d => d >= start && d <= end);
                
                const overallTaskDays = validDays.reduce((acc, d) => {

                    const tasksNDays = taskList.filter(tl => normalizeDate(tl.id) === normalizeDate(d));
                    
                    acc.push(tasksNDays);

                    return acc;

                }, [])

                const totalTaskDays = overallTaskDays.filter(td => td.length > 0);
                const completedTasks = overallTaskDays.filter(t => t.length > 0 && t.every(td => td.isDone)); 
               
                const generalAverage = (completedTasks.length / totalTaskDays.length) * 100;
                setGeneralAverage(Number(generalAverage.toFixed(2)));

            } else {
                
                const validTasks = taskList.filter(t => t.baseId === selectedTask.baseId);
                
                const completedTasks = validTasks.filter(t => t.isDone);

                const average = (completedTasks.length / validTasks.length) * 100; 

                setSelectedAverage(Number(average.toFixed(2)));
            
            }

        }, [selectedTask, taskDays]);

































        useEffect(() => {

            if (!selectedTask) {
                setSelectedTaskCount(tasksDone.length);
                return;
            };

            const uniqueDone = taskList.filter(tl => tl.baseId === selectedTask.baseId && tl.isDone === true && selectedTask.isDone === true);
            setSelectedTaskCount(uniqueDone.length);
            
        }, [selectedTask])


        useEffect(() => {

            if(!selectedTask) {

                const normalizeDate = date => new Date(date).toDateString();

                const start = new Date(taskList[0].start);
                const end = new Date();

                const validDays = taskDays.filter(d => d >= start && d <= end);
                
                const generalStreak = validDays.reduce((acc, d) => {

                    const tasksNDays = taskList.filter(tl => normalizeDate(tl.id) === normalizeDate(d));

                    // console.log(tasksNDays.length > 0 && tasksNDays.every(td => td.isDone));
                    // console.log(tasksNDays.length > 0 && tasksNDays.some(td => !td.isDone));

                    if(tasksNDays.length > 0 && tasksNDays.every(td => td.isDone)) {
                        acc++;
                    } else if (tasksNDays.length > 0 && tasksNDays.some(td => td.isDone === false)) {
                        acc = 0;
                    }

                    return acc;

                }, 0)

                setGeneralCurrentStreak(generalStreak);

            } else {

                const tasksToCalculate = taskList.filter(t => t.baseId === selectedTask.baseId);

                const normalizeDate = date => new Date(date).toDateString();

                const start = new Date(tasksToCalculate[0].start);
                // const testEnd = new Date(tasksToCalculate[tasksToCalculate.length - 1].end);
                const end = new Date();

                const validDays = taskDays.filter(d => d >= start && d <= end);
                const validTasks = tasksToCalculate.filter(tc => normalizeDate(tc.id) >= normalizeDate(start) && normalizeDate(tc.id) <= normalizeDate(end));

                const currentStreak = validDays.reduce((acc, d) => {

                    validTasks.filter(tl => {
                        if(tl.isDone){
                            acc++;    
                        } else {
                            acc = 0;
                        }
                    });

                    return acc;

                }, 0)

                setCurrentStreak(currentStreak);

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
                            <p className="rating">0.00%</p>
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
                                <p className="calculator-label">Habits done</p>
                            </section>
                            <section className="sec-two">
                                <i className="bi bi-activity"></i>
                                <p className="calculator">{selectedTask ? selectedAverage : generalAverage}%</p>
                                <p className="calculator-label">Daily average</p>
                            </section>
                        </div>
                    </div>

                </div>

            </div> 
        );
    }

    export default TaskStats;