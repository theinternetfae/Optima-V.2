import { useState } from "react";
import EmojiPicker from "emoji-picker-react";

function NewTask({exit}) {

    const [showPicker, setShowPicker] = useState(false);
    const [emojiInput, setEmojiInput] = useState("");

    return ( 
        <div className="new-task">
            
            <i className="bi bi-x-circle-fill exit-new-screen cursor-pointer" onClick={exit}></i>

            <div className="new-task-container">
                <div className="task-desc">
                    <div className="emoji-cont bi bi-plus"></div>
                    <div>
                        <p>Name</p>
                        <p>Description</p>
                    </div>
                </div>
            </div>

            <EmojiPicker />            
        </div>
    );
}

export default NewTask;