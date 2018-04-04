// const ganache = require('ganache-cli');
const Web3 = require('web3'); //Gives constructor function used to get web3 instance.
// const provider = ganache.provider();
const provider =  new Web3.providers.HttpProvider("http://127.0.0.1:54086");
const web3 = new Web3(provider);
const fs = require('fs');
const path = require('path');

const { interface , bytecode } = require('../../compile');

getAccounts =  async ()=>{
  let accounts =  await web3.eth.getAccounts();
  return {
    accounts: accounts
  }
}

deployContract = async(params )=>{
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
}
