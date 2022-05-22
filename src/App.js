import { ethers } from "ethers";
import React, {useEffect, useState} from "react";

import abi from "./utils/WavePortal.json";
import './App.css';

export default function App() {
  const [currentAccount, setCurrentAccount] = useState("");
  const contractAddress = "0x6109ea6bD5e066A680E96a901879e3808031B0fF"
  const [waves, setWaves] = useState(0)
  const contractABI = abi.abi;
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
        setWaves(count.toNumber())
        console.log("Total wave count:", count.toNumber());

         /*
        * Execute the actual wave from your smart contract
        */
         const waveTxn = await wavePortalContract.wave();
         console.log("Mining...", waveTxn.hash);
 
         await waveTxn.wait();
         console.log("Mined -- ", waveTxn.hash);
 
         count = await wavePortalContract.getTotalWaves();

         console.log("Retrieved total wave count...", count.toNumber());
         setWaves(count.toNumber())
      } else {
        console.log("Ethereum object doesn't exist");
      }
    } catch (error){
      console.log(error);
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected();
  },[])

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
          Wave at Me (current Waves:{ waves})
        </button>


        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}

      </div>
    </div>
  );
}
