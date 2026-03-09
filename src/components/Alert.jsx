import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

function Alert({yesDelete, noDelete, different, popUp}) {
    
    const [scrolling, setScrolling] = useState("");

    useEffect(() => {
        
        if(popUp) {

            const scroll = setTimeout(() => {
                setScrolling("translate-y-30");
                console.log("translated")
            })

            return () => clearTimeout(scroll);

        }
    
    }, [])
    
    useEffect(() => {

        if(popUp) {
            const closePop = setTimeout(() => {
                noDelete();            
            }, 4000)
        
            return () => clearTimeout(closePop);
        }

    }, [])


    return createPortal( 
        <div className={popUp ? "pop-container" : "alert-container"}>
            {
                popUp ? (
                    <div className={`pop-box ${scrolling}`}>

                        <h1>{different}</h1>
                    
                        <button className="exit-pop" onClick={noDelete}>Ok</button>
                    </div>
                ) : (
                    <div className="alert-box">
                        <h1>{different ? different : 'This will delete this task, past, present and future. Are you sure?'}</h1>
                        <div className="choice">
                            <button className="yes-yes" onClick={yesDelete}>Yes</button>
                            <button className="no-no" onClick={noDelete}>No</button>
                        </div>
                    </div>
                )
            }
        </div>, 
        document.getElementById("modal-root")
    );
}

export default Alert;