const express = require('express')
const app = express()
const Helper = require('./Helper');
const url = require('url');
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
let accounts;
let LOCInstance;
// key will be contract address.
var contractsDetail={};

Helper.getAccounts().then(response=>{
  accounts = response.accounts;
});

app.post('/deployContract', (req, res) => {
  Helper.deployContract(accounts[0]).then((response)=>{
    var q = url.parse(req.url, true).query;
    if(response.deployed_contract_instance.options.address){
      contractsDetail[response.deployed_contract_instance.options.address]={
        instace: response.deployed_contract_instance,
        address: response.deployed_contract_instance.options.address,
        name:'',
        buyer:{},
        seller:{},
        buyer_bank:{},
        seller_bank:{},
      }
      console.log("contractsDetail", contractsDetail);
      res.send({success: true});
    }else{
      res.send({success: false})
    }
  })
})

app.get('/user', async (req, res)=> {
  let status = await LOCInstance.methods.status().call();
  console.log("status", status);
  res.send('Got a POST request')
})


app.listen(3000, () => console.log('Express server listening on port 3000!'))
