import React, { useState, useEffect, useRef } from "react";
import Logo from "../assets/Logo.png";
import spinnerImg from "../assets/Spin 01.png";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import confetti from "canvas-confetti";
import CongratsImage from "../assets/07.jpg";
import spinSound from "../assets/SpinSoundd.m4a"
import winnerSound from "../assets/clapSound.wav"

export default function StoreSpin() {
  const [isSpinClicked, setIsSpinClicked] = useState(false);
  const [angle, setAngle] = useState(0);
  const [wheelClass, setWheelClass] = useState("");
  const [data, setData] = useState([]);
  const [indexValue, setIndexValue] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinCount, setSpinCount] = useState(0);
  const [spinContainers, setSpinContainers] = useState([]);
  const [currentWinnersLength, setCurrentWinnersLength] = useState();
  const [allSpinsCompleted, setAllSpinsCompleted] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const confettiAnimationRef = useRef();
  const spinningAudioRef = useRef(new Audio(spinSound));
  const winnerAudioRef = useRef(new Audio(winnerSound));

  const fetchWinners = async () => {
    try {
      console.log("allSpinCompleted", allSpinsCompleted);
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
  }, []); // Empty dependency array means this runs only once

  // Ensure allSpinsCompleted is only set after data is fetched
  useEffect(() => {
    if (data.length > 0 && indexValue >= data.length) {
      setAllSpinsCompleted(true);
    } else {
      setAllSpinsCompleted(false);
    }
  }, [indexValue, data.length]);

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

  const currentRMData = data[indexValue] || null;

  const handleSpinClick = () => {
    // Check if all winners in the current set have been rendered

    setIsSpinClicked(true);
    spinWheel();
  };

  const spinWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    const newAngle = angle + 9600; // Set the initial spin to 9600 degrees
    setAngle(newAngle);
    setWheelClass("spinning");

    spinningAudioRef.current.play();

    // End the spin after 21 seconds
    setTimeout(() => {
      setWheelClass("slowing");
      // Stop the spinning sound if any
    }, 14000);

    // Finalize the spin
    setTimeout(() => {
      setIsSpinClicked(false);
      setIsSpinning(false);

      spinningAudioRef.current.pause();
      spinningAudioRef.current.currentTime = 0;

      showWinnerPopup(); // Ensure the winner popup shows after spin
    }, 2100); // Total spin duration set to 21 seconds
  };

  const showRMChangeAlert = () => {
    const currentRM = data[indexValue + 1]; // Get the next RM's data
    const nextRmImg = `${process.env.PUBLIC_URL}/RM/${currentRM?.url}`
    Swal.fire({
      title: "Changing Regional Manager",
      html: `
      <div style="display: flex; align-items: center;flex-direction:column">
        <img src="${nextRmImg}" alt="Logo" style="width: 150px; height: 150px; border-radius: 50%; margin-right: 10px;" />
        <span>You are now viewing <h2>${currentRM.rmName} </h2> </span>
      </div>
    `,
      confirmButtonText: "OK",
      background: "#f9f9f9",
      customClass: {
        confirmButton: "custom-confirm-button",
      },
    });
  };

  const showWinnerPopup = () => {
    startConfetti();
    winnerAudioRef.current.play();

    const winners = currentRMData.storeWinners.slice(
      spinCount * 3,
      spinCount * 3 + 3
    ); // Get winners for this spin
    console.log("winnerssssss", winners);

    Swal.fire({
      html: `
    <div style="width: 100%; height: 70vh;display:flex;justify-content:center;z-index:-1 ">
      <div style="display: flex; align-items: flex-end; justify-content: center;width:100%;height:100%;display: flex; background-image: url(${CongratsImage}); background-size: cover; background-position: center; background-repeat: no-repeat;
    flex-direction: column;">
    <div style="width:50%;margin-top: 40px;">
    ${winners
      .map(
        (winner) => `
        <div style="margin: 19px 0px; color: #952953; font-size: 30px;font-weight:bolder">
        ${winner.name}
        </div>
        `
      )
      .join("")}
      </div>
      </div>
    </div>`,
      customClass: {
        popup: "zoom-in-popup",
        confirmButton: "custom-confirm-button",
      },
      confirmButtonText: "OK",
      showConfirmButton: true,
      background: "transparent",
      width: "100%", // Full width
      height: "auto", // Set height to auto to minimize gaps
      padding: "0", // No padding
      backdrop: "rgba(0,0,0,0.8)", // Optional: adds a backdrop overlay
      grow: "fullscreen", // Makes the popup grow to full screen
      confirmButtonColor: "#952953",
    }).then((result) => {
      cancelAnimationFrame(confettiAnimationRef.current);
      confetti.reset();

      winnerAudioRef.current.pause();
      winnerAudioRef.current.currentTime = 0;

      if (result.isConfirmed) {
        createWinnerBox(winners);
        setSpinCount((prevCount) => prevCount + 1);

        // Check if all winners for the current RM have been rendered
        if ((spinCount + 1) * 3 >= currentRMData.storeWinners.length) {
          // All winners for the current RM have been rendered
          if (indexValue + 1 < data.length) {
            // Move to the next RM data if available
            setIndexValue((prevIndex) => prevIndex + 1);
            showRMChangeAlert();
          } else {
            // No more RM data; set allSpinsCompleted to true
            setAllSpinsCompleted(true);
          }
          setSpinCount(0); // Reset spin count for the next RM
        }
      }
    });
  };

  const createWinnerBox = (winners) => {
    // Find or create the main container for the current RM
    const mainContainer = document.querySelector(".winner-container");
    let rmContainer = document.querySelector(`#rm-container-${indexValue}`);

    if (!rmContainer) {
      // Create a new RM container if it doesn't already exist
      rmContainer = document.createElement("div");
      rmContainer.className = "rm-container";
      rmContainer.id = `rm-container-${indexValue}`;
      rmContainer.innerHTML = `
      <div class="rm-header">
        <h2>${currentRMData.rmName} - Regional Manager</h2>
      </div>
      <div class="spins-container"></div>
    `;

      // Prepend the new RM container to ensure it appears at the top
      mainContainer.prepend(rmContainer);
    }

    // Find the spins container within the RM container
    const spinsContainer = rmContainer.querySelector(".spins-container");

    // Create a new winner box for the current spin
    const winnerBox = document.createElement("div");
    winnerBox.className = "winner-box";
    winnerBox.innerHTML = `
    <div class="winner-header">${currentRMData.rmName} - Spin ${
      spinCount + 1
    }</div>
    <ul class="winner-list">
      ${winners
        .map((winner) => `<li>${winner.name}</li>`)
        .join("")}
    </ul>
  `;

    // Append the new winner box to the spins container
    spinsContainer.appendChild(winnerBox);
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

  const downloadXlsx = async () => {
    try {
      const response = await axios.get("http://localhost:8081/spin/spinnify/downloadStoreWinners");
      if (response.data && response.data.data) {
        const base64Data = response.data.data;
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
  
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "store_winners.xlsx";
        document.body.appendChild(link);
        link.click();
  
        // Clean up after download
        URL.revokeObjectURL(url);
        document.body.removeChild(link);
  
        console.log("Download successful");
      } else {
        console.error("No data found to download");
      }
    } catch (error) {
      console.error("Error downloading XLSX file:", error);
    }
  };  

  const rmImg = `${process.env.PUBLIC_URL}/RM/${currentRMData?.url}`

  return (
    <div className="parentContainer">
      <div className="store-spin-container">
        {!isSpinClicked ? (
          <div className="RM_info_container">
            <div className="user-info">
              <div className="circle">
                <img src={rmImg} alt="" className="profile-img"/>
              </div>
              <h2>{currentRMData?.rmName}</h2>
            </div>
            <div className="stats">
              <div className="stat">
                <h3>{String(currentRMData?.storeCount).padStart(3, "0")}</h3>
                <p>STORES</p>
              </div>
              {allSpinsCompleted ? (
                <button className="spin-btn" onClick={downloadXlsx}>
                  DOWNLOAD
                </button>
              ) : (
                <button className="spin-btn" onClick={handleSpinClick}>
                  SPIN HERE
                </button>
              )}
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
              <h3>Stores</h3>
            </div>
            <div
              className={`scrolling-content ${
                currentRMData?.storeName.length > 8 ? "scrolling-animation" : ""
              }`}
            >
              {currentRMData?.storeName.map((store, index) => (
                <div className="storeParticipant" key={index}>
                  {store.name}
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
