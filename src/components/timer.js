import React, { useState, useRef } from "react";
import Button from '@mui/material/Button';

const Timer = () => {
    // We need ref in this, because we are dealing
    // with JS setInterval to keep track of it and
    // stop it when needed
    const Ref = useRef(null);

    // The state for our timer
    const [timer, setTimer] = useState("00:00:00");

    const getTimeRemaining = (e) => {
        const total = Date.parse(e) - Date.parse(new Date());
        const seconds = Math.floor((total / 1000) % 60);
        const minutes = Math.floor((total / 1000 / 60) % 60);
        const hours = Math.floor((total / 1000 / 60 / 60) % 24);
        return {
            total,
            hours,
            minutes,
            seconds,
        };
    };

    const startTimer = (e) => {
        let { total, hours, minutes, seconds } =
            getTimeRemaining(e);
        if (total >= 0) {
            // update the timer
            // check if less than 10 then we need to
            // add '0' at the beginning of the variable
            setTimer(
                (hours > 9 ? hours : "0" + hours) +
                " Hora " +
                (minutes > 9
                    ? minutes
                    : "0" + minutes) +
                " Minutos " +
                (seconds > 9 ? seconds : "0" + seconds + " Segundos")
            );
        }
    };

    const clearTimer = (e) => {
        // If you adjust it you should also need to
        // adjust the Endtime formula we are about
        // to code next
        setTimer("00:00:00");

        // If you try to remove this line the
        // updating of timer Variable will be
        // after 1000ms or 1sec
        if (Ref.current) clearInterval(Ref.current);
        const id = setInterval(() => {
            startTimer(e);
        }, 1000);
        Ref.current = id;
    };

    const getDeadTime = () => {
        let deadline = new Date();

        // This is where you need to adjust if
        // you entend to add more time
        deadline.setSeconds(deadline.getSeconds() + 6000);
        return deadline;
    };

    // We can use useEffect so that when the component
    // mount the timer will start as soon as possible

    // We put empty array to act as componentDid
    // mount only
    // Another way to call the clearTimer() to start
    // the countdown is via action event from the
    // button first we create function to be called
    // by the button
    const onClickReset = () => {
        clearTimer(getDeadTime());
    };

    return (
        <div style={{ textAlign: "center", marginBottom: "30px",margin: "0px auto", background: "rgb(237, 247, 237)", padding: "10px"}}>
                <h6 style={{fontWeight: 900, color:"rgb(198, 198, 198)"}}>Te queda:</h6>
                <h4 style={{fontWeight: 900, color:"rgb(198, 198, 198)"}}>{timer}</h4>
                <Button color="success" style={{margin: "10px"}}variant="contained" onClick={onClickReset}>Comenzar</Button>
        </div>
    );
};

export default Timer;