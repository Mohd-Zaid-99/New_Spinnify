import React, { useState, useEffect, useRef } from "react";
import Logo from "../assets/Logo.png";
import spinnerImg from "../assets/Spin 01.png";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import confetti from "canvas-confetti";
import CongratsImage from "../assets/07.jpg";

export default function StoreSpin() {
  const [isSpinClicked, setIsSpinClicked] = useState(false);
  const [angle, setAngle] = useState(0);
  const [wheelClass, setWheelClass] = useState("");
  const [data, setData] = useState([]);
  const [indexValue, setIndexValue] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinCount, setSpinCount] = useState(0);
  const [spinContainers, setSpinContainers] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const confettiAnimationRef = useRef();
  const spinningAudioRef = useRef(null);
  let currentRMData;

  const fetchWinners = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8081/spin/spinnify/getStoreWinners"
      );
      const result = response.data;
      setData(result);
    } catch (error) {
      console.error("Error fetching winners:", error);
      setError(error); // Set error state
    } finally {
      setLoading(false); // Set loading to false regardless of success or failure
    }
  };

  useEffect(() => {
    fetchWinners();
  }, []);

  // Handle loading and error states
  if (loading) {
    return (
      <div className="loading-overlay">
        <div className="circle-loader"></div> {/* Circle loader */}
      </div>
    );
  }

  if (error) {
    return <div>Error fetching data: {error.message}</div>;
  }

  console.log("result", data);
  currentRMData = data[indexValue] || {};

  const handleSpinClick = () => {
    setIsSpinClicked(true);
    spinWheel();
  };

  const spinWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    const newAngle = angle + 9600; // Set the initial spin to 9600 degrees
    setAngle(newAngle);
    setWheelClass("spinning");

    // End the spin after 21 seconds
    setTimeout(() => {
      setWheelClass("slowing");
      // Stop the spinning sound if any
    }, 14000);

    // Finalize the spin
    setTimeout(() => {
      setIsSpinClicked(false);
      setIsSpinning(false);
      showWinnerPopup(); // Ensure the winner popup shows after spin
    }, 2100); // Total spin duration set to 21 seconds
  };

  const showWinnerPopup = () => {
    const winners = currentRMData.storeWinners.slice(
      spinCount * 3,
      spinCount * 3 + 3
    ); // Get winners for this spin

    if (winners.length === 0) {
      setIndexValue(indexValue + 1);
      Swal.fire({
        title: "No more winners!",
        text: "All winners have been selected.",
        icon: "info",
      });
      return;
    }

    startConfetti();

    Swal.fire({
      html: `
    <div style="width: 100%; height: 70vh;display:flex;justify-content:center ">
      <div style="display: flex; align-items: flex-end; justify-content: center;width:100%;height:100%;display: flex; background-image: url(${CongratsImage}); background-size: cover; background-position: center; background-repeat: no-repeat;
    flex-direction: column;">
    <div style="width:50%;display:flex;justify-content:center;flex-direction:column">
    ${winners
      .map(
        (winner) => `
        <div style="margin-bottom: 15px; color: black; font-size: 30px;font-weight:bolder">
        ${winner}
        </div>
        `
      )
      .join("")}
      </div>
      </div>
    </div>`,
      showConfirmButton: true,
      background: "transparent",
      width: "100%", // Full width
      height: "auto", // Set height to auto to minimize gaps
      padding: "0", // No padding
      backdrop: "rgba(0,0,0,0.8)", // Optional: adds a backdrop overlay
      grow: "fullscreen", // Makes the popup grow to full screen
    }).then((result) => {
      cancelAnimationFrame(confettiAnimationRef.current);
      confetti.reset();

      if (result.isConfirmed) {
        createWinnerBox(winners);
        setSpinCount((prevCount) => prevCount + 1); // Increment spin count
      }
    });
  };

  const createWinnerBox = (winners) => {
    const winnerBox = document.createElement("div");
    winnerBox.className = "winner-box";
    winnerBox.innerHTML = `
      <div class="winner-header">${currentRMData.rmName} - Spin ${
      spinCount + 1
    }</div>
      <ul class="winner-list">
              ${winners.map((winner) => `<li>${winner}</li>`).join("")}

      </ul>
    `;

    const container = document.querySelector(".winner-container");
    if (container) {
      container.appendChild(winnerBox);
    }
  };

  const startConfetti = () => {
    const duration = 15 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#bb0000", "#ffffff"],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#bb0000", "#ffffff"],
      });

      if (Date.now() < end) {
        confettiAnimationRef.current = requestAnimationFrame(frame);
      }
    })();
  };

  return (
    <div className="parentContainer">
      <div className="store-spin-container">
        {!isSpinClicked ? (
          <div className="RM_info_container">
            <div className="user-info">
              <div className="circle"></div>
              <h2>{currentRMData?.rmName}</h2>
              <p>Regional Manager - Karnataka</p>
            </div>
            <div className="stats">
              <div className="stat">
                <h3>{String(currentRMData?.storeCount).padStart(3, "0")}</h3>
                <p>STORES</p>
              </div>
              <button className="spin-btn" onClick={handleSpinClick}>
                SPIN HERE
              </button>
            </div>
          </div>
        ) : (
          <div className="wheelBlock">
            <img style={{ width: "360px" }} src={spinnerImg} />
            <div className="wheel-container">
              <div
                className={`wheels ${wheelClass}`}
                style={{ transform: `rotate(${angle}deg)` }}
              >
                <div className="central-circle"></div>
              </div>
            </div>
          </div>
        )}
        <div className="storeList">
          <div className="storeListPageLogo">
            <img src={Logo} alt="Wellness Mahotsav Logo" className="logo" />
          </div>
          <div className="storeParticipantList">
            <div className="storeParticipantListHeader">
              <h3>Store Manager</h3>
            </div>
            <div className="scrolling-content">
              {currentRMData?.storeName.map((name, index) => (
                <div className="storeParticipant" key={index}>
                  {name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="winner-container"></div>
    </div>
  );
}
