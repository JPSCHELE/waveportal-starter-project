import { ethers } from "ethers";
import React, {useEffect, useState} from "react";

import abi from "./utils/WavePortal.json";
import './App.css';

export default function App() {
  const [currentAccount, setCurrentAccount] = useState("");
  const contractAddress = "0x1E220C41d5b3E3DDe30736b4fFcc4Fe0066F82d8";
  const [wavesCount, setWavesCount] = useState(0);
  const [allWaves, setAllWaves] = useState([]);
  const contractABI = abi.abi;
  
  const getAllWaves = async () => {
    try {
      const {ethereum} = window;
      if (ethereum){
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        const waves = await wavePortalContract.getAllWaves();

        let wavesCleaned = [];
        console.log(waves)
        waves.forEach(wave => {
          wavesCleaned.push({
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message
          });
        });
        setAllWaves(wavesCleaned);
      } else{
        console.log("No eth object");
      }
    } catch (error){
      console.log(error);
    }
  }
  
  
  const checkIfWalletIsConnected = async () => {
    try{
      const { ethereum } = window;
    
    if (!ethereum){
      console.log("Wallet not connected")
    } else {
      console.log("Wallet connected", ethereum)
    }
    const accounts = await ethereum.request({ method: "eth_accounts" });
    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account)
      getAllWaves();
    } else {
      console.log("No authorized account found")
    }
  } catch (error){
    console.log(error)
  }
  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error)
    }
  }

  const wave = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
        
        let count = await wavePortalContract.getTotalWaves();
        setWavesCount(count.toNumber())
        console.log("Total wave count:", count.toNumber());

         /*
        * Execute the actual wave from your smart contract
        */
         const waveTxn = await wavePortalContract.wave("Hello world!", {gasLimit: 3000000});
         console.log("Mining...", waveTxn.hash);
 
         await waveTxn.wait();
         console.log("Mined -- ", waveTxn.hash);
 
         count = await wavePortalContract.getTotalWaves();

         console.log("Retrieved total wave count...", count.toNumber());
         setWavesCount(count.toNumber())
      } else {
        console.log("Ethereum object doesn't exist");
      }
    } catch (error){
      console.log(error);
    }
  }

  useEffect(() => {

    checkIfWalletIsConnected();
    let wavePortalContract;

    const onNewWave = (from, timestamp, message) => {
      console.log("NewWave", from, timestamp, message);
      setAllWaves(prevState => [
        ...prevState,
        {
          address: from,
          timestamp: new Date(timestamp * 1000),
          message: message,
        },
      ]);
    };
  
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
  
      wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
      wavePortalContract.on("NewWave", onNewWave);
    }
  
    return () => {
      if (wavePortalContract) {
        wavePortalContract.off("NewWave", onNewWave);
      }
    };
  },[contractABI])

   /*
      * Check if we're authorized to access the user's wallet
      */
  
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
          Wave at Me (current Waves:{ wavesCount})
        </button>


        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}

        {allWaves.map((wave, index) => {
          return (
            <div key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
              <div>Address: {wave.address}</div>
              <div>Time: {wave.timestamp.toString()}</div>
              <div>Message: {wave.message}</div>
            </div>)
        })}

      </div>
    </div>
  );
}
