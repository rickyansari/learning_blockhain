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
    'MoneyTransferred' : '7'
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
    'statusName' : 'MoneyTransferred',
	'buttonName' : 'Money Transferred'
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
    return Helper.getContractInstance(contractDetail.address).then(async (response) => {
    var instance = response.instance;
    let current_status =  await instance.methods.getContractStatus().call();
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
        case 'MoneyTransferred':
            updateFunctionName = 'updateMoneyTransferred';	
            break;
        case 'MoneyReceived':
            updateFunctionName = 'updateMoneyReceived';	
            break;
        default:
            return{success:false}
    }
    if(updtaedStatus == "GoodsDispatched")
    {
         instance.methods.setShipmentId(shipmentOrTransactionId).send({from: user.address}).then((response)=>{
            console.log('set shipment id response:', response);           
        }).catch((err)=>{
        return {
           success: false
        }
      })
    }
    if(updtaedStatus == "MoneyTrasnferred")
    {
         instance.methods.setTransactionId(shipmentOrTransactionId).send({from: user.address}).then((response)=>{
            console.log('set transaction id response:', response);           
        }).catch((err)=>{
        return {
           success: false
        }
      })
    }


    let serializedTx = Helper.getSignedTransactionData(user.address);
    return instance.methods[updateFunctionName]().sendSignedTransaction('0x' + serializedTx.toString('hex')).then(async (response)=>{
 //      console.log(response);
        let status = await instance.methods.getContractStatus().call();
        if(current_status == status)
            return{
                success : false,
            } 
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
  updateStatus: updateStatus,
  getStatusIndex: getStatusIndex
}
