pragma solidity ^0.4.25;

import "../node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol";

contract FlightSuretyData {
    using SafeMath for uint256;

    /********************************************************************************************/
    /*                                       DATA VARIABLES                                     */
    /********************************************************************************************/

    address private contractOwner;                                      // Account used to deploy contract
    bool private operational = true;                                    // Blocks all state changes throughout the contract if false
    
    struct Airline {  
        address airlineWalletAddress;
        uint256 balance;
        bool isAllowedToVote; // Airline may not vote until it has funded 10 Ether. 
    }    
    mapping(address => Airline) private airlines;
    address[] private registeredAirlines; // Makes it easier to obtain airline count

    /********************************************************************************************/
    /*                                       EVENT DEFINITIONS                                  */
    /********************************************************************************************/

    event ContractOwner(address contractOwner);

    // Event fired when an airline is registered
    // Other airlines watch this and validate the airline
    event AirlineRegistered(address airlineWalletAddress, bool isAllowedToVote);


    /**
    * @dev Constructor
    *      The deploying account becomes contractOwner
    */
    constructor
                                (
                                ) 
                                public
    {
        contractOwner = msg.sender;
        emit ContractOwner(contractOwner);
    }

    /********************************************************************************************/
    /*                                       FUNCTION MODIFIERS                                 */
    /********************************************************************************************/

    // Modifiers help avoid duplication of code. They are typically used to validate something
    // before a function is allowed to be executed.

    /**
    * @dev Modifier that requires the "operational" boolean variable to be "true"
    *      This is used on all state changing functions to pause the contract in 
    *      the event there is an issue that needs to be fixed
    */
    modifier requireIsOperational() 
    {
        require(operational, "Contract is currently not operational");
        _;  // All modifiers require an "_" which indicates where the function body will be added
    }

    /**
    * @dev Modifier that requires the "ContractOwner" account to be the function caller
    */
    modifier requireContractOwner()
    {
        require(msg.sender == contractOwner, "Caller is not contract owner");
        _;
    }

    /**
    * @dev Modifier that requires the Airline to be registered
    */    
    modifier requireAirlineIsRegistered(bool desiredState)
    {
        if(desiredState == true){
            require(airlines[msg.sender].airlineWalletAddress != address(0), "Airline is not registered"); 
        }
        else
        {
            require(airlines[msg.sender].airlineWalletAddress == address(0), "Airline is already registered");
        }
        _;
    }

    /**
    * @dev Only existing airline may register a new airline until there are at least four airlines registered.
    */    

    modifier requireAirlineIsFunded()
    {
        require(airlines[msg.sender].balance >= 10, "Airline is not sufficiently funded."); 
        _;
    }

    /**
    * @dev Only existing airline may register a new airline until there are at least four airlines registered.
    */    

    modifier requireFirstFourRestriction()
    {
        if(registeredAirlines.length < 4)
        {
            require(airlines[msg.sender].airlineWalletAddress != contractOwner, "Currently, only registered airlines can register another airline."); 
        }
        _;
    }

    /********************************************************************************************/
    /*                                       UTILITY FUNCTIONS                                  */
    /********************************************************************************************/
    /**
    * @dev Is the addressed mapped to an airline?
    *
    */   
   
    function authorizeCaller(address _callerAddress) 
                            public 
                            returns(bool)

    {
        contractOwner = _callerAddress;
        emit ContractOwner(contractOwner);
        return true;
    }

    /**
    * @dev Is the addressed mapped to an airline?
    *
    */      
    function isAirline(address someAddress) 
                            public 
                            view 
                            returns(bool) 
    {
        return (airlines[someAddress].airlineWalletAddress != address(0));
    }


    /**
    * @dev Get operating status of contract
    *
    * @return A bool that is the current operating status
    */      
    function isOperational() 
                            public 
                            view 
                            returns(bool) 
    {
        return operational;
    }


    /**
    * @dev Sets contract operations on/off
    *
    * When operational mode is disabled, all write transactions except for this one will fail
    */    
    function setOperatingStatus
                            (
                                bool mode
                            ) 
                            external
                            requireAirlineIsRegistered(true)
    {
        operational = mode;
    }

    /********************************************************************************************/
    /*                                     SMART CONTRACT FUNCTIONS                             */
    /********************************************************************************************/

   /**
    * @dev Add an airline to the registration queue
    *      Can only be called from FlightSuretyApp contract.
    *      Only existing airline may register a new airline until there are at least four airlines registered.
    *
    */   
    function registerAirline
                            (address newAirlineWalletAddress
                            //address originSender
                            )
                            external

                            requireIsOperational()
                            requireAirlineIsRegistered(false) //Ensure that the airline isn't already registered
                            ////requireAirlineIsFunded()
                            requireFirstFourRestriction()
                            
                            returns(bool success)
    {
                            airlines[newAirlineWalletAddress] = Airline(newAirlineWalletAddress, 0, false); // add new airline to mapping
                            registeredAirlines.push(newAirlineWalletAddress);               // add to array
                            emit AirlineRegistered(newAirlineWalletAddress, false);
    }


   /**
    * @dev Buy insurance for a flight
    *
    */   
    function buy
                            (                             
                            )
                            external
                            payable
    {

    }

    /**
     *  @dev Credits payouts to insurees
    */
    function creditInsurees
                                (
                                )
                                external
                                pure
    {
    }
    

    /**
     *  @dev Transfers eligible payout funds to insuree
     *
    */
    function pay
                            (
                            )
                            external
                            pure
    {
    }

   /**
    * @dev Initial funding for the insurance. Unless there are too many delayed flights
    *      resulting in insurance payouts, the contract should be self-sustaining
    *
    */   
    function fund
                            (   
                                //address airline
                            )
                            public
                            payable

                            requireAirlineIsRegistered(true)
    {
        address airline = msg.sender;
        // Add msg.value to balance
        airlines[airline].balance.add(msg.value); //SafeMath add
        
        
        //Check balance. If > 10E: set isAllowedToVote to true & emit notice. Otherwise, no notice & set to false.
        if (airlines[airline].balance > 10) {
             airlines[airline].isAllowedToVote = true;
             emit AirlineRegistered(airline, airlines[airline].isAllowedToVote);
        }
        else {
            airlines[airline].isAllowedToVote = false;
        }
    }

    function getFlightKey
                        (
                            address airline,
                            string memory flight,
                            //string flight,
                            uint256 timestamp
                        )
                        pure
                        internal
                        returns(bytes32) 
    {
        return keccak256(abi.encodePacked(airline, flight, timestamp));
    }

    /**
    * @dev Fallback function for funding smart contract.
    *      "Fallback functions are also executed whenever a contract would receive plain Ether, without any data."
    *
    */
    function() 
                            external 
                            payable 
    {
        fund();
    }


}
