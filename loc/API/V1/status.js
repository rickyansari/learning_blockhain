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
    'statusName' : 'LocCreated'
  },
   {
    'status' : false,
    'statusName' : 'LOCPresentedToSeller'
  },
   {
    'status' : false,
    'statusName' : 'LOCPresentedForValidation'
  },
   {
    'status' : false,
    'statusName' : 'LOCValidated'
  },
   {
    'status' : false,
    'statusName' : 'GoodsDispatched'
  },
   {
    'status' : false,
    'statusName' : 'GoodsReceived'
  },
   {
    'status' : false,
    'statusName' : 'MoneyTrasnferred'
  },
   {
    'status' : false,
    'statusName' : 'MoneyReceived'
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
    var instance = response.instance;
    let updateFunctionName;
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
            return{success:false}
    }
    return instance.methods[updateFunctionName]().send({from: user.address}).then(async ()=>{
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
  })
}

module.exports ={
  getCurrentStatus: getCurrentStatus,
  getStatusList: getStatusList,
  updateStatus:updateStatus
}
