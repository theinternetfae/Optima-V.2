import { useState, useContext, useEffect } from "react";
import Emoji from "./EmojiPicker.jsx";
// import EmojiPicker from "emoji-picker-react";
import Alert from "./Alert.jsx";
import { TaskContext } from "./TaskContext.js";


function NewTask({exit, editExit, task}) {

    const { taskList, setTaskList, saveEditedTask } = useContext(TaskContext);

    const isEditingMode = !!task;    

    const [showPicker, setShowPicker] = useState(false);
    const [alertShow, setAlertShow] = useState(false);

    const [emojiInput, setEmojiInput] = useState(task ? task.emoji : "");
    const [nameInput, setNameInput] = useState(task ? task.name : "");
    const [colorCont, setColorCont] = useState(task ? task.color : "");
    const [taskDays, setTaskDays] = useState(task ? task.days : []);

    const today = new Date().toLocaleDateString("en-CA");
    const [startDate, setStartDate] = useState(task ? task.start : today);
    const [endDate, setEndDate] = useState(task ? task.end : today);

    const [reminder, setReminder] = useState(task ? task.reminderStatus : false);

    const [hour, setHour] = useState(task && task.reminderTime ? parseInt(task.reminderTime.split(':')[0]) : 8);
    const [minute, setMinute] = useState(task && task.reminderTime ? parseInt(task.reminderTime.split(':')[1]) : 0);
    const [meridiem, setMeridiem] = useState(task && task.reminderTime ? task.reminderTime.split(' ')[1] : "AM");

    const timeString = `${hour}:${String(minute).padStart(2, "0")} ${meridiem}`;

    function clickShowPicker() {
        setShowPicker(prev => !prev);
    }

    function selectDays(value) {
        setTaskDays(t => t.includes(value) ? t.filter(task => task !== value) : [...t, value]);
    }

    function creatingTask() {
        
        const missing = [];

        if (!emojiInput) missing.push("pick an emoji");
        if (!nameInput) missing.push("define your task");

        if (missing.length > 0) {
            alert(`Please ${missing.join(", ")} then create your task.`);
            return;
        }   

        if (new Date(startDate) < new Date(today) || new Date(endDate) < new Date(today)) {
            alert("Selected dates cannot be in the past.");
            return;
        }

        const theTask = {
            id: Date.now(),
            baseId: Date.now(),
            keyUUID: crypto.randomUUID(),
            start: startDate,
            end: endDate,
            emoji: emojiInput,
            name: nameInput,
            color: colorCont,
            days: taskDays,
            reminderStatus: reminder,
            reminderTime: reminder ? timeString : null,
            isDone: false
        };

        saveEditedTask(theTask);
        // setTaskList(prev => [...prev, theTask])
        exit();
    }

    function editingTask() {
        
        const missing = [];

        if (!emojiInput) missing.push("pick an emoji");
        if (!nameInput) missing.push("define your task");

        if (missing.length > 0) {
            alert(`Please ${missing.join(", ")} then create your task.`);
            return;
        }   

        if (new Date(startDate) < new Date(today) || new Date(endDate) < new Date(today)) {
            alert("Selected dates cannot be in the past.");
            return;
        }

        const editedTask = {
            ...task,
            keyUUID: crypto.randomUUID(),
            start: startDate,
            end: endDate,
            name: nameInput,
            emoji: emojiInput,
            color: colorCont,
            days: taskDays,
            reminderStatus: reminder,
            reminderTime: reminder ? timeString : null,
        }        

        saveEditedTask(editedTask);
        editExit();

    }

    function deleteTask() {

        const tasksRemaining = taskList.filter(t => t.id !== task.id && t.baseId !== task.baseId);
        setTaskList(tasksRemaining);;
        editExit();

    }

    const minutes = () => Array.from({ length: 60 }, (_, i) => i);
    const hours = () => Array.from({length: 13}, (_, i) => i);


    useEffect(() => {
        function handleAddTask(e) {
            if(e.key === 'Enter') {
                console.log('Enter pressed globally!');
                if(isEditingMode) editingTask();
                else creatingTask();
            }

            if(e.key === "Escape" || e.key === "Esc" || e.code === "Escape" || e.keyCode === 27) {
                console.log('Exited!');
                if(isEditingMode) editExit();
                else exit();
            }
        }

        window.addEventListener('keydown', handleAddTask);

        return () => window.removeEventListener('keydown', handleAddTask);
    });

    return ( 
        <div className="new-task">
            
            {isEditingMode ? <i className="bi bi-x-circle-fill exit-edit-screen cursor-pointer" onClick={editExit}></i> : <i className="bi bi-x-circle-fill exit-new-screen cursor-pointer" onClick={exit}></i>}

            <div className="new-task-container">

                <div className="task-desc">
                    <button className={`emoji-cont ${!emojiInput ? " bi bi-plus" : "text-4xl md:text-6xl"}`} value={emojiInput} onClick={clickShowPicker}>{emojiInput || ""}</button>
                    <input type="text" placeholder="What to do?" value={nameInput} onChange={e => setNameInput(e.target.value)} className="name-input" />

                    {
                        showPicker && <Emoji 
                            setting={setEmojiInput}
                            showing={clickShowPicker}
                        />
                    }
                    {/* {showPicker && <EmojiPicker onEmojiClick={(emojiData) => {
                        setEmojiInput(emojiData.emoji);
                        clickShowPicker();
                    }} />} */}
                </div>

                <div className="color-value">
                    <h2>Color</h2>
                    <input type="color" value={colorCont} className="pick-color" onChange={e => setColorCont(e.target.value)}/>
                </div>

                <div className="goal-value">
                    <h2>Task days</h2>
                    <ul>
                        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(day => (
                            <li key={day} onClick={() => selectDays(day)} className={taskDays.includes(day) ? "border-accentmain" : ""}>{day}</li>
                        ))}
                    </ul>
                </div>
                
                {taskDays.length > 0 && (
                    <div className="when-to-when">
                        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} min={today} disabled={task && task.id !== task.baseId}/>
                        <i className="bi bi-arrow-right"></i>
                        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} min={today}/>
                    </div>
                )}

                <div className="reminder">
                    <h2>{reminder ? "Off reminder?" : "On reminder?"}</h2>
                    <div className={`switch-cont ${reminder && "bg-accentmain"}`} onClick={() => setReminder(prev => !prev)}>
                        <div className={`switch-ball ease duration-600 ${reminder && "translate-x-9 md:translate-x-16"}`}></div>
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
                {isEditingMode && <button className="delete-task" onClick={() => setAlertShow(prev => !prev)}>Delete task</button>}
                {alertShow && <Alert yesDelete={() => deleteTask()} noDelete={() => setAlertShow(prev => !prev)} />}
            </div>            
        </div>
    );
}

export default NewTask;