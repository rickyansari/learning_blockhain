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
    var statusIndexResponse = getStatusIndex(currentstatus);
    if(statusIndexResponse.success)
    {
        var priority = statusIndexResponse.index;
        priority = priority +1 ;
        if(priority < statusList.length)
        {
            currentstatus = statusList[priority].statusName;
            if(operations[role][currentstatus]){   
                statusList[priority].status = true;
             }
        }
    }
 //   if( (currentstatus === "LOCPresentedForValidation" )
  //      && (role === 'seller') 
  //      && (contractDetail.sellerBank === null)){                    
  //           statusList[8].status = true;  
 //   }
       
    return{
      statusList: statusList
    }
}

getStatusIndex = (currentstatus)=>{
   
    for(var i=0;i< statuses.length ;i++){
        if(statuses[i].statusName == currentstatus ){
            return {
                success : true,
                index: i
             }
        }  
    }
    return {
        success: false
     }
}
updateStatus = (contractDetail, updtaedStatus, user, id, contractsDetail)=>{
    var promise = new Promise(function(fulfill, reject) {
     instance =  Helper.getContractInstance(contractDetail.address).instance;
        current_status =   instance.getContractStatus()
        let updateFunctionName;
        var shipmentOrTransactionId = id; 
        switch (updtaedStatus) {
            case 'LOCPresentedToSeller':
                updateFunctionName = 'updateLocPresented';
                break;
            case 'LOCPresentedForValidation':                  
                updateFunctionName = 'updateValidation';
                break;   
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
                reject({success:false})
        }
        if(updtaedStatus == "GoodsDispatched")
        {
            instance.setShipmentId(shipmentOrTransactionId,
                {from:user.address},
                function(error, result){
                    if (!error){
                        console.log('set shipment id response:', result);         
                    }else{
                        reject({success:false})                 
                    }       
                })
        }
        if(updtaedStatus == "MoneyTrasnferred")
        {
            instance.setTransactionId(shipmentOrTransactionId,
                {from:user.address},
                function(error, result){
                    if (!error){
                        console.log('set transaction id response:', result);   
                    }else{
                        reject({success:false})
                    }       
                })
        }
        instance[updateFunctionName]({from:user.address}, function(error, response){
            var loop_count = 5;
            if (!error){
                var intervalObject = setInterval(function () { 
                    instance.getContractStatus(function(err, resp){
                        if(!err){
                            let updated_status =  resp;
                            if(current_status === updated_status){
                                --loop_count;
                                if(!loop_count){
                                    clearInterval(intervalObject);
                                    reject({success:false})
                                }
                            }else{  
                                clearInterval(intervalObject);
                                fulfill({success : true})
                            }   
                        }else{
                            reject({success:false})
                        }       
                    })
                }, 5000); 
            }else{
                reject({success:false})
            }
        })
    })
    
    return promise.then((response) => {
      return response;
    }).catch((err)=>{
      console.log("error", err);
      return{
        success: false
      }
    })   
}

module.exports ={
  getCurrentStatus: getCurrentStatus,
  getStatusList: getStatusList,
  updateStatus: updateStatus,
  getStatusIndex: getStatusIndex
}
