import { useEffect, useState, useRef} from "react";

function DateMenu() {
    const [days, setDays] = useState([]);
    const containerRef = useRef(null);
    const todayRef = useRef(null);


    function getDaysAround(today, rangeInDays = 90) {
        const result = [];
        const start = new Date(today);
        start.setDate(start.getDate() - rangeInDays);

        for (let i = 0; i < rangeInDays * 90; i++) {
            const day = new Date(start);
            result.push(day);
            start.setDate(start.getDate() + 1);
        }

        return result;
    }

    // function getDaysInMonth(year, month) {
    //     const result = [];
    //     const date = new Date(year, month, 1);

    //     while (date.getMonth() === month) {
    //         result.push(new Date(date));
    //         date.setDate(date.getDate() + 1);
    //     }
        
    //     return result;
    // }

    const today = new Date();

    useEffect(() => {
        const today = new Date();

        setDays(getDaysAround(today, 90))
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

    function toggleTodayDisplay() {
        const navDate = document.querySelector('.nav-date');
        navDate.innerText = `${today.toLocaleDateString("en-US", { month: "long", day: "numeric" })}`;
        if (todayRef.current && containerRef.current) {
            todayRef.current.scrollIntoView({
                behavior: "auto",
                inline: "center",
                block: "nearest",
            });
        }

    }

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];

    return ( 
        <div>
            
            <div className="task-handler">
                <select name="show" className="show">
                    <option value="all">All</option>
                    <option value="unmet">Unmet</option>
                    <option value="met">Met</option>
                </select>
                <p className="nav-date" onClick={toggleTodayDisplay}>{today.toLocaleDateString("en-US", { month: "long", day: "numeric" })}</p>
                <i className="bi bi-plus-circle-fill add"></i>
            </div>

            <div className="date-menu" ref={containerRef}>
                <div className="date-track">
                    {days.map((day, index) => {
                        const isToday = day.toDateString() === new Date().toDateString();
                        const weekday = dayNames[day.getDay()];
                        const isMonday = weekday.toLowerCase() === "mon";

                        function toggleDateDisplay() {
                            const navDate = document.querySelector('.nav-date');
                            navDate.innerText = `${day.toLocaleDateString("en-US", { month: "long", day: "numeric" })}`;
                        }

                        return (
                            <div key={index} onClick={toggleDateDisplay} className={`ind-date-box ${isMonday ? "snap-start monday" : ""} ${isToday ? "border-t-bluelight" : ""}`} ref={isToday ? todayRef : null}>
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