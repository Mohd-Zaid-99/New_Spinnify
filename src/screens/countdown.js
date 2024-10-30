import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Countdown = () => {
  const navigate = useNavigate();

  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 5,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        const { hours, minutes, seconds } = prevTime;

        if (seconds > 0) {
          return { ...prevTime, seconds: seconds - 1 };
        } else if (minutes > 0) {
          return { hours, minutes: minutes - 1, seconds: 59 };
        } else if (hours > 0) {
          return { hours: hours - 1, minutes: 59, seconds: 59 };
        } else {
          clearInterval(timer);
          navigate("/storeSpin");
          return prevTime;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="count-contain text-center">
      <div className="time">
        <h1 className="mb-4">Stay Tuned for Lucky Draw</h1>
        <div className="d-flex  justify-content-center">
          <div>
            <div className="time-box">
              <h1 style={{fontSize: "4rem"}}>{String(timeLeft.hours).padStart(2, "0")}</h1>
            </div>
            <p className="fw-bold">HOURS</p>
          </div>
          <div>
            <div className="time-box">
              <h1 style={{fontSize: "4rem"}}>{String(timeLeft.minutes).padStart(2, "0")}</h1>
            </div>
            <p className="fw-bold">MINUTES</p>
          </div>
          <div>
            <div className="time-box">
              <h1 style={{fontSize: "4rem"}}>{String(timeLeft.seconds).padStart(2, "0")}</h1>
            </div>
            <p className="fw-bold">SECONDS</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Countdown;
