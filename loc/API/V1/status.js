const {getDealDetails} = require('./controller/ContractDetails');
const Helper = require('./Helper');
const operations = {
  'buyer' : {
    'LOCPresentedToSeller' : '2',
    'GoodsReceived' : '6'
  },
  'seller' : {
    'LOCPresentedForValidation' : '3',
    'GoodsDispatched' : '5'
  },
  'buyerBank' : {
    'LocCreated' : '1',
    'MoneyTrasnferred' : '7'
  },
  'sellerBank' : {
    'LOCValidated' : '4',
    'MoneyReceived' : '8'
  }
};

const statuses = [

   {
    'status' : false,
    'statusName' : 'LocCreated',
	'buttonName' : 'Loc Created'
  },
   {
    'status' : false,
    'statusName' : 'LOCPresentedToSeller',
	'buttonName' : 'Present LOC To Seller'
  },
   {
    'status' : false,
    'statusName' : 'LOCPresentedForValidation',
	'buttonName' : 'Present LOC For Validation'
  },
   {
    'status' : false,
    'statusName' : 'LOCValidated',
	'buttonName' : 'LOC Validated'
  },
   {
    'status' : false,
    'statusName' : 'GoodsDispatched',
	'buttonName' : 'Goods Dispatched'
  },
   {
    'status' : false,
    'statusName' : 'GoodsReceived',
	'buttonName' : 'Goods Received'
  },
   {
    'status' : false,
    'statusName' : 'MoneyTrasnferred',
	'buttonName' : 'Money Transfered'
  },
   {
    'status' : false,
    'statusName' : 'MoneyReceived',
	'buttonName' : 'Money Received'
  },
  {
    'status' : false,
    'statusName' : 'AddSellerBank',
	'buttonName' : 'Add Seller Bank'
}

];

getCurrentStatus = async(contractInstance)=>{
    let current_status =  await contractInstance.methods.status().call();
    return{
        currentStatus: current_status
    }
}

getStatusList = (currentstatus, role , contractDetail)=>{
    let statusList =statuses;
    for(var i=0;i< statusList.length ;i++){
        statusList[i].status = false;  
    }
    console.log('statusList : ', statusList);
    var priority;
    for(var i=0;i< Object.keys(statusList).length ;i++){
        if(statusList[i].statusName == currentstatus ){
            priority = i;
            break;
        }  
    }
    priority = priority +1 ;
    currentstatus = statusList[priority].statusName;
    if( (currentstatus === "LOCPresentedForValidation" )
        && (role === 'seller') 
        && (contractDetail.sellerBank === null)){                    
             statusList[8].status = true;  
    }else if(operations[role][currentstatus]){   
        statusList[priority].status = true;
    }
    return{
      statusList: statusList
    }
}

updateStatus = (contractDetail, updtaedStatus, user, contractsDetail)=>{
    return Helper.getContractInstance(contractDetail.address).then((response) => {
    var instance = response.instance;
    let updateFunctionName;
    switch (updtaedStatus) {
        case 'LOCPresentedToSeller':
            updateFunctionName = 'updateLocPresented';
            break;
        case 'LOCPresentedForValidation':
        {
            if(contractDetail.sellerBank){
                updateFunctionName = 'updateValidation';
                break; 
            }else{
                return{ success: false}
            }
        }
        case 'LOCValidated':
            updateFunctionName = 'updateValidated';	
            break;
        case 'GoodsDispatched':
            updateFunctionName = 'updateGoodsDispatched';	
            break;
        case 'GoodsReceived':
            updateFunctionName = 'updateGoodsReceived';
            break;
        case 'MoneyTrasnferred':
            updateFunctionName = 'updateMoneyTransferred';	
            break;
        case 'MoneyReceived':
            updateFunctionName = 'updateMoneyReceived';	
            break;
        default:
            return{success:false}
    }
    return instance.methods[updateFunctionName]().send({from: user.address}).then(async ()=>{
        let status = await instance.methods.getContractStatus().call();
        return{
           success : true,
        }   
      }).catch((err)=>{
        return {
           success: false
        }
      })
  })
}

module.exports ={
  getCurrentStatus: getCurrentStatus,
  getStatusList: getStatusList,
  updateStatus:updateStatus
}
