import { useState, useContext, useMemo, useEffect } from "react";
import { TaskContext } from "../components/TaskContext.js";
import TaskDisplay from "../components/TaskDisplay.jsx";
import Alert from "../components/Alert.jsx";

function TaskHandler() {

    const today = new Date();
    const { taskList, setTaskList } = useContext(TaskContext);
    const [alert, setAlert] = useState(false);
    const different = 'Are you sure? This will delete all inactive tasks but could potentially affect your level on the Optima quirk. (If enabled)'
    const [selectedHandle, setSelectedHandle] = useState('all')
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

    function normalizeDate(d) {
        const newDate = new Date(d);
        return new Date(
        newDate.getFullYear(),
        newDate.getMonth(),
        newDate.getDate()
        )
    }



    const handledTasks = useMemo(() => {

        if(taskList.length === 0) return;

        const start = new Date(taskList[0].appearId);
        const days = generateDayRange(start, today);

        const validTasks = taskList.filter(task =>
            days.some(day =>
                isSameDay(task.appearId, day)
            )
        );

        const indTasks = {};
        for(const vTask of validTasks) {
            indTasks[vTask.createdId] = vTask;
        }

        return indTasks;
    }, [taskList])

    const visibleTasks = useMemo(() => {

        if(!handledTasks) return;

        if (selectedHandle === 'all') return Object.values(handledTasks);
        if (selectedHandle === 'active') return Object.values(handledTasks).filter(t => !t.isPaused);
        if (selectedHandle === 'paused') return Object.values(handledTasks).filter(t => t.isPaused);
        return Object.values(handledTasks).filter(t => normalizeDate(t.end) < normalizeDate(today));
    }, [handledTasks, selectedHandle])

    console.log("Visible tasks", visibleTasks);

    function yesDelete() {
        const newTaskList = taskList.filter(t => normalizeDate(t.end) > normalizeDate(today));
        setTaskList(newTaskList);
        setAlert(prev => !prev);
    }
    
    return ( 
        <div className="sett-body">

            <div className="task-h-header">
                <select name="all-tasks" value={selectedHandle} onChange={(e) => setSelectedHandle(e.target.value)}>
                    <option value="all">All tasks</option>
                    <option value="active">Active</option>
                    <option value="paused">Paused</option>
                    <option value="inactive">Inactive</option>
                </select>
                <button onClick={() => setAlert(prev => !prev)}>Delete Inactive</button>
            </div>

            <div className="task-h-body">
                
                <div className="task-h-box">
                    {
                        !visibleTasks || visibleTasks.length === 0 ? (
                            <p className="no-tasks">{`No ${selectedHandle === 'all' ? '' : selectedHandle === 'active' ? 'active' : selectedHandle === 'paused' ? 'paused' : 'inactive'} tasks`}</p>
                        ) : (
                            visibleTasks.map(t => {
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
                different={different}

            />}
        </div>
    );
}

export default TaskHandler;