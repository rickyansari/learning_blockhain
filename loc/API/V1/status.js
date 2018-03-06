deployContract = async(contract_initializer)=>{
  let deployed_contract_instance = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({data: bytecode, arguments:["PNB"]})
    .send({from: contract_initializer, gas:'1000000'})
  return{
    deployed_contract_instance: deployed_contract_instance
  }
}