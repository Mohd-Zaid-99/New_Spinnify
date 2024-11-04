import React from "react";
import Logo from "../assets/Logo.png";
import { Link } from "react-router-dom";

export default function StoreSpin() {
  return (
    <div className="store-spin-container">
      <div className="RM-info-container d-flex flex-row">
        <div className="content">
          <div className="user-info">
            <div className="profile-pic">
              <div className="circle"></div>
              <img src={Logo} alt="RM profile pic" className="profile-img" />
            </div>
            <h2>MR. GHANSHYAM CHAUDHARI</h2>
            <p>Regional Manager - Karnataka</p>
          </div>
          <div className="stats">
            <div className="stat">
              <h3>000</h3>
              <p>STORES</p>
            </div>
          </div>

          {/* Spin Button */}
          <Link className="spin-btn" to={"/countdown"}>
            SPIN HERE
          </Link>
        </div>

        {/* Congratulations Section */}
        {/* <div className="congratulations">
          <p>Congratulations Winners</p> 
          <ul>
            <li>Belapur Sector 1 - 226</li>
            <li>Ambernath 3 Nisarg Green - 290</li>
          </ul>
        </div> */}
        <div className="">
          <img src={Logo} alt="Wellness Mahotsav Logo" className="logo" />

          <div className="store-manager-list">
          <h4 className="list-title">Store Manager</h4>
          <ul className="scrollable-list">
            <li className="list-item">Store 1 - John Doe - Karnataka</li>
            <li className="list-item">Store 2 - Jane Smith - Mumbai</li>
            <li className="list-item">Store 3 - Robert Brown - Delhi</li>
            <li className="list-item">Store 4 - Emily Clark - Kerala</li>
            <li className="list-item">Store 3 - Emily Clark - Kerala</li>
            <li className="list-item">Store 45 - Emily Clark - Kerala</li>
            <li className="list-item">Store 7 - Emily Clark - Kerala</li>
            {/* Add more items as needed */}
          </ul>
        </div>
        </div>
      </div>
    </div>
  );
}
