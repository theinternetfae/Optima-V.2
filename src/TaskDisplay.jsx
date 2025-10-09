import { useState } from "react";

function TaskDisplay({emoji, name, color}) {

    const [done, setDone] = useState(false);

    return (

    <div className="task-box" style={{backgroundColor: done ? (color || "#60A5FA") : "#111111",}}>

      <div className="emoji-t-box">{emoji}</div>
      
      <p className="name-t-box">{name}</p>
      
      <input type="checkbox" className="done" onClick={() => setDone(prev => !prev)}/>

    </div>

    );
}

export default TaskDisplay;