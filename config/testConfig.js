
var FlightSuretyApp = artifacts.require("FlightSuretyApp");
var FlightSuretyData = artifacts.require("FlightSuretyData");
var BigNumber = require('bignumber.js');

var Config = async function(accounts) {
    
    // These test addresses are useful when you need to add
    // multiple users in test scripts

    let testAddresses = [
        "0x27d8d15cbc94527cadf5ec14b69519ae23288b95",
        "0x018c2dabef4904ecbd7118350a0c54dbeae3549a",
        "0xce5144391b4ab80668965f2cc4f2cc102380ef0a",
        "0x460c31107dd048e34971e57da2f99f659add4f02",
        "0xd37b7b8c62be2fdde8daa9816483aebdbd356088",
        "0x27f184bdc0e7a931b507ddd689d76dba10514bcb",
        "0xfe0df793060c49edca5ac9c104dd8e3375349978",
        "0xbd58a85c96cc6727859d853086fe8560bc137632",
        "0xe07b5ee5f738b2f87f88b99aac9c64ff1e0c7917",
        "0xbd3ff2e3aded055244d66544c9c059fa0851da44",
        "0xef40e53cb249a5efc159d5afd88bb02e2b7e8f39",
        "0xcad45f0cf1985e943098953d395d9712a656ab03",
        "0xe09d28457b841701210020aa30eb3f46689cb271",
        "0xcdc1b730a7eb4fa3a64999f3063821aa5e2e8387",
        "0xa3584fabb2fc5983dc39d2b56060dbb0635d47c1",
        "0xef7e24f6ff53cb0bd06f6fb21be403c90cdd1ed7",
        "0x4607636caf072d12cfe94b782186aac7867b4df5",
        "0x2897cfcae9ed64b3bd1de3f58d377dc6d67d2d59",
        "0x93f37b308e13ef9507e9ef79685b16290a5a48f5",
        "0x11e28ad71875bf788ea9b845b63192fc9754bf3a"
    ];

    let flightSuretyData = await FlightSuretyData.new();
    let flightSuretyApp = await FlightSuretyApp.new(flightSuretyData.address);
    console.log('flightSuretyData: ' + flightSuretyData.address)
    console.log('flightSuretyApp: ' + flightSuretyApp.address)

    let owner = accounts[0];
    // let owner = flightSuretyApp.address;
    let firstAirline = accounts[1];
    
    return {
        owner: owner,
        firstAirline: firstAirline,
        weiMultiple: (new BigNumber(10)).pow(18),
        testAddresses: testAddresses,
        flightSuretyData: flightSuretyData,
        flightSuretyApp: flightSuretyApp
    }
}

module.exports = {
    Config: Config
};