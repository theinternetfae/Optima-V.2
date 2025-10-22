function TaskStats() {
    return ( 
        <div className="full-stats-cont">

            <div className="stats-header">
                <button className="bi bi-lightbulb-fill tips"></button>
                <select name="task-selected" className="task-selected">
                    <option value="overall">Overall</option>                    
                </select>
                <button className="bi bi-plus-circle-fill add"></button>
            </div>


        </div> 
    );
}

export default TaskStats;