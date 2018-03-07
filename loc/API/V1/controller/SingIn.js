var {usersDetail} = require('../UsersDetail');
var Helper = require('../Helper');
const inValidStatusForSeller = [];
const inValidStatusForSellerBank = [];

verifyAndGetUserDetail= (params, contractsDetail)=>{
  if(params.userName && usersDetail[params.userName]){
    if((usersDetail[params.userName].password === params.password)){
      console.log("authentic user");
      getUserDetails(usersDetail[params.userName].name, contractsDetail).then((response)=>{
        console.log("user_data", response);
        return response;
      })
    }
  }
  return {success: false};
}

getUserDetails = (userName, contractsDetail)=>{
  var promise = new Promise(function(fulfill, reject) {
    var data = [];
    if(contractsDetail && Object.keys(contractsDetail).length){
      console.log("fetching data");
      var indexOfLastContract = Object.keys(contractsDetail).length - 1;
      Object.keys(contractsDetail).map((contract, index)=>{
        console.log("index", index);
        console.log("length", Object.keys(contractsDetail).length)
        let response = getContractNameAndRoleOfUser(userName, contractsDetail[contract])
        .then((response)=>{
          if(response.success){
            data.push(response.data);
          }
          if(indexOfLastContract === index){
            fulfill(data);
          }
        })
      })
    }else{
        fulfill(data);
      }
    })
    return promise.then((response) => {
      console.log("response", response);
      return{
        success: true,
        data: response
      }
    }).catch((err)=>{
      console.log("error", err);
      return{
        success: false
      }
    })
}

getContractNameAndRoleOfUser = async (name, contract) => {
  return Helper.getContractInstance(contract.address).then(async (response) => {
    let contractStatus = await response.instance.methods.status().call();
    console.log("contractStatus", contractStatus);
    let success = false;
    let role;

    if (contract.buyer && contract.buyer.name === name) {
      role = "buyer";
    } else if (contract.buyerBank && contract.buyerBank.name === name) {
      role = "buyerBank";
    } else if (contract.seller && contract.seller.name === name) {
      if (!inValidStatusForSeller.includes(contractStatus)) {
        role = "seller";
      }
    } else if (contract.sellerBank && contract.sellerBank.name === name) {
      if (!inValidStatusForSellerBank.includes(contractStatus)) {
        role = "sellerBank";
      }
    }
    if (role) {
      return {
        success: true,
        data: {
          role: role,
          contractName: contract.name
        }
      };
    } else {
      return { success: false };
    }
  });
};


module.exports = {
  verifyAndGetUserDetail: verifyAndGetUserDetail
}
