import { useEffect, useState, useRef} from "react";

function DateMenu() {
    const [days, setDays] = useState([]);
    const containerRef = useRef(null);
    const todayRef = useRef(null);

    function getDaysInMonth(year, month) {
        const result = [];
        const date = new Date(year, month, 1);

        while (date.getMonth() === month) {
            result.push(new Date(date));
            date.setDate(date.getDate() + 1);
        }
        
        return result;
    }

    const today = new Date();

    useEffect(() => {
        const today = new Date();
        const year = today.getFullYear();   
        const month = today.getMonth();

        setDays(getDaysInMonth(year, month))
    }, []);

    useEffect(() => {
        if (todayRef.current && containerRef.current) {
            todayRef.current.scrollIntoView({
                behavior: "auto",
                inline: "center",
                block: "nearest",
            });
        }
    }, [days]);

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];

    return ( 
        <div>
            
            <div className="task-handler">
                <select name="show" className="show">
                    <option value="all">All</option>
                    <option value="unmet">Unmet</option>
                    <option value="met">Met</option>
                </select>
                <p className="nav-date">{today.toLocaleDateString("en-US", { month: "long", day: "numeric" })}</p>
                <i className="bi bi-plus-circle-fill add"></i>
            </div>

            <div className="date-menu" ref={containerRef}>
                <div className="date-track">
                    {days.map((day, index) => {
                        const isToday = day.toDateString() === new Date().toDateString();
                        const weekday = dayNames[day.getDay()];
                        const isMonday = weekday.toLowerCase() === "mon";

                        return (
                            <div key={index} className={`ind-date-box ${isMonday ? "snap-start monday" : ""} ${isToday ? "border-bluet" : ""}`} ref={isToday ? todayRef : null}>
                                <span className="flex justify-center">{isToday ? "Today" : `${weekday}`}</span>
                                <span className={`other-days ${isToday ? "border-bluet" : ""}`}>{day.getDate()} </span>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
}

export default DateMenu;