const express = require('express');
const app = express();
const url = require('url');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

const { createContract } = require('./controller/CreateContract');
const { getDealDetails } = require('./controller/ContractDetails');
const { updateStatus } = require('./status')
const { verifyUser, getUserDetails } = require('./controller/SingIn');
const Helper = require('./Helper');
var { usersDetail } = require('./UsersDetail');

var accounts;
var contractsDetail = {'contractsDetail':{}};

accounts = Helper.getAccounts().accounts;
Object.keys(usersDetail).map((user, index)=>{
  usersDetail[user].address = accounts[index];
})

app.post('/signIn', jsonParser, async (req, res)=> {
  var params = req.body;
  let response = verifyUser(params);
  res.send(response);
})

app.post('/getContracts', jsonParser, async (req, res)=> {
  var params = req.body;
  getUserDetails(params.userName, contractsDetail.contractsDetail).then((response)=>{
    res.send(response);
  });
})

app.post('/createContract', jsonParser, async (req, res) => {
  var apiParams = req.body;
  let response = await createContract(usersDetail, contractsDetail, apiParams);
  res.send(response)
})

app.post('/getDealDetails', jsonParser, async (req, res) => {
  var apiParams = req.body;
  console.log(apiParams, "q")
  let response =  getDealDetails( apiParams.contractName, apiParams.userName, contractsDetail);
  console.log('response is : \n',response)
  res.send(response)
})

app.post('/addSellerBank', jsonParser, async (req, res) => {
  var apiParams = req.body;
  let contractDetail = contractsDetail.contractsDetail[apiParams.contractName];
  let sellerBankAddress = usersDetail[apiParams.userName].address;
  if(contractDetail.address && contractDetail.seller.address){
    var contractInstance = Helper.getContractInstance(contractDetail.address).instance;
    contractInstance.createSellerBank(
      sellerBankAddress,
      {from:contractDetail.seller.address},
      function(error, result){
        if (!error){
          contractDetail.sellerBank =usersDetail[apiParams.userName];
          console.log(contractDetail);
          res.send({success:true})
        }else{
          res.send({success:false});
        }
    });
  }else {
    res.send({success:false});
  }
});

app.post('/updateStatus', jsonParser, async (req, res) => {
  var apiParams = req.body; 
  let response =  updateStatus(
    contractsDetail.contractsDetail[apiParams.contractName], 
    apiParams.updatedStatus,
    usersDetail[apiParams.userName],apiParams.shipmentOrTransactionId,
    contractsDetail
  ).then((response)=>{
    if(response.success){
      let dealDetail =  getDealDetails(
        contractsDetail.contractsDetail[apiParams.contractName].name, 
        apiParams.userName, contractsDetail
      );
      res.send(dealDetail);
    }else{
      res.send(response)
    }
  }).catch((err)=>{
    res.send({ success: false });
  });
 
});

app.post('/validateContractName',jsonParser, async (req, res)=> {
  var apiParams = req.body;
  let response = {"isExists": false};
  if(contractsDetail.contractsDetail[apiParams.contractName]){
	  console.log('in if loop',contractsDetail.contractsDetail[apiParams.contractName]);
    response["isExists"] =  true;
	}
  console.log('response is : \n',response)
  res.send(response)
})

app.post('/verifyLoc',jsonParser, async (req, res)=> {
  var apiParams = req.body;
  if(contractsDetail.contractsDetail[apiParams.contractName]){
    Helper.getContractInstance(contractsDetail.contractsDetail[apiParams.contractName].address).then(async (response)=>{
      let result = await response.instance.methods.verifyLocDocument(apiParams.locDocument).call();
      res.send({ success: result });
    }).catch((err)=>{
      res.send({ success: false });
    })
  }else{
    res.send({ success: false });
  }		  
})

app.get('/user', async (req, res)=> {
  Helper.getContractInstance(contractsDetail.contractsDetail.contractName.address).then((response)=>{
    response.instance.methods.status().call().then((response)=>{
      console.log('response', response);
      res.send('Got a POST request')
    })
  })
})

app.listen(3000, () => console.log('Express server listening on port 3000!'))
