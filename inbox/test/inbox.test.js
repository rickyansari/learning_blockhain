const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3'); //Gives constructor function used to get web3 instance.
const web3 = new Web3(ganache.provider());


beforeEach(async ()=>{
  accounts =  await web3.eth.getAccounts();
})


describe('deploy contract', ()=>{
  it('fetch accounts details', ()=>{
    console.log("accounts\n", accounts);
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
