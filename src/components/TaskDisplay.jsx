import { useEffect, useState, useContext } from "react";
import NewTask from "./NewTask.jsx";
import { TaskContext, SettingsContext } from "./TaskContext.js";
import Alert from "./Alert.jsx";
import db from "../appwrite/databases.js";

function TaskDisplay({taskE, history, handler, chosenHist, setChosenHist, limitReached}) {

  const { taskList, setTaskList, updateTasks, setTasksDone, userData } = useContext(TaskContext);
  const { level } = useContext(SettingsContext);
  
  function normalizeDate(d) {
    const newDate = new Date(d);
    return new Date(
      newDate.getFullYear(),
      newDate.getMonth(),
      newDate.getDate()
    )
  }

  const today = new Date();

  const [done, setDone] = useState(taskE.isDone);
  const[editScreen, setEditScreen] = useState(false);

  const [alertShow, setAlertShow] = useState(false);

  async function deleteTask() {
    const tasksRemaining = taskList.filter(t => t.$id !== taskE.$id);
    setTaskList(tasksRemaining);
    db.tasks.delete(taskE.$id).catch(err => console.log("Deleting task in TaskDisplay:", err));
    setAlertShow(prev => !prev);
  }

  const expired = normalizeDate(taskE.end) < normalizeDate(today);


  function dateConverter(convertDate) {
    const adding = (n) => n < 9 ? 0 : '';

    const toDbString = `${convertDate.getFullYear()}-${`${adding(convertDate.getMonth())}${convertDate.getMonth() + 1}`}-${`${adding(convertDate.getDate())}${convertDate.getDate()}`}`;
    
    console.log(new Date(), "VS", new Date().getTime(), "VS", toDbString);
    return toDbString;
  }
    

  function pausePlay() {
    
    if(taskE.isPaused) {
      const newEnd = new Date();
      newEnd.setDate(newEnd.getDate() + 30);
      
      const newEndString = dateConverter(newEnd); 

      const playedTask = {...taskE,
        isPaused: false,
        end: newEndString,
      }

      updateTasks(playedTask);
    } else {

      const newEnd = new Date();
      const newEndString = dateConverter(newEnd);

      const pausedTask = {...taskE, 
        isPaused: true,
        end: newEndString
      }

      updateTasks(pausedTask);
    }

  }

  useEffect(() => {
    setDone(taskE.isDone)
  }, [taskE.isDone]);

  return (

    <div>
    
      <div className={history ? "history-box" : handler ? "handler-box" : "task-box"} style={{
        backgroundColor: (!handler) && (done && (taskE.color || "#60A5FA")),
      }} onClick={(e) => {
        if(e.target.closest('button')) return;
        if (history) setChosenHist(taskE);
      }}>

        <div className="emoji-t-box">{taskE.emoji}</div>
        
        <p className="name-t-box" onClick={() => {
        
          if(history) return;
          if(handler) return;
          new Date(taskE.appearId).toDateString() !== new Date().toDateString() ? '' : setEditScreen(editScreen => !editScreen);

        }}>{taskE.name}</p>
        
        {
          history ? (

            <div className="done-box">
              <button className={`bi bi-star-fill commit ${taskE.isCommited ? 'text-yellow' : 'text-grey'}`} onClick={(() => alert('Go to home to edit commitments'))}></button>
              <button className="bi bi-trash" onClick={(e) => {
                e.stopPropagation();
                setAlertShow(prev => !prev);
              }}></button>
            </div>
            
        
          ) :

          handler ? (
            <div className={`handler-icons ${expired && 'justify-end'}`}>
              {expired ? '' : 

                <button className={`pause-play ${expired ? 'bi bi-arrow-repeat' : taskE.isPaused ? 'bi bi-play-fill' : 'bi bi-pause-fill'}`} title={`${expired ? 'Repeat task cycle' : taskE.isPaused ? 'Play task' : 'Pause task'}`}
                
                  onClick={() => pausePlay()}

                ></button>
              
              }
              <button className="bi bi-pencil" title="Edit task" onClick={() => setEditScreen(editScreen => !editScreen)}></button>
            </div>
          ) :
         
          (
            <div className={`done-box ${!userData.quirk && 'justify-end'}`}>

              {userData.quirk && 
                <button className={`bi bi-star-fill commit ${taskE.isCommited && 'text-yellow'} ${new Date(taskE.appearId).toDateString() !== new Date().toDateString() && !taskE.isCommited || limitReached && !taskE.isCommited ? 'text-grey cursor-not-allowed' : ''}`}
                
                  onClick={() => {
                    
                    if (limitReached && !taskE.isCommited && new Date(taskE.appearId).toDateString() === new Date().toDateString()) {
         
                      if (level === 3) {
                        alert('You are at the highest level! Optima advises commiting to a maximum of eight tasks a day. Doing great.')
                      } else {
                        alert('At level one you can only commit to two tasks a day. Finish your tasks consistently to level up!');
                      }
                      
                      return;
                    }

                    if (new Date(taskE.appearId).toDateString() !== new Date().toDateString()) return;
                  
                    const newCommited = !taskE.isCommited;

                    const updatedCommitment = { ...taskE, isCommited: newCommited };

                    setTaskList(prev => 
                      prev.map(c => 
                        c.$id === taskE.$id ? updatedCommitment : c
                      )
                    );

                    db.tasks.update(taskE.$id, {isCommited: newCommited}).catch(err => console.log("Updating isCommited:", err))

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
                      t.$id === taskE.$id ? updatedTask : t
                    )
                  );

                  db.tasks.update(taskE.$id, {isDone: newDone}).catch(err => console.log("Updating isDone:", err))

                  if (newDone === true) { 
                    setTasksDone(prev => [...prev, updatedTask])
                  } else {
                    setTasksDone(prev => prev.filter(t => t.appearId !== taskE.appearId));
                  }
              }} disabled={new Date(taskE.appearId).toDateString() !== new Date().toDateString()}/>

            </div>
          )
          
        }

        {alertShow && <Alert yesDelete={() => deleteTask()} noDelete={() => setAlertShow(prev => !prev)}/>}
      </div>

      {editScreen && <NewTask editExit={() => setEditScreen(editScreen => !editScreen)} task={taskE}/>}
    </div>
  
  );

}

export default TaskDisplay;