import { useEffect, useState, useContext } from "react";
import NewTask from "./NewTask.jsx";
import { TaskContext } from "./TaskContext.js";

function TaskDisplay({taskE}) {

  const { taskList, setTaskList, tasksDone, setTasksDone } = useContext(TaskContext);
  const [done, setDone] = useState(taskE.isDone);
  const[editScreen, setEditScreen] = useState(false);

  useEffect(() => {
    setDone(taskE.isDone)
  }, [taskE.isDone]);

  useEffect(() => {
    console.log('Tasks Done:', tasksDone);
  }, [tasksDone]);

  return (

    <div>
    
      <div className="task-box" style={{backgroundColor: done ? (taskE.color || "#60A5FA") : "#111111"}}>

        <div className="emoji-t-box">{taskE.emoji}</div>
        
        <p className="name-t-box" onClick={() => 
          {
            new Date(taskE.id).toDateString() !== new Date().toDateString() ? '' : setEditScreen(editScreen => !editScreen);
          }
        }>{taskE.name}</p>
        
        <input type="checkbox" className="done" checked={done} onChange={() => {
          const newDone = !done
          setDone(newDone);

          const updatedTask = { ...taskE, isDone: newDone };

          setTaskList(prev =>
            prev.map(t =>
              t.keyUUID === taskE.keyUUID ? updatedTask : t
            )
          );

          if (newDone === true) { 
            setTasksDone(prev => [...prev, updatedTask])
          } else {
            setTasksDone(prev => prev.filter(t => t.id !== taskE.id));
          }
          
          
        }} disabled={new Date(taskE.id).toDateString() !== new Date().toDateString()}/>

      </div>

      {editScreen && <NewTask editExit={() => setEditScreen(editScreen => !editScreen)} task={taskE}/>}
    </div>
  
  );

}

export default TaskDisplay;