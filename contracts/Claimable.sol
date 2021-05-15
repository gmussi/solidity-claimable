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

    address[] private claimers; // addresses who are allowed to claim this contract
    uint private expirationTime; // stores time of last owner action + maxInactiveTime

    /**
     * @dev Sets who can claim this contract
     * @param _claimers an array with the addresses of the claimers who can claim this contract
     */
    function setClaimers(address[] memory _claimers) public onlyOwner {
        claimers = _claimers;
    }

    /**
     * @return the addresses who can claim this contract once the expiration time is reached
     */
    function getClaimers() public view returns (address[] memory) {
        return claimers;
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
     * @return the current expiration time
     */
    function getExpirationTime() public view returns (uint) {
        return expirationTime;
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
     * @dev tests if the contract can be claimed
     */
    function isClaimable() public view returns (bool) {
        return now > expirationTime;
    }

    function getNow() public view returns (uint) {
        return uint(now);
    }
}