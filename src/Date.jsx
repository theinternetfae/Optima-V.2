import { useEffect, useState } from "react";

function DateMenu() {
    const [days, setDays] = useState([]);
    
    function getDaysInMonth(year, month) {
        const result = [];
        const date = new Date(year, month, 1);

        while (date.getMonth() === month) {
            result.push(new Date(date));
            date.setDate(date.getDate() + 1);
        }
        
        return result;
    }

    useEffect(() => {
        const today = new Date();
        const year = today.getFullYear();   
        const month = today.getMonth();

        setDays(getDaysInMonth(year, month))
    }, []);

    return ( 
        <div className="date-menu">
            {days.map((day, index) => {
                const isToday = day.toDateString() === new Date().toDateString();
                if(isToday) {
                    return (<span className="border border-2 border-selected other-days" key={index}>{day.getDate()} </span>)
                } else {
                    return(<span className="other-days" key={index}>{day.getDate()} </span>)
                }
            })}
        </div>
    );
}

export default DateMenu;