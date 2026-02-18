function Loader() {
    return ( 
        <div className="loading-screen">
            
            <div className="loading-box">
                <span style={{"--i": 1}} className="one"></span>
                <span style={{"--i": 2}} className="two"></span>
                <span style={{"--i": 3}} className="three"></span>
                <span style={{"--i": 4}} className="four"></span>
                <p>Loading</p>    
            </div> 
        
        </div>
    );
}

export default Loader;