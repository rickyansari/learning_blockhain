// const ganache = require('ganache-cli');
// const Web3 = require('web3'); //Gives constructor function used to get web3 instance.
// const provider = ganache.provider();
// const web3 = new Web3(provider);
// const fs = require('fs');
// const path = require('path');

// const { interface , bytecode } = require('../../compile');

var Tx = require('ethereumjs-tx');
const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3'); //Gives constructor function used to get web3 instance.
const fs = require('fs');
const path = require('path');
const { interface , bytecode } = require('../../compile');
// const ENV = require("../../ENV");
// console.log(ENV);

const provider = new HDWalletProvider(
  "express wide carry cash arena surround wife saddle grow nose light grocery",
  "https://rinkeby.infura.io/ALM3eEu1XllO1tzuejl0"
  );

const web3 = new Web3(provider);


getSignedTransactionData = (address)=>{
  var privateKey = new Buffer('bb2505f150579305f35083492678d5d94f18870126db69b9cbf247d349f832fa', 'hex')
  
  var rawTx = {
    nonce: '0x00',
    gasPrice: '0x09184e72a000',
    gasLimit: '0x2710',
    to: '0x0000000000000000000000000000000000000000',
    value: '0x00',
    from: address,
    data: '0x7f7465737432000000000000000000000000000000000000000000000000000000600057'
  }
  
  var tx = new Tx(rawTx);
  tx.sign(privateKey);
  
  var serializedTx = tx.serialize();
  return serializedTx;
}




isUnlocked = async (address)=>{
  try {
      await web3.eth.sign("", address);
  } catch (e) {
      web3.eth.personal.unlockAccount(address, 'ricky@26790', 3000)
      .then((resp)=>{
        console.log("resp",resp);
        return false;
      }).catch((err)=>{
        console.log("err",err);
      })
  }
  return true;
}


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
    .send({from: params.contractInitializer, gas:'1900000'}).on('transactionHash', function(hash){
      web3.eth.getTransaction(hash)
.then(response=>{
 // console.log(response);
});

//      console.log(hash);
})
    let contractStatus = await deployed_contract_instance.methods.getCurrentStatus().call(); 
    console.log(contractStatus);
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
  isUnlocked:isUnlocked,
  getSignedTransactionData: getSignedTransactionData,
}
