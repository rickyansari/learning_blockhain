var {usersDetail} = require('../UsersDetail');

verifyAndGetUserDetail= (params, contractsDetail)=>{
  if(params.userName && usersDetail[params.userName]){
    if((usersDetail[params.userName].password === params.password)){
      getUserDetails(usersDetail[params.userName].name, contractsDetails);
    }
  }
  return {success: false};
}

getUserDetails = (userName, contractsDetail)=>{
  if(contractsDetail && contractsDetails.length){
    contractsDetail[0].map((contract)=>{
      let response = getContractNameAndRoleOfUser(userName, contract);
      if(response.success){

      }
    })
  }
  return {
    success: true
  }
}

getContractNameAndRoleOfUser= ()=>{

}

module.exports = {
  verifyAndGetUserDetail: verifyAndGetUserDetail
}
