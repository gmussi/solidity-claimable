pragma solidity >=0.5.16;

import "./Ownable.sol";

/**
* @title Claimable
* @dev The claimable contract allows the owner to specify addresses who can claim the ownership of this contract,  
* after a specified time.
* This is a safe-guard should the owner ever lose access to their keys. 
*
* A claimable contract with an expiration date defined, but no claimers specified, can be claimed by anyone once the time is expired.
* The owner can change this time periodically, to ensure ownership of the contract while the key is safe.
*/
contract Claimable is Ownable {

    mapping (address => bool) private claimers; // addresses who are allowed to claim this contract
    uint private expirationTime; // stores time of last owner action + maxInactiveTime

    /**
     * Throw event to inform listeners of what is happening
     */
    event ClaimerAdded ( address indexed claimer );
    event ClaimerRemoved ( address indexed claimer );
    event ExpirationUpdated ( uint oldExpiration, uint newExpiration );

    /**
     * @notice Adds a new claimer to the contract
     * @param _claimer address of the claimer to be added
     */
    function addClaimer(address _claimer) public onlyOwner {
        require(! claimers[_claimer] ); // ensure claimer has not been added already 

        claimers[_claimer] = true;
        emit ClaimerAdded (_claimer);
    }

    /**
     * @notice Removes a claimer from the contract
     * @param _claimer address of the claimer to be removed
     */
    function removeClaimer(address _claimer) public onlyOwner {
        require(claimers[_claimer] ); // ensure address is claimer

        claimers[_claimer] = false;
        emit ClaimerRemoved(_claimer);
    }

    /**
     * @notice returns true if the caller has been added as claimer on this contract
     * @param _claimer address to verify
     * @return true if the caller has been added as claimer, false, otherwise
     */
    function isClaimer(address _claimer) public view returns (bool) {
        return claimers[_claimer];
    }

    /**
    * @notice allows the owner to set a new expiration time to extend the ownership of this contract
    * @param _expirationTime the new expiration time for this contract
    */
    function setExpirationTime(uint _expirationTime) public onlyOwner {
        uint oldExpiration = expirationTime;

        expirationTime = _expirationTime;

        emit ExpirationUpdated(oldExpiration, _expirationTime);
    }

    /**
     * @notice Gets the current expiration time set in this contract
     * @return uint with the expiration time
     */
    function getExpirationTime() public view returns (uint) {
        return expirationTime;
    }

    /**
     * @notice Claim ownership of the contract, once the max inactive time is reached. 
     * Only addresses in claimers can claim, unless the array is empty.
     */
    function claim() public {
        require(isClaimer(msg.sender));
        require(now > expirationTime);
        require(!isOwner());

        _transferOwnership(msg.sender);      
    }
    
    /**
     * @notice Checks if the expiration date is passed and contract can be claimed.
     * @dev The contract is claimable when the 3 results are true.
     * @return bool: is a claimer, bool: is expired, bool: is not owner
     */
    function isClaimable() public view returns (bool, bool, bool) {
        return (isClaimer(msg.sender), now > expirationTime, !isOwner());
    }

    /**
    * @notice returns the owner of this contract, the expiration date and if the caller is one of the claimers
    * @return (address: owner of this contract, uint: the expiration date, bool: is caller a claimers?)
    */
    function read() public view returns (address, uint, bool) {
        return (owner(), expirationTime, isClaimer(msg.sender));
    }

    function debugnow() public view returns (uint) {
        return now;
    }
}