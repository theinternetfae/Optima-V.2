import { useState } from "react";
import NewTask from "./NewTask.jsx";

function TaskDisplay({taskE, prevTasks, editedTasks}) {

  const [done, setDone] = useState(false);
  const[editScreen, setEditScreen] = useState(false);

  return (

    <div>
    
      <div className="task-box" style={{backgroundColor: done ? (taskE.color || "#60A5FA") : "#111111"}}>

        <div className="emoji-t-box">{taskE.emoji}</div>
        
        <p className="name-t-box" onClick={() => 
          {
            setEditScreen(!editScreen);
          }
        }>{taskE.name}</p>
        
        <input type="checkbox" className="done" onClick={() => setDone(prev => !prev)}/>

      </div>

      {editScreen && <NewTask editExit={() => setEditScreen(!editScreen)} editedTasks={editedTasks} prevTasks={prevTasks} task={taskE}/>}
    </div>
  
  );

}

export default TaskDisplay;