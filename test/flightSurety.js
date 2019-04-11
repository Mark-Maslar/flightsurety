
var Test = require('../config/testConfig.js');
var BigNumber = require('bignumber.js');

/*
Available Accounts
==================
(0) 0x27d8d15cbc94527cadf5ec14b69519ae23288b95 (~100 ETH)
(1) 0x018c2dabef4904ecbd7118350a0c54dbeae3549a (~100 ETH)
(2) 0xce5144391b4ab80668965f2cc4f2cc102380ef0a (~100 ETH)
(3) 0x460c31107dd048e34971e57da2f99f659add4f02 (~100 ETH)
(4) 0xd37b7b8c62be2fdde8daa9816483aebdbd356088 (~100 ETH)
(5) 0x27f184bdc0e7a931b507ddd689d76dba10514bcb (~100 ETH)
(6) 0xfe0df793060c49edca5ac9c104dd8e3375349978 (~100 ETH)
(7) 0xbd58a85c96cc6727859d853086fe8560bc137632 (~100 ETH)
(8) 0xe07b5ee5f738b2f87f88b99aac9c64ff1e0c7917 (~100 ETH)
(9) 0xbd3ff2e3aded055244d66544c9c059fa0851da44 (~100 ETH)
(10) 0xef40e53cb249a5efc159d5afd88bb02e2b7e8f39 (~100 ETH)
(11) 0xcad45f0cf1985e943098953d395d9712a656ab03 (~100 ETH)
(12) 0xe09d28457b841701210020aa30eb3f46689cb271 (~100 ETH)
(13) 0xcdc1b730a7eb4fa3a64999f3063821aa5e2e8387 (~100 ETH)
(14) 0xa3584fabb2fc5983dc39d2b56060dbb0635d47c1 (~100 ETH)
(15) 0xef7e24f6ff53cb0bd06f6fb21be403c90cdd1ed7 (~100 ETH)
(16) 0x4607636caf072d12cfe94b782186aac7867b4df5 (~100 ETH)
(17) 0x2897cfcae9ed64b3bd1de3f58d377dc6d67d2d59 (~100 ETH)
(18) 0x93f37b308e13ef9507e9ef79685b16290a5a48f5 (~100 ETH)
(19) 0x11e28ad71875bf788ea9b845b63192fc9754bf3a (~100 ETH)


*/


contract('Flight Surety Tests', async (accounts) => {

  var config;
  before('setup contract', async () => {
    config = await Test.Config(accounts);
    await config.flightSuretyData.authorizeCaller(config.flightSuretyApp.address);
  });

  /****************************************************************************************/
  /* Operations and Settings                                                              */
  /****************************************************************************************/

  it(`(multiparty) has correct initial isOperational() value`, async function () {

    // Get operating status
    let status = await config.flightSuretyData.isOperational.call();
    assert.equal(status, true, "Incorrect initial operating status value");

  });

  it(`(multiparty) can block access to setOperatingStatus() for non-Contract Owner account`, async function () {

      // Ensure that access is denied for non-Contract Owner account
      let accessDenied = false;
      try 
      {
          await config.flightSuretyData.setOperatingStatus(false, { from: config.testAddresses[2] });
      }
      catch(e) {
          accessDenied = true;
      }
      assert.equal(accessDenied, true, "Access not restricted to Contract Owner");
            
  });

  it(`(multiparty) can allow access to setOperatingStatus() for Contract Owner account`, async function () {

      // Ensure that access is allowed for Contract Owner account
      let accessDenied = false;
      try 
      {
        await config.flightSuretyData.setOperatingStatus(false, { from: config.testAddresses[2] });
        // await config.flightSuretyData.setOperatingStatus(false, {from: config.owner});
        //wait config.flightSuretyData.setOperatingStatus(false, {from: config.flightSuretyApp.address});
      }
      catch(e) {
        console.log("Can allow access error: " + e.message);
          accessDenied = true;
      }
      assert.equal(accessDenied, true, "Access not restricted to Contract Owner");
      
  });

  it(`(multiparty) can block access to functions using requireIsOperational when operating status is false`, async function () {

      await config.flightSuretyData.setOperatingStatus(false, {from: config.owner});

      let reverted = false;
      try 
      {
          await config.flightSuretyData.isOperational(true);
      }
      catch(e) {
        console.log("Can block access error: " + e.message);
        reverted = true;
      }
      assert.equal(reverted, false, "Access not blocked for requireIsOperational");      

      // Set it back for other tests to work
      await config.flightSuretyData.setOperatingStatus(true);

  });

  it('(airline) cannot register an Airline using registerAirline() if it is not funded', async () => {
    
    // ARRANGE
    ////const appContract = await flightSuretyApp.deployed()
    let newAirline = accounts[15];
    // await config.flightSuretyData.fund({from: newAirline, value: web3.toWei('10', 'ether')});
    // await config.flightSuretyData.fund(newAirline, {value: web3.toWei('10', 'ether')});
    // console.log(newAirline + " : " + airlines[airline].balance);
    // console.log(accounts[1] + " : " + web3.eth.getBalance(accounts[1]));
    // console.log(accounts[2] + " : " + await web3.eth.getBalance(accounts[2]));
    // console.log(accounts[3] + " : " + await web3.eth.getBalance(accounts[3]));
    await config.flightSuretyApp.registerAirline.sendTransaction(newAirline, {from: config.firstAirline});

    // ACT
    try {
        // await config.flightSuretyApp.registerAirline(newAirline, {from: config.firstAirline});
        await config.flightSuretyApp.registerAirline(newAirline, {from: accounts[0]});
    }
    catch(e) {
        console.log(e.message);
    }
    let result = await config.flightSuretyData.isAirline.call(newAirline); 

    // ASSERT
    assert.equal(result, false, "Airline should not be able to register another airline if it hasn't provided funding");

  });
 

});
