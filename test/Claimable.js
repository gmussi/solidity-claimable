const Claimable = artifacts.require("../contracts/Claimable.sol");

/**
 * Run tests on Claimable.sol
 */
contract("Claimable", accounts=> {
    let [guilherme, fernando, marcelo, matheus, filipe] = accounts;
    //let claimable;
    
    /*beforeEach(async () => {
        claimable = await Claimable.deployed();
    });*/

    it ("checks owner", async () => {
        let claimable = await Claimable.deployed();
        let owner = await claimable.owner.call();
        assert.equal(guilherme, owner, "owner did not match.");
    });

    it ("tests only owner can change claimers", async () => {

    });

    it ("tests only owner can change expiration time", async () => {

    });

    it ("tests expiration time is correct after a ping", async () => {

    });

    it ("tests claiming with empty claim list (public)", async () => {

    });

    it ("tests only specified claimers can claim a contract with timer expired", async () => {

    });

    it ("tests OwnershipChange event is triffered after a claim", async () => {

    });
});