    import React, {useContext, useState, useEffect} from "react";
    import { TaskContext } from "./components/TaskContext.js";

    // const completedCount = tasks.reduce((acc, task) => {
    //   if (task.done) acc++;
    //   return acc;
    // }, 0);

    function TaskStats() {
        const today = new Date();
        const { taskList, setTaskList } = useContext(TaskContext);
        const [taskSelected, setTaskSelected] = useState(0);
        const [selectedScroll, setSelectedScroll] = useState(0);

        const [selectedTask, setSelectedTask] = useState(null);
        const [matchingBorderDay, setMatchingBorderDay] = useState([]);

        const [taskDays, setTaskDays] = useState([]);


        function toggleSelected(id, task) {
            setSelectedScroll(id);
            setTaskSelected(id);
            setSelectedTask(task);
        }

        useEffect(() => {
            console.log('The Day:', matchingBorderDay);
        }, [matchingBorderDay]);

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
            console.log(currentMonth, monthDays,);
        }, [monthDays]);

        useEffect(() => {
            console.log(new Date().getDay());
        }, [])

        useEffect(() => {
            if (!selectedTask || !selectedTask.start || !selectedTask.end) return;

            const startDate = new Date(selectedTask.start);
            const endDate = new Date(selectedTask.end);
            const normalize = date => new Date(date.getFullYear(), date.getMonth(), date.getDate());

            const broderDays = monthDays.filter(day => {
                const d = normalize(new Date(day));

                const weekdayIndex = d.getDay();
                const weekdayNames = ["sun", "mon", "tue", "wed", "thur", "fri", "sat"];
                const weekday = weekdayNames[weekdayIndex];
                
                const isInRange = d >= normalize(startDate) && d <= normalize(endDate);
                const isMatchingDay = Array.isArray(selectedTask.days) && selectedTask.days.some(st => st && st.toString().trim().toLowerCase() === weekday);
                
                
                const matchingDayTask = selectedTask.days.filter(st => st.toLowerCase() === weekday)
                console.log(isMatchingDay);
                console.log(matchingDayTask);

                return isInRange && isMatchingDay;
            });
                
            setMatchingBorderDay(broderDays);

        }, [selectedTask, monthDays])

        useEffect(() => {
            console.log(selectedTask)
        }, [ selectedTask ])

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

        return ( 
            <div className="full-stats-cont">

                <div className="stats-header">
                    <button className="bi bi-lightbulb-fill tips"></button>
                    <select name="task-selected" value={taskSelected} onChange={e => {
                        
                        uniqueTasks.forEach(task => {
                            Number(e.target.value) === task.baseId ? toggleSelected(Number(e.target.value), task) : Number(e.target.value) === 0 && toggleSelected(Number(e.target.value));
                        })

                        console.log(Number(e.target.value));
                        // toggleSelected(Number(e.target.value), task);
                    
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
                            <li onClick={() => toggleSelected(0)} className={selectedScroll === 0 ? 'border-bluelight' : ""}>
                                <span>📚</span> {selectedScroll === 0 && <span>Overall</span>}
                            </li>
                        </div>


                        {
                            uniqueTasks.map((task, index) => (
                                <div key={index} className="li-cont">
                                    <li onClick={() => toggleSelected(task.baseId, task)} style={selectedScroll === task.baseId ? { border: `2px solid ${task.color}` } : {}}>
                                        {task.emoji} {selectedScroll === task.baseId && <span>{cutWords(task.name)}</span>}
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

                                {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d, i) => (
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
                                <i className="bi bi-award"></i>
                                <p className="calculator">0 days</p>
                                <p className="calculator-label">Top streak</p>
                            </section>
                            <section className="sec-two">
                                <i className="bi-trophy"></i>
                                <p className="calculator">0 days</p>
                                <p className="calculator-label">Perfect days</p>
                            </section>
                        </div>
                        <div className="bottom">
                            <section className="sec-one">
                                <i className="bi bi-check2-circle"></i>
                                <p className="calculator">0</p>
                                <p className="calculator-label">Habits done</p>
                            </section>
                            <section className="sec-two">
                                <i className="bi bi-activity"></i>
                                <p className="calculator">0</p>
                                <p className="calculator-label">Daily average</p>
                            </section>
                        </div>
                    </div>

                </div>

            </div> 
        );
    }

    export default TaskStats;