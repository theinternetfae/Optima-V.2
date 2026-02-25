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



    //HELPER FUNCTIONS

    function normalizeDate(d) {
        const newDate = new Date(d);
        return new Date(
        newDate.getFullYear(),
        newDate.getMonth(),
        newDate.getDate()
        )
    }


    useEffect(() => {
        console.log("Showing taskList in TaskHandler:", taskList);
    });


    const handledTasks = useMemo(() => {

        if(!taskList.length) return {};

        const normalizeToday = today.getTime();
        const indTasks = {};
        
        for(const task of taskList) {
            const id = task.createdId;
            const taskDate = new Date(task.appearId).getTime();

            if (taskDate <= normalizeToday) {
                indTasks[id] = task;
            } else if(!indTasks[id]) {
                indTasks[id] = task;
            }
        }

        return indTasks;
    }, [taskList, today]);


    const visibleTasks = useMemo(() => {

        if(!handledTasks) return;

        if (selectedHandle === 'all') return Object.values(handledTasks);
        if (selectedHandle === 'active') return Object.values(handledTasks).filter(t => !t.isPaused);
        if (selectedHandle === 'paused') return Object.values(handledTasks).filter(t => t.isPaused);
        return Object.values(handledTasks).filter(t => normalizeDate(t.end) < normalizeDate(today));
    }, [handledTasks, selectedHandle])


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
                                    key={t.$id}
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