const express = require('express')
const app = express()
const Helper = require('./Helper');
const url = require('url');
let accounts;
var buyer;
var buyer_bank;
var seller_bank;
var seller;
const {verifyAndGetUserDetail} = require('./controller/SingIn');
// key will be contract address.
var contractsDetail=[{ashfaq:"SDSDSD"}];
// name = 'Deal' + contractsDetail.length.string();

Helper.getAccounts().then(response=>{
  accounts = response.accounts;
  buyer_bank = accounts[0];
  buyer = accounts[1];
  seller = accounts[2];
  seller_bank = accounts[3];
});

getData= ()=>{
  Helper.readContractsDetailFromFile()
  .then((response)=>{
    console.log("after reading data", response);
  })
}

writeData= ()=>{
  // console.log("before writing", contractsDetail);
  Helper.writeContractsDetailToFile(contractsDetail)
  .then((response)=>{
    console.log("response", response);
  })
}

app.post('/singIn', async (req, res)=> {
  var params = url.parse(req.url, true).query;
  verifyAndGetUserDetail(params, );

})

app.post('/createContract',(req, res) => {
  Helper.deployContract(buyer_bank).then((response)=>{
    var q = url.parse(req.url, true).query;
    if(response.deployed_contract_instance.options.address){
      let name = 'Contract ' + contractsDetail.length.string();
      let contract_detail ={};
      contract_detail[contract_name]= {
        address: response.deployed_contract_instance.options.address,
        name: name,
        buyer:{},
        seller:{},
        buyer_bank:{},
        seller_bank:{},
      }
      contractsDetail.push(contract_detail);
      res.send({
        success: true
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
