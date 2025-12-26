import { useState } from "react";


function Profile() {
    
    const [profileImage, setProfileImage] = useState(null);

    function handleImageChange(e) {
        const file = e.target.files[0];
        if (!file) return;

        const imageURL = URL.createObjectURL(file);
        setProfileImage(imageURL);
    }

    return ( 
        <div className="sett-body">
        
            <div className="the-user">

                <label className="pfp-upload">
                    {profileImage ? (
                        <img src={profileImage} alt="your-pfp" className="pfp-image" />
                    ) : (
                        <span className="bi bi-plus pfp-plus"></span>
                    )}

                    <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleImageChange}
                        hidden
                    />
                </label>

                <div className="the-user-info">
                    
                    <div className="name-title">

                        <input type="text" placeholder="Name" className="the-user-name-title"/>

                        <input type="text" placeholder="Title i.e The inventor" className="the-user-name-title"/>

                    </div>
                    
                    <div className="the-user-bio">
                        <textarea name="" id="" placeholder="Who are you?"></textarea>
                    </div>

                </div>
                
                <div className="user-location">
                    <input type="text" placeholder="Location"/>
                    <input type="text" placeholder="Time-zone"/>
                </div>

            </div>

            <div className="user-preferences">
                
            </div>

        </div>
    );
}

export default Profile;