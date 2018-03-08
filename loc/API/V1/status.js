const {getDealDetails} = require('./controller/ContractDetails');
const Helper = require('./Helper');
const operations = {
	'buyer' : {
		'LOCPresentedToSeller' : '2',
		'Goods Received' : '6'
	},
	'seller' : {
		'LOC Presented for Validation' : '3',
		'Goods Dispatched' : '5'
	},
	'buyerBank' : {
		'LocCreated' : '1',
		'Money Debited' : '7'
	},
	'sellerBank' : {
		'LOC Validated' : '4',
		'Money Credited' : '8'
	}
};

const statuses = [

	 {
		'status' : false,
		'statusName' : 'LocCreated'
	},
	 {
		'status' : false,
		'statusName' : 'LOCPresentedToSeller'
	},
	 {
		'status' : false,
		'statusName' : 'LOC Presented for Validation'
	},
	 {
		'status' : false,
		'statusName' : 'LOC Validated'
	},
	 {
		'status' : false,
		'statusName' : 'Goods Dispatched'
	},
	 {
		'status' : false,
		'statusName' : 'Goods Received'
	},
	 {
		'status' : false,
		'statusName' : 'Money Debited'
	},
	 {
		'status' : false,
		'statusName' : 'Money Credited'
	}

];


getCurrentStatus = async(contractInstance)=>{
   let current_status =  await contractInstance.methods.status().call();
  return{
    currentStatus: current_status
  }
}

getStatusList = (currentstatus, role )=>{
	let statusList = statuses;
	var priority;
	for(var i=0;i< statusList.length;i++)
	{
		if(statusList[i].statusName == currentstatus )
		{
			priority = i;
			break;
		}
	}
	priority = priority +1 ;
	currentstatus = statusList[priority].statusName;
	console.log('operations[role][currentstatus]',operations[role][currentstatus])
	if (operations[role][currentstatus]){		
		statusList[priority].status = true;
	}
  	return{
    	statusList: statusList
    }
}

updateStatus = (contractDetail, updtaedStatus, user, contractsDetail)=>{
	return Helper.getContractInstance(contractDetail.address).then((response) => {
		if(updtaedStatus == statuses[1].statusName){
			var instance = response.instance;
			return instance.methods.updateLocPresented().send({from: user.address}).then(async () =>{
				let status = await instance.methods.getContractStatus().call();
				console.log("status", status);
				// let response = await getDealDetails( contractDetail.name, user.name, contractsDetail);
				return{
					success : true,
				}		
			}).catch((err)=>{
				return {
					success: false
				}
			})
		}
		return {
			success: false
		}
	})

 
}

module.exports ={
  getCurrentStatus: getCurrentStatus,
  getStatusList: getStatusList,
  updateStatus:updateStatus
}
