const Helper = require('../Helper');
const Status = require('../status');
	


getDealDetails = async(contractName, user, contractsDetail)=>{
	let dealDetails = {	};
	let contractDetail = contractsDetail.contractsDetail[contractName];
	let buttonsList;
	Helper.getContractInstance(contractDetail.address).then(async (response) => {
		let contractStatus = await response.instance.methods.getContractStatus().call();
		let locDocumentHash = await response.instance.methods.getLocDocumentHash().call();
		let role = getRole(contractName, user, contractsDetail).role;
		Status.getStatusList(contractStatus,role).then((response) => {
			buttonsList = response.statusList;
		});
		console.log("contractStatus", contractStatus);
		console.log("contractStatus", locDocumentHash);
		dealDetails = {
			'locDocument' : contractDetail.locDocument,
			'locDocumentHash' : locDocumentHash,
			'currentStatus' : contractStatus,
			'buttonsList' : buttonsList
		}
		return{
			dealDetails: dealDetails
		}
	});
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

getRole = async(contractName, userName, contractsDetail)  =>{	
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

module.exports ={
  getRole: getRole,
  getDealDetails: getDealDetails
  }