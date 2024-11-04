import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  Navigate,
} from "react-router-dom";
import "./App.css";
// import Navbar from "./components/navbar"
import Countdown from "./screens/countdown";
import StoreSpin from "./screens/storeSpin";

const App = () => {
  return (
    <Router>
      <div className="">
        {/* <Navbar/> */}
        <Routes>
          <Route path="/" element={<Navigate to="/countdown" />} />
          <Route path="/countdown" element={<Countdown />} />
          <Route path="/storeSpin" element={<StoreSpin />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
