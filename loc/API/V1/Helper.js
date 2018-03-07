const ganache = require('ganache-cli');
const Web3 = require('web3'); //Gives constructor function used to get web3 instance.
const provider = ganache.provider();
const web3 = new Web3(provider);
const fs = require('fs')
const { interface , bytecode } = require('../../compile');

getAccounts =  async ()=>{
  let accounts =  await web3.eth.getAccounts();
  return {
    accounts: accounts
  }
}

deployContract = async(contract_initializer)=>{
  let deployed_contract_instance = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({data: bytecode, arguments:["PNB"]})
    .send({from: contract_initializer, gas:'1000000'})
  return{
    deployed_contract_instance: deployed_contract_instance
  }
}

getContractInstance = async(contractAddress)=>{
  let instance = await new web3.eth.Contract(JSON.parse(interface), contractAddress);
  console.log(instance);
  return{
    instance: instance
  }
}

readContractsDetailFromFile = ()=>{
  var promise = new Promise(function(fulfill, reject) {
    fs.readFile('./ContractsDetail.json', 'utf-8', function(err, data) {
      if(err){
        reject(err);
      }else{
        var contractsDetail= JSON.parse(data);
        fulfill(contractsDetail);
      }
    })
  })
  return promise.then((response) => {
    console.log("response", response);
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
    data = {contractsDetail:contractsDetail}
    fs.writeFile('./ContractsDetail.json', JSON.stringify(data), 'utf-8', function(err) {
      if(err){
        reject(err);
      }else{
        fulfill();
      }
    })
  })
  return promise.then(() => {
    console.log("successfull");
    return{
      success: true,
    }
  }).catch((err)=>{
    console.log("error", err);
    return{
      success: false
    }
  })
}

module.exports ={
  getAccounts: getAccounts,
  deployContract: deployContract,
  getContractInstance: getContractInstance,
  readContractsDetailFromFile: readContractsDetailFromFile,
  writeContractsDetailToFile: writeContractsDetailToFile,
}
