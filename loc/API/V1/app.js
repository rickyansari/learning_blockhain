const express = require('express')
const app = express()
const Helper = require('./Helper');
let accounts;
let LOCInstance;

Helper.getAccounts().then(response=>{
  accounts = response.accounts;
});

app.get('/', (req, res) => {
  Helper.deployContract(accounts[0]).then((response)=>{
    LOCInstance = response.deployed_contract_instance;
    res.send('Hello World!')
  })
})

app.get('/user', function (req, res) {
  res.send('Got a POST request')
})

app.listen(3000, () => console.log('Express server listening on port 3000!'))
