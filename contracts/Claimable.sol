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
     * @dev Adds a new claimer to the contract
     * @param _claimer address of the claimer to be added
     */
    function addClaimer(address _claimer) public onlyOwner {
        claimers[_claimer] = true;
    }

    /**
     * @dev Removes a claimer from the contract
     * @param _claimer address of the claimer to be removed
     */
    function removeClaimer(address _claimer) public onlyOwner {
        claimers[_claimer] = false;
    }

    /**
     * @dev returns true if the specified address can claim this contract once the timer is expired
     * @param _claimer address to verify
     */
    function isClaimer(address _claimer) public view returns (bool) {
        return claimers[_claimer];
    }

    /**
    * @dev allows the owner to set a new expiration time to extend the ownership of this contract
    * @param _expirationTime the new expiration time for this contract
    */
    function setExpirationTime(uint _expirationTime) public onlyOwner {
        require(_expirationTime > now);
        expirationTime = _expirationTime;
    }

    /**
     * @dev Gets the current expiration time set in this contract
     */
    function getExpirationTime() public view returns (uint) {
        return expirationTime;
    }

    /**
     * @dev Claim ownership of the contract, once the max inactive time is reached. 
     * Only addresses in claimers can claim, unless the array is empty.
     */
    function claim() public {
        require(claimers[msg.sender]);
        require(this.isClaimable());

        _transferOwnership(msg.sender);      
    }
    
    /**
     * @dev tests if the contract can be claimed
     */
    function isClaimable() public view returns (bool) {
        return now > expirationTime;
    }

    function getNow() public view returns (uint) {
        return uint(now);
    }
}