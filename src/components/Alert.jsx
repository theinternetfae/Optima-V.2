import { createPortal } from "react-dom";

function Alert({yesDelete, noDelete}) {
    return createPortal( 
        <div className="alert-container">
            <div className="alert-box">
                <h1>This will delete this task, past, present and future. Are you sure?</h1>
                <div className="choice">
                    <button className="yes-yes" onClick={yesDelete}>Yes</button>
                    <button className="no-no" onClick={noDelete}>No</button>
                </div>
            </div>
        </div>, 
        document.getElementById("modal-root")
    );
}

export default Alert;