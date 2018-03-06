const express = require('express')
const app = express()
const Helper = require('./Helper');
const url = require('url');
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
let accounts;
var buyer;
var buyer_bank;
var seller_bank;
var seller;

// key will be contract address.
var contractsDetail=[];
name = 'Deal' + contractsDetail.length.string();

Helper.getAccounts().then(response=>{
  accounts = response.accounts;
  buyer_bank = accounts[0];
  buyer = accounts[1];
  seller = accounts[2];
  seller_bank = accounts[3];
});

app.post('/', jsonParser, (req, res) => {
  Helper.deployContract(buyer_bank).then((response)=>{
    var q = url.parse(req.url, true).query;
    if(response.deployed_contract_instance.options.address){
      var t ={};
      t['data']= {
        address: response.deployed_contract_instance.options.address,
        name:'',
        buyer:{},
        seller:{},
        buyer_bank:{},
        seller_bank:{},
      }
      contractsDetail[0] = t;
      contractsDetail[1] = t;

      res.send({
        success: contractsDetail
      });
    }else{
      res.send({success: fasle})
    }
  })
})

app.get('/user', async (req, res)=> {
  Helper.getContractInstance(contractsDetail[0].data.address).then((response)=>{
    console.log("response", response.instance);
    res.send('Got a POST request')
  })
})


app.listen(3000, () => console.log('Express server listening on port 3000!'))
