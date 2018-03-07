const Helper = require('../Helper');

createContract= (usersDetail, contractsDetail, apiData)=>{
  var promise = new Promise(function(fulfill, reject) {
    var buyer = usersDetail[apiData.buyer];
    var seller = usersDetail[apiData.seller]
    var buyerBank = usersDetail[apiData.buyerBank]
    let params={
      contractInitializer: buyerBank.address,
      buyer: buyer.address,
      seller: seller.address,
      locDocument: apiData.locDocument,
    }
    Helper.deployContract(params).then((response)=>{
      if(response.deployed_contract_instance.options.address){
        let contract_name = 'Contract' + Object.keys(contractsDetail.contractsDetail).length;
        let contract_detail= {
          address: response.deployed_contract_instance.options.address,
          name: contract_name,
          buyer:buyer,
          seller:seller,
          buyerBank:buyerBank,
          sellerBank:null,
          locDocument:params.locDocument,
        }
        contractsDetail.contractsDetail[contract_name] = contract_detail;
        Helper.writeContractsDetailToFile(contractsDetail)
        .then((response)=>{
          fulfill({success: true});
        })
      }else{
        fulfill({success: false});
      }
    }).catch((err)=>{
      reject(err);
    })
  })

  return promise.then((response) => {
    return response
  }).catch((err)=>{
      console.log("error",err);
      return{ success: false }
  })
}

writeData= ()=>{

}

module.exports ={
  createContract: createContract

}
