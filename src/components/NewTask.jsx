import { useState } from "react";
import EmojiPicker from "emoji-picker-react";

//TO-DO: Save changes, delete task

function NewTask({exit, prevTasks, editedTasks, newTasks, editExit, task}) {

    const isEditingMode = !!task;    

    const [showPicker, setShowPicker] = useState(false);

    const [emojiInput, setEmojiInput] = useState(task ? task.emoji : "");
    const [nameInput, setNameInput] = useState(task ? task.name : "");
    const [colorCont, setColorCont] = useState(task ? task.color : "");
    const [taskDays, setTaskDays] = useState(task ? task.days : []);

    const [reminder, setReminder] = useState(task ? task.reminderStatus : false);

    const [hour, setHour] = useState(task && task.reminderTime ? parseInt(task.reminderTime.split(':')[0]) : 8);
    const [minute, setMinute] = useState(task && task.reminderTime ? parseInt(task.reminderTime.split(':')[1]) : 0);
    const [meridiem, setMeridiem] = useState(task && task.reminderTime ? parseInt(task.reminderTime.split(' ')[1]) : "AM");

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
        
        const missing = [];

        if (!emojiInput) missing.push("pick an emoji");
        if (!nameInput) missing.push("define your task");

        if (missing.length > 0) {
            alert(`Please ${missing.join(", ")} then create your task.`);
            return;
        }   

        const timeString = `${hour}:${minute < 10 ? "0" + minute : minute} ${meridiem}`;

        const theTask = {
            emoji: emojiInput,
            name: nameInput,
            color: colorCont,
            days: taskDays,
            reminderStatus: reminder,
            reminderTime: reminder ? timeString : null,
            isDone: false
        };
        
        newTasks(theTask);
        exit();
    }

    function editingTask() {
        
        const timeString = `${hour}:${minute < 10 ? "0" + minute : minute} ${meridiem}`;

        const editedTask = prevTasks.map(prev => prev.name === task.name ? {...prev,
            name: nameInput,
            emoji: emojiInput,
            color: colorCont,
            days: taskDays,
            reminderStatus: reminder,
            reminderTime: reminder ? timeString : null,
        } : prev)

        editedTasks(editedTask);
        editExit();

    }

    function deleteTask() {

        const tasksRemaining = prevTasks.filter(t => t.name !== task.name);
        console.log(tasksRemaining);
        editedTasks(tasksRemaining);
        editExit();

    }

    const minutes = () => Array.from({ length: 60 }, (_, i) => i);
    const hours = () => Array.from({length: 13}, (_, i) => i);

    return ( 
        <div className="new-task">
            
            {isEditingMode ? <i className="bi bi-x-circle-fill exit-new-screen cursor-pointer" onClick={editExit}></i> : <i className="bi bi-x-circle-fill exit-new-screen cursor-pointer" onClick={exit}></i>}

            <div className="new-task-container">

                <div className="task-desc">
                    <button className={`emoji-cont ${!emojiInput ? " bi bi-plus" : "text-4xl md:text-6xl"}`} value={emojiInput} onClick={clickShowPicker}>{emojiInput || ""}</button>
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
                    <h2>{reminder ? "Off reminder?" : "On reminder?"}</h2>
                    <div className={`switch-cont ${reminder && "bg-bluelight"}`} onClick={() => onReminder()}>
                        <div className={`switch-ball ease duration-400 ${reminder && "translate-x-9 md:translate-x-14"}`}></div>
                    </div>
                </div>

                {reminder && (
                    <div className="reminder-selection">
                        <h2>Set reminder</h2>
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

                <button className="addTask" onClick={isEditingMode ? () => editingTask() : () => creatingTask()}>{isEditingMode ? "Save Changes" : "Add task"}</button>
                {isEditingMode && <button className="delete-task" onClick={() => deleteTask()}>Delete task</button>}
            </div>            
        </div>
    );
}

export default NewTask;