import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import db from "../appwrite/userActions";
// import { Link } from "react-router-dom";


function Welcome() {

    const [users, setUsers] = useState([]);

    useEffect(() => {

        init();

    }, []);

    async function init() {

        const response = await db.profiles.list();    

        setUsers(response.documents);
    
    }

    useEffect(() => {
        console.log(users);
    }, [users]);


    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    // const [password, setPassword] = useState('');
    // const [confirmedPassword, setConfirmedPassword] = useState('');

    async function handleCreate(e) {
        e.preventDefault();
        
        if(!firstName || !lastName || !email) return;

        try{
            const payload = {
                fname: firstName,
                lname: lastName,
                email: email
            }

            const response = await db.profiles.create(payload);
            setUsers(prev => [...prev, response]);
            console.log("Users updated!");
            setFirstName('');
            setLastName('');
            setEmail('');
        } catch(error) {
            console.log(error);
        }
    }

    async function handleDelete(e, id) {
        e.preventDefault();
        try{
            await db.profiles.delete(id);

            setUsers(prev => prev.filter(u => u.$id !== id));

            console.log("User deleted!");
          
        } catch(error) {
            console.log(error);
        }
    }


    function buildUpdateData() {
        const data = {};

        if (firstName.trim()) data.fname = firstName;
        if (lastName.trim()) data.lname = lastName;
        if (email.trim()) data.email = email;

        return data;
    }


    async function handleUpdate(e, id) {

        e.preventDefault();

        const updateData = buildUpdateData();

        console.log(updateData);

        if (!firstName && !lastName && !email) return;

        try{
            await db.profiles.update(id, updateData);

            setUsers(users.map(u => u.$id === id ? updateData : u));

            setFirstName('');
            console.log("User Updated!");
          
        } catch(error) {
            console.log(error);
        }

    }

    return createPortal(
        <form className="welcome-page">

            {/* <p>Welcome!</p> */}

            <div className="sign">

                <div className="sign-inputs-cont">

                    <div className="welcome-note">
                        <h1>Welcome!</h1>
                        <p>Sign up to access the app</p>    
                    </div>                    

                    <div className="sign-inputs-box">
                        <input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)}/>
                        <input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)}/>
                        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                        <input type="password" placeholder="Password"/>
                        <input type="password" placeholder="Confirm Password"/>
                    </div>
                    <button type="button" className="button" onClick={e => handleCreate(e)}>
                        Sign up
                    </button>

                    <div className="border border-2 gap-6">
                        {
                            users.map(user => {
                                return <div key={user.$id} className="flex items-center gap-2">
                                    <span className="cursor-pointer">{user.fname}</span>
                                    <button className="bg-black p-2 rounded-lg cursor-pointer" onClick={e => handleDelete(e, user.$id)}>Delete</button>
                                    <button className="bg-black p-2 rounded-lg cursor-pointer" onClick={e => handleUpdate(e, user.$id)}>Update</button>
                                </div>
                            })
                        }
                    </div>

                    <p>Already have an account? Sign in</p>
                </div>
            </div>

        </form>,
        document.getElementById("modal-root")
    );
}

export default Welcome;