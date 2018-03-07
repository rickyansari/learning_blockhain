const express = require('express')
const app = express()
const Helper = require('./Helper');
const url = require('url');
var {usersDetail} = require('./UsersDetail')
var uuid = require('uuid');
const {createContract} = require('./controller/CreateContract');

let accounts;

const {verifyAndGetUserDetail} = require('./controller/SingIn');
// key will be contract address.
var contractsDetail;
// name = 'Deal' + contractsDetail.length.string();

Helper.getAccounts().then(response=>{
  accounts = response.accounts;
  Object.keys(usersDetail).map((user, index)=>{
    usersDetail[user].address = accounts[index];
  })

  // buyer_bankAddress = accounts[0];
  // buyerAddress = accounts[1];
  // sellerAddress = accounts[2];
  // seller_bankAddress = accounts[3];
});

getData= ()=>{
  Helper.readContractsDetailFromFile()
  .then((response)=>{
    if(response.success){
      console.log(response.contractsDetail)
      contractsDetail = response.contractsDetail;
    }
  })
}
getData();





getRandomKey = ()=>{
  return uuid.v1();
}
app.post('/singIn', async (req, res)=> {
  var params = url.parse(req.url, true).query;
  verifyAndGetUserDetail(params, );

})

app.post('/createContract', async (req, res) => {
  var q = url.parse(req.url, true).query;
    let response =await createContract(usersDetail, contractsDetail, q)
    console.log("response", response);
})

app.get('/user', async (req, res)=> {
  Helper.getContractInstance(contractsDetail[0].data.address).then((response)=>{
    console.log("response", response.instance);
    res.send('Got a POST request')
  })
})


app.listen(3000, () => console.log('Express server listening on port 3000!'))
