import React from 'react';
import Calendar from "./calendar/calendar";

function App() {

    return (
        <div className="App bc--cream">
                <div className="row header m--0 p--0 bc--yellow c--white header">
                    <div className="col-md-12">
                        <div className="col-md-10 offset-1">
                            <h3 className="p--20 brand bc--green-dark c--white m--0">Calendar Event.</h3>
                        </div>
                    </div>
                </div>
            <div className="col-md-10 offset-1 box-container">
                <Calendar/>
            </div>
        </div>
    );
}

export default App;
