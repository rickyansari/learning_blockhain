const express = require('express')
const app = express()
const ganache = require('ganache-cli');
const Web3 = require('web3'); //Gives constructor function used to get web3 instance.
const provider = ganache.provider();
const web3 = new Web3(provider);
const { interface , bytecode } = require('../../compile');

let accounts;
let inbox;

deployContract =  async ()=>{
  accounts =  await web3.eth.getAccounts();
  inbox = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({data: bytecode})
    .send({from: accounts[0], gas:'1000000'})
}

deployContract();

app.get('/', (req, res) => {
  console.log("First Account  Address", accounts[0]);
  console.log("deployed contract");
  res.send('Hello World!')
})

app.listen(3000, () => console.log('Express server listening on port 3000!'))
