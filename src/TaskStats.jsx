import React, {useContext, useState} from "react";
import { TaskContext } from "./components/TaskContext.js";

// const completedCount = tasks.reduce((acc, task) => {
//   if (task.done) acc++;
//   return acc;
// }, 0);

function TaskStats() {

    const { taskList, setTaskList } = useContext(TaskContext);
    const [taskSelected, setTaskSelected] = useState(0);
    const [selectedScroll, setSelectedScroll] = useState(0);

    function toggleSelected(id) {
        setSelectedScroll(id);
        setTaskSelected(id);
    }

    const uniqueTasks = Object.values(
        taskList.reduce((acc, task) => {
            if(!acc[task.baseId] && task.days.length > 0) acc[task.baseId] = task;
            return acc;
        }, {})
    )

    function cutWords(text, limit = 2) {
        const words = text.split(" ");
        if (words.length <= limit) return text; 
        return words.slice(0, limit).join(" ") + "...";
    }

    function getDaysFor() {
        const resultDays = [];
        const start = new Date(today);
    }

    return ( 
        <div className="full-stats-cont">

            <div className="stats-header">
                <button className="bi bi-lightbulb-fill tips"></button>
                <select name="task-selected" value={taskSelected} onChange={e => toggleSelected(Number(e.target.value))} className="task-selected">         
                    
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
                                <li onClick={() => toggleSelected(task.baseId)} className={selectedScroll === task.baseId ? 'border-bluelight' : ""}>
                                    {task.emoji} {selectedScroll === task.baseId && <span>{cutWords(task.name)}</span>}
                                </li>
                            </div>
                        ))

                    }

                </ul>
            </div>

        </div> 
    );
}

export default TaskStats;