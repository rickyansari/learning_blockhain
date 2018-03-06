const operations = {
	'buyer' : {
		'LOC Presented' : '2',
		'Goods Received' : '6'
	},
	'seller' : {
		'LOC Presented for Validation' : '3',
		'Goods Dispatched' : '5'
	},
	'buyerBank' : {
		'LOC Created' : '1',
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
		'statusName' : 'LOC Created'
	},
	 {
		'status' : false,
		'statusName' : 'LOC Presented'
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

getStatusList = async(currentstatus, role )=>{
	let statusList = statuses;
if (operations[role][currentstatus] != undefined)
	{
		var priority = parseInt(operations[role][currentstatus]);
		statusList[priority+1-1].status = true;
//		console.log(operations[role][current_status])
	}
  return{
    statusList: statusList
  }
}

updateStatus = async(contractInstance)=>{
 
 
}
module.exports ={
  getCurrentStatus: getCurrentStatus,
  getStatusList: getStatusList
  
}
