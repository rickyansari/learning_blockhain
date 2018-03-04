const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3'); //Gives constructor function used to get web3 instance.
const provider = ganache.provider();
const web3 = new Web3(provider);
const { interface , bytecode } = require('../compile');

let accounts;
let LOC;

beforeEach(async ()=>{
  accounts =  await web3.eth.getAccounts();
  LOC = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({data: bytecode})
    .send({from: accounts[0], gas:'1000000'})
})


describe('deploy contract', ()=>{
  it('fetch accounts details', ()=>{
    assert.ok(LOC.options.address);
  });

  it('initialized with default parameter', async()=>{
    let buyer_bank_address = await LOC.methods.buyer_bank().call();
    assert.equal(buyer_bank_address, accounts[0]);
  })
})
