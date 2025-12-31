import { useState, useContext, useMemo, useEffect } from "react";
import { TaskContext } from "../components/TaskContext.js";
import TaskDisplay from "../components/TaskDisplay.jsx";
import Alert from "../components/Alert.jsx";

function TaskHandler() {

    const today = new Date();
    const { taskList, setTaskList } = useContext(TaskContext);
    const [alert, setAlert] = useState(false);
    const handler = true;

    
    function addDays(date, days) {
        return new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate() + days
        );
    }




    //HELPER FUNCTIONS
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

    function isSameDay(a, b) {
        return new Date(a).toDateString() === new Date(b).toDateString();
    }

    const handledTasks = useMemo(() => {

        if(taskList.length === 0) return;

        const start = new Date(taskList[0].id);
        const days = generateDayRange(start, today);

        const validTasks = taskList.filter(task =>
            days.some(day =>
                isSameDay(task.id, day)
            )
        );

        const indTasks = {};
        for(const vTask of validTasks) {
            indTasks[vTask.baseId] = vTask;
        }

        return indTasks;
    }, [taskList])

    useEffect(() => {
        
        if(!handledTasks) return;

        const dates = Object.values(handledTasks).map(ht => {
            const d = new Date(ht.id).toDateString();
            return d;
        })
        console.log(dates);

    }, [handledTasks]);

    function yesDelete() {
        setTaskList([]);
        setAlert(prev => !prev);
    }
    
    return ( 
        <div className="sett-body">

            <div className="task-h-header">
                <select name="all-tasks" id="">
                    <option value="all-tasks">All tasks</option>
                    <option value="active">Active</option>
                    <option value="paused">Paused</option>
                    <option value="inactive">Inactive</option>
                </select>
                <button onClick={() => setAlert(prev => !prev)}>Delete all</button>
            </div>

            <div className="task-h-body">
                
                <div className="task-h-box">
                    {
                        !handledTasks ? (
                            <p className="no-tasks">No tasks</p>
                        ) : (
                            Object.values(handledTasks).map(t => {
                            return <TaskDisplay 
                                    key={t.keyUUID}
                                    taskE={t}
                                    handler={handler}
                                />
                            })

                        )
                    }
                </div>

            </div>
        
            {alert && <Alert
            
                yesDelete={() => yesDelete()}
                noDelete={() => setAlert(prev => !prev)}

            />}
        </div>
    );
}

export default TaskHandler;