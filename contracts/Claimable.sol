pragma solidity >=0.5.16;

import "./Ownable.sol";

/**
* @title Claimable
* @dev The claimable contract allows the owner to specify addresses who can claim the ownership of this contract,  
* in case the owner does not perform any actons on this contract after a defined amount of time.
* This is a safe-guard should the owner ever lose access to their keys. 
*
* A claimable contract with an expiration date defined, but no claimers specified, can be claimed by anyone once the time is expired.
*
* Example: If then owner spends more than 90 days without touching this contracts, person A can claim ownership
*/
contract Claimable is Ownable {

    address[] private _claimers; // addresses who are allowed to claim this contract
    uint private _maxInactiveTime; // how long must the owner be inactive before the contract can be claimed
    uint32 private _expirationTime; // stores time of last owner action + maxInactiveTime

    /**
     * @return the addresses who can claim this contract once the expiration time is reached
     */
    function claimers() public view returns (address[] memory) {
        return _claimers;
    }

    /**
     * @return the current expiration time
     */
    function expirationTime() public view returns (uint32) {
        return _expirationTime;
    }

    /**
     * @dev Sets the max inactive time before the contract expires. Only the owner can perform this action.
     */
    function setMaxInactiveTime(uint maxInactiveTime) public onlyOwner {
        // TODO: new time must be valid. Above 0. Different than current time.
        // TODO: set the new timer
        // TODO: reset expiration time
    }

    /**
     * @dev Ping method for owner to reset expiration time
     */
    function ping() public onlyOwner {
        // TODO: reset expiration time
    }

    /**
     * @dev Claim ownership of the contract, once the max inactive time is reached. 
     * Only addresses in claimers can claim, unless the array is empty.
     */
    function claim() public {
        // TODO: require address to be in claimers OR claimers be empty
        // TODO: require that expiration time is in the past
        // TODO: update ownership       
    }

    /**
     * @dev Sets who can claim this contract
     */
    function setClaimers() public onlyOwner {
        // TODO: update claimers array
    }

    /**
    * @dev Resets the inactive timer. Only owner can do this
     */
    function resetTimer() internal onlyOwner {
        // TODO: reset timer
    }
}