import { useEffect, useState } from "react";
import NewTask from "./NewTask.jsx";

function TaskDisplay({taskE, prevTasks, editedTasks}) {

  const [done, setDone] = useState(taskE.isDone);
  const[editScreen, setEditScreen] = useState(false);

  useEffect(() => {
    setDone(taskE.isDone)
  }, [taskE.isDone]);

  return (

    <div>
    
      <div className="task-box" style={{backgroundColor: done ? (taskE.color || "#60A5FA") : "#111111"}}>

        <div className="emoji-t-box">{taskE.emoji}</div>
        
        <p className="name-t-box" onClick={() => 
          {
            setEditScreen(!editScreen);
          }
        }>{taskE.name}</p>
        
        <input type="checkbox" className="done" checked={done} onChange={() => {
          const newDone = !done
          setDone(newDone);

          const doneTask = prevTasks.map(prev => prev.name === taskE.name ? { ...prev, isDone: newDone} : prev);

          editedTasks(doneTask);

        }}/>

      </div>

      {editScreen && <NewTask editExit={() => setEditScreen(!editScreen)} editedTasks={editedTasks} prevTasks={prevTasks} task={taskE}/>}
    </div>
  
  );

}

export default TaskDisplay;