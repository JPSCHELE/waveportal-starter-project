import * as React from "react";
import { ethers } from "ethers";
import './App.css';

export default function App() {

  const wave = () => {
    
  }
  
  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
          <span role="img">
           🧪
          </span> Hey there!
          <span role="img">
           🚀
          </span> 
        </div>

        <div className="bio">
        I am skelli.eth and I'm working as a SE in arch that's pretty cool right? Connect your Ethereum wallet and wave at me!
        </div>

        <button className="waveButton" onClick={wave}>
          Wave at Me
        </button>
      </div>
    </div>
  );
}
