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

Helper.getAccounts()
.then((response)=>{
  accounts = response.accounts;
  Object.keys(usersDetail).map((user, index)=>{
    usersDetail[user].address = accounts[index];
  })
});

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
  let response = await getDealDetails( apiParams.contractName, apiParams.userName, contractsDetail);
  console.log('response is : \n',response)
  res.send(response)
})

app.post('/addSellerBank', jsonParser, async (req, res) => {
  var apiParams = req.body;
  let contractDetail = contractsDetail.contractsDetail[apiParams.contractName];
  let sellerBankAddress = usersDetail[apiParams.userName].address;
  if(contractDetail.address && contractDetail.seller.address){
    Helper.getContractInstance(contractDetail.address).then((resp)=>{
      resp.instance.methods.createSellerBank(sellerBankAddress).send({from:contractDetail.seller.address}).then((response)=>{
        contractDetail.sellerBank= usersDetail[apiParams.userName];
		console.log(contractsDetail);
        res.send({success:true})
      })
    }).catch((err)=>{
      res.send({success:false});
    })
  }else {
    res.send({success:false});
  }
})

app.post('/updateStatus', jsonParser, async (req, res) => {
  var apiParams = req.body; 
  let response = await updateStatus(
    contractsDetail.contractsDetail[apiParams.contractName], 
    apiParams.updatedStatus,
    usersDetail[apiParams.userName],apiParams.shipmentOrTransactionId,
    contractsDetail
  );
  if(response.success){
    let dealDetail = await getDealDetails(contractsDetail.contractsDetail[apiParams.contractName].name, 
      apiParams.userName, contractsDetail);
    res.send(dealDetail);
  }else{
    res.send(response)
  }
})


app.post('/validateContractName',jsonParser, async (req, res)=> {
  var apiParams = req.body;
  let response = {	"isExists": false};
  	if(contractsDetail.contractsDetail[apiParams.contractName])
	    {
		    console.log('in if loop',contractsDetail.contractsDetail[apiParams.contractName]);
        response["isExists"] =  true;
			
	    }
  //let response =  validateContractName( apiParams.contractName, contractsDetail);
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
  Helper.getContractInstance(contractsDetail.contractsDetail.Contract0.address).then((response)=>{
    response.instance.methods.status().call().then((response)=>{
      console.log('response', response);
      res.send('Got a POST request')
    })
  })
})

app.listen(3000, () => console.log('Express server listening on port 3000!'))
