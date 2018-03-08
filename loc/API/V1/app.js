const express = require('express');
const app = express();
const url = require('url');

const Helper = require('./Helper');
const { verifyUser, getUserDetails} = require('./controller/SingIn');
const {createContract} = require('./controller/CreateContract');
const {getDealDetails} = require('./controller/ContractDetails');
const {updateStatus} = require('./status')
var {usersDetail} = require('./UsersDetail');

var accounts;
var contractsDetail = {'contractsDetail':{}};

Helper.getAccounts()
.then((response)=>{
  accounts = response.accounts;
  Object.keys(usersDetail).map((user, index)=>{
    usersDetail[user].address = accounts[index];
  })
});



app.post('/singIn', async (req, res)=> {
  var params = url.parse(req.url, true).query;
  console.log("params", params);
  let response = verifyUser(params);
  if(response.success){
    getUserDetails(response.name, contractsDetail.contractsDetail).then((response)=>{
      res.send(response)
    })
  }else{
    res.send({success: false})
  }
})

app.post('/createContract', async (req, res) => {
  var apiParams = url.parse(req.url, true).query;
  console.log(apiParams, "q")
  let response = await createContract(usersDetail, contractsDetail, apiParams);
  res.send(response)
})

app.post('/getDealDetails', async (req, res) => {
  var apiParams = url.parse(req.url, true).query;
  console.log(apiParams, "q")
  let response = await getDealDetails( apiParams.contractName, apiParams.userName, contractsDetail);
  console.log('response is : \n',response)
  res.send(response)
})

app.post('/updateStatus', async (req, res) => {
  var apiParams = url.parse(req.url, true).query;
  console.log(apiParams, "q")
  let response = await updateStatus(contractsDetail.contractsDetail[apiParams.contractName], 'LOCPresentedToSeller', usersDetail[apiParams.userName],contractsDetail );
  console.log('response is : \n',response)
  res.send(response)
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
