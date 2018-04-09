// const ganache = require('ganache-cli');
const Web3 = require('web3'); //Gives constructor function used to get web3 instance.
// const provider = ganache.provider();
const provider= new Web3.providers.HttpProvider("http://172.16.0.152:8548")
const web3 = new Web3(provider);
const fs = require('fs');
const path = require('path');

const { interface , bytecode } = require('../../compile');
var code = '0x'+ bytecode;

getAccounts = ()=>{
  let accounts = web3.eth.accounts;
  return {
    accounts: accounts
  }
}

deployContract = async(params )=>{
  let sampleContract = web3.eth.contract(JSON.parse(interface));
  let gasEstimate = web3.eth.estimateGas({data: code});
  
  var promise = new Promise(function(fulfill, reject) {
    sampleContract.new(
      params.buyer,
      params.seller,
      params.locDocument,
      {from: params.contractInitializer, gas: 2*gasEstimate, data: code}, 
      function(error, contract){
        if(!error) {
          if(!contract.address) {
            console.log("Contract transaction send: TransactionHash: " + contract.transactionHash + " waiting to be mined...");
          }else {
            console.log("Contract mined! Address: " + contract.address);
            console.log(contract);
            fulfill({
              success : true,
              deployed_contract_instance : contract
            })        
          }     
        }else { 
          console.log("error", error);
          reject ({
            success : false
          })    
        }  
      }
    )
  })
  
  return promise.then((response) => {
    return response;
  }).catch((err)=>{
    console.log("error", err);
    return{
      success: false
    }
  })   
}

getContractInstance = (contractAddress)=>{
  let instance = web3.eth.contract(JSON.parse(interface)).at(contractAddress);
  return{
    instance: instance
  }
}

readContractsDetailFromFile = ()=>{
  var promise = new Promise(function(fulfill, reject) {
    const filePath = path.resolve(__dirname, '', 'ContractsDetail.json');
    fs.readFile(filePath, 'utf-8', function(err, data) {
      if(err){
        reject(err);
      }else{
        var contractsDetail= JSON.parse(data);
        fulfill(contractsDetail);
      }
    })
  })
    return promise.then((response) => {
      return{
        success: true,
        contractsDetail: response
      }
    }).catch((err)=>{
      console.log("error", err);
      return{
        success: false
      }
    })
}

writeContractsDetailToFile= (contractsDetail)=>{
  var promise = new Promise(function(fulfill, reject) {
    const filePath = path.resolve(__dirname, '', 'ContractsDetail.json');
    fs.writeFile(filePath, JSON.stringify(contractsDetail), 'utf-8', function(err) {
      if(err){
        reject(err);
      }else{
        fulfill();
      }
    })
  })
  return promise.then(() => {
    return{ success: true }
  }).catch((err)=>{
    return{ success: false }
  })
}

module.exports ={
  getAccounts: getAccounts,
  deployContract: deployContract,
  getContractInstance: getContractInstance,
  readContractsDetailFromFile: readContractsDetailFromFile,
  writeContractsDetailToFile: writeContractsDetailToFile,
}
