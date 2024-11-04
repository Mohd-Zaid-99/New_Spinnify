import React from "react";
import Logo from "../assets/Logo.png";
import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container-fluid">
        <a className="navbar-brand fs-3" style={{color:"#952953", paddingTop:"0px", paddingBottom:"0px"}} href="/">Wellness Mahotsav</a>
        {/* <Link to={"/"}>
        <img className="navbar-brand fs-3" style={{zIndex: 1, width: "4rem"}} src={Logo} alt="Wellness Logo"/>
        </Link> */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <a className="nav-link fs-5" style={{color:"#952953"}} href="/countdown">Countdown</a>
            </li>
            <li className="nav-item">
              <a className="nav-link fs-5" style={{color:"#952953"}} href="/posts">Posts</a>
            </li>
            <li className="nav-item">
              <a className="nav-link fs-5" style={{color:"#952953"}} href="/friends">Friends</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
