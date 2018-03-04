const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3'); //Gives constructor function used to get web3 instance.



const web3 = new Web3(ganache.provider());
const { interface , bytecode } = require('../compile');

let accounts;
let inbox;

beforeEach(async ()=>{
  accounts =  await web3.eth.getAccounts();
  inbox = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({data: bytecode, arguments:["hi there"]})
    .send({from: accounts[0], gas:'1000000'})
})


describe('deploy contract', ()=>{
  it('fetch accounts details', ()=>{
    assert.ok(inbox.options.address);
  });

  it('initialize with proper value', async ()=>{
    inbox.op
  })

})

// class Car {
//   drive() {
//     return 'vroom';
//   }
//
//   park() {
//     return 'stopped';
//   }
// }
// var car;
//
// beforeEach(()=>{
//   car = new Car();
// })
//
// describe('Car', ()=>{
//   it('can park', ()=> {
//     // car = new Car();
//     assert.equal(car.park(), 'stopped');
//   })
//
//   it('driving skills',()=>{
//     assert.equal(car.drive(), 'vroom');
//   })
// })
