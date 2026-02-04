import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
// import { Link } from "react-router-dom";
import { client } from "../appwrite.js";

function Welcome() {

    const [users, setUsers] = useState([]);

    // useEffect(() => {
    //     async function fetchUsers() {
    //         const data = await getUser();
    //         setUsers(data);
    //     }

    //     fetchUsers();
    // }, [])

    // useEffect(() => {
    //     const channel = 'databases.optima.tables.users.rows';

    //     const unsubscribe = client.subscribe(channel, (response) => {
    //         const eventType = response.events[0];
    //         console.log(response.events);
    //         const changedUser = response.payload;

    //         if(eventType.includes("create")) {
    //             setUsers(prev => [...prev, changedUser])
    //         }

    //         if(eventType.includes("delete")) {
    //             setUsers(prev => prev.filter(user => user.$id !== changedUser.$id))
    //         }
    //     })

    //     console.log('Subscribed');
    //     return () => {
    //         console.log('Unsubscribed');
    //         unsubscribe();
    //     };

    // }, [])

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    // const [password, setPassword] = useState('');
    // const [confirmedPassword, setConfirmedPassword] = useState('');

    console.log(users);
    // console.log(password);
    // console.log(confirmedPassword);
    
    // const profile = {
    //     fname: firstName,
    //     lname: lastName,
    //     email: email
    // }

    // function handleSubmit() {

    //     addUser(profile);

    //     setFirstName('');
    //     setLastName('');
    //     setEmail('');


    //     console.log('Yes you can!');
    
    // }

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
                    <button type="button" className="button">
                        Sign up
                    </button>

                    <div className="flex border border-2 gap-6">
                        {
                            users.map(user => {
                                return <span key={user.$id} className="cursor-pointer">{user.fname}</span>
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