const Claimable = artifacts.require("../contracts/Claimable.sol");

/**
 * Run tests on Claimable.sol
 */
contract("Claimable", accounts=> {
    it ("initiates contract", async => {

    });

    it ("tests only owner can change claimers", async => {

    });

    it ("tests only owner can change expiration time", async => {

    });

    it ("tests expiration time is correct after a ping", async => {

    });

    it ("tests claiming with empty claim list (public)", async => {

    });

    it ("tests only specified claimers can claim a contract with timer expired", async => {

    });

    it ("tests OwnershipChange event is triffered after a claim", async => {

    });
});