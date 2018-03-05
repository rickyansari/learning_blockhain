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

checkStatusFlow = async(contractInstance, next_status)=>{
  let current_status =  await contractInstance.methods.status().call();
  switch (currentStatus) {
    case '':
      if (next_status === 'GoodsDispatched'){
        return { success: true}
      }else{
        return {success: false}
      }
    case 'GoodsDispatched':
      if (next_status === 'GoodsReceived'){
        return { success: true}
      }else{
        return {success: false}
      }
    case 'GoodsReceived':
      if (next_status === 'MoneyTrasnferred'){
        return { success: true}
      }else{
        return {success: false}
      }
    case 'MoneyTrasnferred':
      if (next_status === 'MoneyReceived'){
        return { success: true}
      }else{
        return {success: false}
      }
    case 'MoneyReceived':
      return{ success: false}
    default:
      return{ success: false}
  }
}

module.exports ={
  getAccounts: getAccounts,
  deployContract: deployContract
}
