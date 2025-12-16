import { useEffect, useState, useContext } from "react";
import NewTask from "./NewTask.jsx";
import { TaskContext } from "./TaskContext.js";
import Alert from "./Alert.jsx";

function TaskDisplay({taskE, history}) {

  const { taskList, setTaskList, tasksDone, setTasksDone } = useContext(TaskContext);
  const [done, setDone] = useState(taskE.isDone);
  const[editScreen, setEditScreen] = useState(false);

  const [alertShow, setAlertShow] = useState(false);

  function deleteTask() {
    const tasksRemaining = taskList.filter(t => t.id !== taskE.id && t.baseId !== taskE.baseId);
    setTaskList(tasksRemaining);
    setAlertShow(prev => !prev);
  }

  useEffect(() => {
    setDone(taskE.isDone)
  }, [taskE.isDone]);

  return (

    <div>
    
      <div className={!history ? "task-box" : "history-box"} style={{backgroundColor: done ? (taskE.color || "#60A5FA") : "#111111"}}>

        <div className="emoji-t-box">{taskE.emoji}</div>
        
        <p className="name-t-box" onClick={() => 
          {
            if(history) return;
            new Date(taskE.id).toDateString() !== new Date().toDateString() ? '' : setEditScreen(editScreen => !editScreen);
          }
        }>{taskE.name}</p>
        
        {
          !history ? (
          
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
        
          ) :
         
          (
            <button className="bi bi-trash" onClick={() => setAlertShow(prev => !prev)}></button>
          )
        }

        {alertShow && <Alert yesDelete={() => deleteTask()} noDelete={() => setAlertShow(prev => !prev)} history={history}/>}

      </div>

      {editScreen && <NewTask editExit={() => setEditScreen(editScreen => !editScreen)} task={taskE}/>}
    </div>
  
  );

}

export default TaskDisplay;