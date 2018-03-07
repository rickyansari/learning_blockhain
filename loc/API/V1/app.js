const express = require('express');
const app = express();
const url = require('url');

const Helper = require('./Helper');
const {verifyAndGetUserDetail} = require('./controller/SingIn');
const {createContract} = require('./controller/CreateContract');
var {usersDetail} = require('./UsersDetail');

var accounts;
var contractsDetail;

Helper.getAccounts()
.then((response)=>{
  accounts = response.accounts;
  Object.keys(usersDetail).map((user, index)=>{
    usersDetail[user].address = accounts[index];
  })
});

Helper.readContractsDetailFromFile()
.then((response)=>{
  if(response.success){
    contractsDetail = response.contractsDetail;
  }
})

app.post('/singIn', async (req, res)=> {
  var params = url.parse(req.url, true).query;
  verifyAndGetUserDetail(params, );

})

app.post('/createContract', async (req, res) => {
  var q = url.parse(req.url, true).query;
  let response = await createContract(usersDetail, contractsDetail, q)
  res.send(response)
})

app.get('/user', async (req, res)=> {
  Helper.getContractInstance(contractsDetail[0].data.address).then((response)=>{
    res.send('Got a POST request')
  })
})

app.listen(3000, () => console.log('Express server listening on port 3000!'))
