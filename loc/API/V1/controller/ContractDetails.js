const Helper = require('../Helper');
const Status = require('../status');
	


getDealDetails = async(contractName, user, contractsDetail)=>{
	let dealDetails = {	};
	let contractDetail = contractsDetail.contractsDetail[contractName];
	let buttonsList;
	 let response = Helper.getContractInstance(contractDetail.address);
		let contractStatus =  response.instance.getContractStatus()
		let locDocumentHash =  response.instance.getLocDocumentHash()
		let shipmentId =  response.instance.getShipmentId()
		let transactionId =  response.instance.getTransactionId()
		let role = getRole(contractName, user, contractsDetail).role;
		console.log('role', role);
		let buttonList = Status.getStatusList(contractStatus, role, contractDetail).statusList;
		let sellerBankName;
		if(contractDetail.sellerBank)
				sellerBankName = contractDetail.sellerBank.name;
		else
			sellerBankName = ""
		dealDetails = {
				'contractName' : contractName,
				'buyer' : contractDetail.buyer.name,
				'seller' : contractDetail.seller.name,
				'buyerBank' : contractDetail.buyerBank.name,
				'sellerBank' : sellerBankName,
				'locDocument' : contractDetail.locDocument,
				'locDocumentHash' : locDocumentHash,
				'currentStatus' : contractStatus,
				'shipmentId' : shipmentId,
				'transactionId' : transactionId,
				'buttonList' : buttonList
			}
			console.log('dealDetails : ',dealDetails )
			return{
				success: true,
				dealDetails: dealDetails
			}
	
	// let contractInstance;
	// Helper.getContractInstance(contractDetails.address).then((response)=>{

	// 	contractInstance = response.instance;
	// 	console.log('contractInstance indside' + contractInstance);
  //  })
  //  	console.log('contractInstance outside' + contractInstance);
  //  Status.getCurrentStatus(contractInstance).then((response)=>{
	// 			console.log("Current status is" + response.currentStatus);
	//   })
}

getRole = (contractName, userName, contractsDetail)  =>{	
	let contractDetails = contractsDetail.contractsDetail[contractName];
	var  role;
	if(contractDetails.buyer.name == userName)
		role = 'buyer';
	else if(contractDetails.seller.name == userName)
		role = 'seller';
	else if(contractDetails.buyerBank.name == userName)
		role = 'buyerBank';
	else if(contractDetails.sellerBank.name == userName)
		role = 'sellerBank';
	  return {
    role: role
  }
}

module.exports =
{
  getRole: getRole,
  getDealDetails: getDealDetails
  }