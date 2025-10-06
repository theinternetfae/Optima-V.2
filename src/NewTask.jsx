import { useState } from "react";
import EmojiPicker from "emoji-picker-react";

function NewTask({exit}) {

    const [showPicker, setShowPicker] = useState(false);

    const [emojiInput, setEmojiInput] = useState("");
    const [nameInput, setNameInput] = useState("");
    const [taskDays, setTaskDays] = useState([]);
    const [taskPeriod, setTaskPeriod] = useState([]);
    const [reminder, setReminder] = useState(false);

    const [tasks, setTasks] = useState([]);

    function clickShowPicker() {
        setShowPicker(prev => !prev);
    }

    function onReminder() {
        setReminder(prev => !prev);
    }

    return ( 
        <div className="new-task">
            
            <i className="bi bi-x-circle-fill exit-new-screen cursor-pointer" onClick={exit}></i>

            <div className="new-task-container">

                <div className="task-desc">
                    <button className={`emoji-cont ${!emojiInput ? " bi bi-plus" : "text-6xl"}`} onClick={clickShowPicker}>{emojiInput || ""}</button>
                    <input type="text" placeholder="What to do?" className="name-input" />
                    
                    {showPicker && <EmojiPicker onEmojiClick={(emojiData) => {
                        setEmojiInput(emojiData.emoji);
                        clickShowPicker();
                    }} />}
                </div>

                <div className="goal-value">
                    <h2>Task days</h2>
                    <ul>
                        <li>Mon</li>
                        <li>Tue</li>
                        <li>Wed</li>
                        <li>Thur</li>
                        <li>Fri</li>
                        <li>Sat</li>
                        <li>Sun</li>
                    </ul>
                </div>

                <div className="reminder-selection">
                    <h2>Task period</h2>
                    <ul>
                        <li>Anytime</li>
                        <li>Morning</li>
                        <li>Afternoon</li>
                        <li>Evening</li>
                    </ul>
                </div>
                
                <div className="reminder">
                    <h2>Turn on reminder?</h2>
                    <div className={`switch-cont ${reminder && "bg-bluelight"}`} onClick={() => onReminder()}>
                        <div className={`switch-ball ease duration-400 ${reminder && "translate-x-14"}`}></div>
                    </div>
                </div>

                <button className="addTask">Add Task</button>
            </div>            
        </div>
    );
}

export default NewTask;