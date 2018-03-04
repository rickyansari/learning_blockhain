const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3'); //Gives constructor function used to get web3 instance.
const provider = ganache.provider();
const web3 = new Web3(provider);
const { interface , bytecode } = require('../compile');

let accounts;
let LOC;
let buyer_bank, buyer, seller, seller_bank;

beforeEach(async ()=>{
  accounts =  await web3.eth.getAccounts();
  buyer_bank = accounts[0];
  buyer = accounts[1];
  seller = accounts[2];
  seller_bank =  accounts[3];
  LOC = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({data: bytecode, arguments:["PNB"]})
    .send({from: buyer_bank, gas:'1000000'})
})


describe('deploy contract', ()=>{
  it('fetch accounts details', ()=>{
    assert.ok(LOC.options.address);
  });

  it('initialized with default parameter', async()=>{
    let buyer_bank_address = await LOC.methods.buyer_bank().call();
    console.log(
      "buyer_bank", buyer_bank,
      "buyer", buyer,
      "seller_bank", seller_bank,
      "seller", seller
    )
    assert.equal(buyer_bank_address, accounts[0]);
  })

  it('bank name initialized', async()=>{
    let updated_status = await LOC.methods.status().call();
    assert.equal(updated_status, "PNB");
  })

})
