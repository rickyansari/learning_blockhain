const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3'); //Gives constructor function used to get web3 instance.
const web3 = new Web3(ganache.provider());

class Car {
  drive() {
    return 'vroom';
  }

  park() {
    return 'stopped';
  }
}
var car;

beforeEach(()=>{
  car = new Car();
})

describe('Car', ()=>{
  it('can park', ()=> {
    // car = new Car();
    assert.equal(car.park(), 'stopped');
  })

  it('driving skills',()=>{
    assert.equal(car.drive(), 'vroom');
  })
})
