import { useEffect, useState, useContext } from "react";
import NewTask from "./NewTask.jsx";
import { TaskContext, SettingsContext } from "./TaskContext.js";
import Alert from "./Alert.jsx";

function TaskDisplay({taskE, history, handler, chosenHist, setChosenHist, limitReached}) {

  const { taskList, setTaskList, setTasksDone } = useContext(TaskContext);
  const { optimaQuirk, level } = useContext(SettingsContext);
  

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

  const isChosenHist = chosenHist?.keyUUID === taskE.keyUUID;

  return (

    <div>
    
      <div className={history ? "history-box" : handler ? "handler-box" : "task-box"} style={{
        backgroundColor: (!history && !handler) && (done && (taskE.color || "#60A5FA")),
        border: isChosenHist ? `2px solid ${taskE.color}` : ''
      }} onClick={(e) => {
        if(e.target.closest('button')) return;
        if (history) setChosenHist(taskE);
      }}>

        <div className="emoji-t-box">{taskE.emoji}</div>
        
        <p className="name-t-box" onClick={() => {
        
          if(history) return;
          new Date(taskE.id).toDateString() !== new Date().toDateString() ? '' : setEditScreen(editScreen => !editScreen)

        }}>{taskE.name}</p>
        
        {
          history ? (

            <button className="bi bi-trash" onClick={(e) => {
              e.stopPropagation();
              setAlertShow(prev => !prev);
            }}></button>
        
          ) :

          handler ? (
            <div className="handler-icons">
              <button className="bi bi-pause-fill" title="Pause task"></button>
              <button className="bi bi-pencil" title="Edit task"></button>
            </div>
          ) :
         
          (
            <div className={`done-box ${!optimaQuirk && 'justify-end'}`}>

              {optimaQuirk && 
                <button className={`bi bi-star-fill commit ${taskE.isCommited && 'text-yellow'} ${new Date(taskE.id).toDateString() !== new Date().toDateString() && !taskE.isCommited || limitReached && !taskE.isCommited ? 'text-grey cursor-not-allowed' : ''}`}
                
                  onClick={() => {
                    
                    if (limitReached && !taskE.isCommited && new Date(taskE.id).toDateString() === new Date().toDateString()) {
         
                      if (level === 3) {
                        alert('You are at the highest level! Optima advises commiting to a maximum of eight tasks a day. Doing great.')
                      } else {
                        alert('You can not commit to any more tasks today. Finish your tasks consistently to level up!');
                      }
                      
                      return;
                    }

                    if (new Date(taskE.id).toDateString() !== new Date().toDateString()) {
                      
                      alert('You can not commit to tasks that are not set for today.')
                      
                      return;
                    };
                  
                    const newCommited = !taskE.isCommited;

                    const updatedCommitment = { ...taskE, isCommited: newCommited };

                    setTaskList(prev => 
                      prev.map(c => 
                        c.keyUUID === taskE.keyUUID ? updatedCommitment : c
                      )
                    );

                  }}

                ></button>
              }

              <input type="checkbox"
                className="done"
                checked={taskE.isDone}
                onChange={() => {
  
                  const newDone = !taskE.isDone;

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
          )
          
        }

        {alertShow && <Alert yesDelete={() => deleteTask()} noDelete={() => setAlertShow(prev => !prev)} history={history}/>}
      </div>

      {editScreen && <NewTask editExit={() => setEditScreen(editScreen => !editScreen)} task={taskE}/>}
    </div>
  
  );

}

export default TaskDisplay;