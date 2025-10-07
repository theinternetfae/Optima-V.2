import { useState } from "react";
import EmojiPicker from "emoji-picker-react";

function NewTask({exit, newTasks}) {

    const [showPicker, setShowPicker] = useState(false);

    const [emojiInput, setEmojiInput] = useState("");
    const [nameInput, setNameInput] = useState("");
    const [colorCont, setColorCont] = useState("");
    const [taskDays, setTaskDays] = useState([]);

    const [reminder, setReminder] = useState(false);

    const [hour, setHour] = useState(0);
    const [minute, setMinute] = useState(0);
    const [meridiem, setMeridiem] = useState("AM");

    function clickShowPicker() {
        setShowPicker(prev => !prev);
    }

    function selectDays(value) {
        setTaskDays(t => t.includes(value) ? t.filter(task => task !== value) : [...t, value]);
    }

    function onReminder() {
        setReminder(prev => !prev);
    }

    function creatingTask() {
        const timeString = `${hour}:${minute < 10 ? "0" + minute : minute} ${meridiem}`;
        const theTask = {
            emoji: emojiInput,
            name: nameInput,
            color: colorCont,
            days: taskDays,
            reminderTime: reminder ? timeString : null
        };

        newTasks(theTask);
        exit();
    }

    const minutes = () => Array.from({ length: 60 }, (_, i) => i);
    const hours = () => Array.from({length: 13}, (_, i) => i);

    return ( 
        <div className="new-task">
            
            <i className="bi bi-x-circle-fill exit-new-screen cursor-pointer" onClick={exit}></i>

            <div className="new-task-container">

                <div className="task-desc">
                    <button className={`emoji-cont ${!emojiInput ? " bi bi-plus" : "text-6xl"}`} value={emojiInput} onClick={clickShowPicker}>{emojiInput || ""}</button>
                    <input type="text" placeholder="What to do?" value={nameInput} onChange={e => setNameInput(e.target.value)} className="name-input" />
                    
                    {showPicker && <EmojiPicker onEmojiClick={(emojiData) => {
                        setEmojiInput(emojiData.emoji);
                        clickShowPicker();
                    }} />}
                </div>

                <div className="color-value">
                    <h2>Color</h2>
                    <input type="color" value={colorCont} className="pick-color" onChange={e => setColorCont(e.target.value)}/>
                </div>

                <div className="goal-value">
                    <h2>Task days</h2>
                    <ul>
                        {["Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"].map(day => (
                            <li key={day} onClick={() => selectDays(day)} className={taskDays.includes(day) ? "border-bluelight" : ""}>{day}</li>
                        ))}
                    </ul>
                </div>

                <div className="reminder">
                    <h2>Turn on reminder?</h2>
                    <div className={`switch-cont ${reminder && "bg-bluelight"}`} onClick={() => onReminder()}>
                        <div className={`switch-ball ease duration-400 ${reminder && "translate-x-14"}`}></div>
                    </div>
                </div>

                {reminder && (
                    <div className="reminder-selection">
                        <h2>Task reminder</h2>
                        <div className="the-time">

                            <select value={hour} onChange={(e) => setHour(Number(e.target.value))}>
                                {hours().map(h => (
                                    <option key={h} value={h} hidden={h === 0}>{h < 10 ? `0${h}` : h}</option>
                                ))}
                            </select>
                            
                            <select value={minute} onChange={(e) => setMinute(Number(e.target.value))}>
                                {minutes().map(m => (
                                    <option key={m} value={m} hidden={m === 0}>{m < 10 ? `0${m}` : m}</option>
                                ))}
                            </select>
                            
                            <select name="time" value={meridiem} onChange={(e) => setMeridiem(e.target.value)}>
                                <option value="AM">AM</option>
                                <option value="PM">PM</option>
                            </select>
                        
                        </div>
                    </div>
                )}

                <button className="addTask" onClick={() => creatingTask()}>Add Task</button>
            </div>            
        </div>
    );
}

export default NewTask;