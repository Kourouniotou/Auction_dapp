import React, { Component } from "react";
import AuctionContract from "./contracts/Auction.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = {web3: null, accounts: null, contract: null, input: "", highestBid: 0, highestBidder: null, yourAccount: 0};

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = AuctionContract.networks[networkId];
      const instance = new web3.eth.Contract(
        AuctionContract.abi,
        "0x6d9D840475CdD72702C123434511BE38dBFDFfC5",
      );
      //const ContractBalance = await web3.eth.getBalance(instance.address);

      //apo edw kai katw dika mou
      const highestBid_response = await instance.methods.highestBid().call();
      const highestBidder_response = await instance.methods.highestBidder().call();
      const yourAccount_response = await instance.methods.userBalances(accounts[0]).call();

      this.setState({ web3, accounts, contract: instance, highestBid: highestBid_response,  highestBidder: highestBidder_response, yourAccount: yourAccount_response});
      
      // example of interacting with the contract's methods.
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  bid = async () => {
    const { accounts, contract, web3 } = this.state;
    // Stores the given value
    await contract.methods.bid().send({ from: accounts[0], value: this.state.input});
    
    const highestbid = await contract.methods.highestBid().call();
    
    const highestbidder = await contract.methods.highestBidder().call();
    
    
    this.setState({highestBid: highestbid,  highestBidder: highestbidder, yourAccount : this.state.input});
  };
  
  withdraw = async () => {
    const { accounts, contract } = this.state;

    await contract.methods.withdraw().send({ from: accounts[0]});
    
    const highestbid = await contract.methods.highestBid().call();
    
    const highestbidder = await contract.methods.highestBidder().call();
    
    this.setState({highestBid: highestbid,  highestBidder: highestbidder, yourAccount: 0});
  };

 myChangeHandler = (event) => {
    this.setState({input: event.target.value}, () => {
      console.log(this.state.input)
    });
  }
  
  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Auction</h1>
        
        <h3>Information about the status of the auction:</h3>
        <div className = "informations">Highest Bid: {this.state.highestBid}</div>
        <div className = "informations">Highest Bidder: {this.state.highestBidder}</div>
        
        <h1>****</h1>
        
        <h3>Information about you:</h3>
        <div>Your bid: {this.state.yourAccount}</div>
        
        <h1>****</h1>
        
        <h3>Here you can enter the ammount that you want to bid:</h3>
	<input type='text' placeholder = "Enter your text" onChange={this.myChangeHandler}/>
	<button onClick={this.bid}>Bid</button>
	<button onClick={this.withdraw}>Withdraw</button>
      </div>
    );
  }
}

export default App;
