import Web3 from 'web3';
import  {tokenAbi , stakeAbi ,  stakeAddress, tokenAddress } from "./abi";

const state = {
    tokenBalance : 0,
    totalValueLocked : 0,
    stacks : [] ,
    packages : []
}

const getters = {}
const actions = {
    // async approveSpend({state},data){
    //     window.web3 = new Web3(window.ethereum);
    //     window.currentasset1   =  await new window.web3.eth.Contract( ERC20Abi , data.address);
    //    await window.currentasset1.methods.approve(state.activeNetwork.bridgeAddress ,window.web3.utils.toBN(window.web3.utils.toWei(data.amount)).toString() ).send({from: this.state.currentUser.user.address});
         
    // },
    async availaleBalance({commit}){
        window.web3 = new Web3(window.ethereum);
        window.tokenContract   =  await new window.web3.eth.Contract( tokenAbi ,tokenAddress);
        window.stackContract   =  await new window.web3.eth.Contract( stakeAbi ,stakeAddress);
        let myBalance =   await window.tokenContract.methods.balanceOf(this.state.currentUser.user.address).call({from: this.state.currentUser.user.address});
        myBalance = window.web3.utils.fromWei(myBalance);
        let totalValueLocked =   await window.stackContract.methods.totalvaluelocked(this.state.currentUser.user.address).call({from: this.state.currentUser.user.address});
        totalValueLocked = window.web3.utils.fromWei(totalValueLocked);
        
        let stackIDs = await window.stackContract.methods.stackIDs(this.state.currentUser.user.address).call({from: this.state.currentUser.user.address});
        let stacks = [];
          for(let index = 0; index < stackIDs.length ; index++){ 
           let stack = await window.stackContract.methods.stacks(this.state.currentUser.user.address , stackIDs[index]).call({from: this.state.currentUser.user.address});  
           let data = {} 
           data.id = stackIDs[index];
           data.amount =  window.web3.utils.fromWei(stack.amount);
           data.claimed = stack.claimed;
           data.isSet = stack.isSet;
           data.packegeId = stack.packegeId;
           data.percentageReturn = stack.percentageReturn;
           data.releaseDate = stack.releaseDate;
           data.timestamp = await window.web3.eth.getBlock(await window.web3.eth.getBlockNumber()).timestamp;
           stacks.push(data);
        }
        let packageIds = await window.stackContract.methods.getPackageIds().call({from: this.state.currentUser.user.address});
        let packages = [];
        for(let index = 0; index < packageIds.length ; index++){ 
            let  _package ={};
            let value = await window.stackContract.methods.packages( packageIds[index]).call({from: this.state.currentUser.user.address});  
            _package.name = value[0];
            _package.id = packageIds[index];
            _package.minAmount = value[1];
            _package.period = value[2];
            _package.percentage = value[3];
            packages.push(_package);
         }
         commit("setPackages",packages);
        commit("setStacks" , stacks);
        commit("setTotalValueLocked" , totalValueLocked);
        commit("setmyBalance" , myBalance);
        return new Promise( (resolve) => {
            resolve(myBalance);
        })
    },
    async getTokenBalance(){
   await window.tokenContract.methods.balanceOf(this.state.currentUser.user.address).send({from: this.state.currentUser.user.address}).then(function(result){
    return new Promise((resolve ) => {
        resolve(result);
     });   
    })
}
};
const mutations = {
    setPackages(state , packages){
      state.packages = packages;
    },
    setStacks(state , stacks){

     state.stacks = stacks.reverse();
    },
    setmyBalance(state , balance){
        state.tokenBalance = balance;
    },
    setTotalValueLocked(state , totalValueLocked){
        state.totalValueLocked = totalValueLocked;
    }
}
export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}