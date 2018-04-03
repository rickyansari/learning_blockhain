// const ganache = require('ganache-cli');
// const Web3 = require('web3'); //Gives constructor function used to get web3 instance.
// const provider = ganache.provider();
// const web3 = new Web3(provider);
// const fs = require('fs');
// const path = require('path');

// const { interface , bytecode } = require('../../compile');

const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3'); //Gives constructor function used to get web3 instance.
const fs = require('fs');
const path = require('path');
const { interface , bytecode } = require('../../compile');
// const ENV = require("../../ENV");
// console.log(ENV);

const provider = new HDWalletProvider(
  );

const web3 = new Web3(provider);


getAccounts =  async ()=>{
  let accounts =  await web3.eth.getAccounts();
  //   let acoount_count = 10;
  //   let accounts = [];
  //    while(acoount_count){
  //     let account = web3.eth.accounts.create("sdjhgsadhgjasjgsjdgajsgjsagdjsagdjhagdjgwe786678#s6dw");
  //     // web3.eth.personal.newAccount('!@superpassword')
  //     // .then((resp)=>{
  //     //   console.log(resp)
  //     //   accounts.push(resp);
  //     // }).catch((err)=>{
  //     //   console.log(err);
  //     // })
  //     // let account = web3.eth.accounts.create("sdjhgsadhgjasjgsjdgajsgjsagdjsagdjhagdjgwe786678#s6dw");
  //     //  acoount_count--;
  // }
    return({
      accounts: accounts
    })
    //   accounts: accounts
    // }
    // let accounts =  await web3.eth.getAccounts();
    // return {
}

deployContract = async(params )=>{
  console.log("params", params);
  let deployed_contract_instance = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({data: bytecode, arguments:[params.buyer, params.seller, params.locDocument]})
    .send({from: params.contractInitializer, gas:'1000000'})
  return{
    deployed_contract_instance: deployed_contract_instance
  }
}

getContractInstance = async(contractAddress)=>{
  let instance = await new web3.eth.Contract(JSON.parse(interface), contractAddress);
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
