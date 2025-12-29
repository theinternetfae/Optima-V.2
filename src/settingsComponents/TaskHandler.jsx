import { useState, useContext } from "react";
import { TaskContext } from "../components/TaskContext";
import TaskDisplay from "../components/TaskDisplay";

function TaskHandler() {

    const { taskList } = useContext(TaskContext);
    const handler = true;

    return ( 
        <div className="sett-body">
            

            <div className="task-h-header">
                <select name="all-tasks" id="">
                    <option value="all-tasks">All tasks</option>
                    <option value="active">Active</option>
                    <option value="paused">Paused</option>
                    <option value="inactive">Inactive</option>
                </select>
                <button>Delete all</button>
            </div>

            <div className="task-h-body">
                
                <div className="task-h-box">
                    {
                        taskList.map(t => {
                            return <TaskDisplay 
                                key={t.keyUUID}
                                taskE={t}
                                handler={handler}
                            />
                        })
                    }
                </div>

            </div>
        
        
        </div>
    );
}

export default TaskHandler;