import { useState, useEffect, useContext } from "react";
import { TaskContext } from "../components/TaskContext.js";
import Alert from "../components/Alert.jsx";
import db from "../appwrite/databases.js";

function DataPrivacy() {

    const [toggleOne, setToggleOne] = useState(false);
    const [toggleTwo, setToggleTwo] = useState(false);
    const [ alertOne, setAlertOne ] = useState(false);
    const [ alertTwo, setAlertTwo ] = useState(false);
    const differentOne = "Are you Sure? This will clear your task history.";
    const differentTwo = "Are you Sure? This will clear your app data including tasks, themes and preferences.";
    const { taskList, setTaskList, userData } = useContext(TaskContext);

    async function resetAllData() {

        await Promise.all(
            taskList.map(dc =>
            db.tasks.delete(dc.$id).catch(err => console.log("Deleting task in DataPrivacy:", err))
        ));

        db.profiles.update(userData.$id, {
            theme: "dark",
            accent: "blue",
            quirk: true,
            quote: false,
            streak: true,
        })

        localStorage.clear();
        window.location.reload();
        setAlertTwo(prev => !prev);
    }

    async function clearTaskHistory() {
        await Promise.all(
            taskList.map(dc =>
            db.tasks.delete(dc.$id).catch(err => console.log("Deleting task in DataPrivacy:", err))
        ));

        localStorage.removeItem("tasks");
        setTaskList([]); 

        setAlertOne(prev => !prev);
    }

    return ( 
        <div className="sett-body">

            <div className="data-background">

                <section className="dropdown">
                    <div className="toggle-dropdown" onClick={() => setToggleOne(prev => !prev)}>
                        <i className={toggleOne ? "bi bi-caret-down-fill" : "bi bi-caret-right-fill"}></i>
                        <span>What data is stored?</span>
                    </div>
                    {toggleOne && <p>Data stored include: Tasks and schedules, completion history, app preferences, and profile info.</p>}
                </section>
                
                <section className="dropdown">
                    <div className="toggle-dropdown" onClick={() => setToggleTwo(prev => !prev)}>
                        <i className={toggleTwo ? "bi bi-caret-down-fill" : "bi bi-caret-right-fill"}></i>
                        <span>How is it stored?</span>
                    </div>
                    {toggleTwo && <p>Your data is stored locally in your browser using localStorage. We do not upload or share your data with any servers at the moment.</p>}
                </section>
                

                <section className="controls">
                    <h2>Controls</h2>

                    <div className="controller">
                        <div>
                            <p>Clear task history</p>
                            <span>Deletes ALL tasks</span>
                        </div>
                        <button className="bi bi-trash" onClick={() => setAlertOne(prev => !prev)}></button>
                    </div>

                    <div className="controller">
                        <div>
                            <p>Reset all data</p>
                            <span>Resets the whole app and deletes all data</span>
                        </div>
                        <button className="bi bi-trash" onClick={() => setAlertTwo(prev => !prev)}></button>
                    </div>
                    
                    <button className="download-data">
                        <i className="bi bi-download"></i>
                        <span>Download your data</span>
                    </button>
                </section>

            </div>            

            {alertOne && <Alert yesDelete={() => clearTaskHistory()} noDelete={() => setAlertOne(prev => !prev)} different={differentOne}/>}
            {alertTwo && <Alert yesDelete={() => resetAllData()} noDelete={() => setAlertTwo(prev => !prev)} different={differentTwo}/>}
        </div>
    );
}

export default DataPrivacy;