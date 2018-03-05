const ganache = require('ganache-cli');
const Web3 = require('web3'); //Gives constructor function used to get web3 instance.
const provider = ganache.provider();
const web3 = new Web3(provider);
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

module.exports ={
  getAccounts: getAccounts,
  deployContract: deployContract
}