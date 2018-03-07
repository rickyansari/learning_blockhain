const Helper = require('../Helper');

createContract= (usersDetail, contractsDetail, data)=>{
  var promise = new Promise(function(fulfill, reject) {
    var buyer = usersDetail[data.buyer];
    var seller = usersDetail[data.seller]
    var buyerBank = usersDetail[data.buyerBank]
    let params={
      buyer: buyer.address,
      seller: seller.address,
      locDocument: data.locDocument,
    }
    Helper.deployContract(buyerBank.address, params).then((response)=>{
      if(response.deployed_contract_instance.options.address){
        let contract_name = 'Contract' + Object.keys(contractsDetail.contractsDetail).length;
        let contract_detail= {
          address: response.deployed_contract_instance.options.address,
          name: contract_name,
          buyer:buyer,
          seller:seller,
          buyer_bank:buyerBank,
          seller_bank:null,
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
      return{ success: false }
  })
}

writeData= ()=>{

}

module.exports ={
  createContract: createContract

}
