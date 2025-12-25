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

                {/* <div className="pfp">
                    <i className="bi bi-plus"></i>
                    <input type="file" accept="image/*" className="pfp-image"  />
                </div> */}


            </div>


        </div>
    );
}

export default Profile;