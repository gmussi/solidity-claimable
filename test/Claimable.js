const Claimable = artifacts.require("../contracts/Claimable.sol");
const utils = require("./helpers/utils");
const time = require("./helpers/time");

/**
 * Run tests on Claimable.sol
 */
contract("Claimable", (accounts) => {
    let [owner, guilherme, fernando, marcelo, matheus] = accounts;

    let claimable;

    /**
     * Since there are time-sensitive tests, the first step is to ensure
     * truffle has the correct timestamp
     */
    
    
    beforeEach(async () => {
        claimable = await Claimable.deployed();
    });

    it ("should should be same as first account", async () => {
        let _owner = await claimable.owner();
        assert.equal(owner, _owner, "owner did not match.");
    });

    context("with the conrrect owner", async () => {
        it ("should be able to change claimers", async () => {
            await claimable.setClaimers([guilherme, fernando], {from: owner});
            let _newClaimers = await claimable.getClaimers();
            assert.sameMembers(_newClaimers, [guilherme, fernando], "claimers were not the same");
        });

        it ("should be able to change expiration time", async () => {
            let nowInSeconds = Math.ceil(Date.now() / 1000 ); // need time in seconds
            let newExpiration = nowInSeconds + (60 * 60 ); // add 1 hour

            await claimable.setExpirationTime(newExpiration, {from: owner});

            assert.equal(await claimable.getExpirationTime(), newExpiration, "time did not match");
        });
    });

    context("with the wrong owner", async () => {
        it ("should not be able to change claimers", async () => {
            await utils.shouldThrow(claimable.setClaimers([guilherme, fernando], {from: guilherme}));
        });

        it ("should not be able to change expiration time", async () => {
            let nowInSeconds = Math.floor(Date.now() / 1000/*milliseconds*/ ); // need time in seconds
            let newExpiration = nowInSeconds + (60/*seconds*/ * 60/*minutes*/ ); // add 1 hour
            await utils.shouldThrow(claimable.setExpirationTime(newExpiration, {from: fernando}));
        });
    });

    it ("should be claimable only after the expiration time", async () => {
        let snapshotId = await time.getSnapshotId();
        console.log("snapshot id ", snapshotId);
        console.log("revert ", await time.revertToSnapshot(snapshotId));

        /*let truffleTime = await time.getTimestamp();
        console.log("TRUFFLE TIME", truffleTime);
        console.log("a", (await claimable.getNow()).toNumber());

        let nowInSeconds = Math.floor(Date.now() / 1000 ); // need time in seconds
        let newExpiration = nowInSeconds + (60 * 60); // add 1 hour
  
        await claimable.setExpirationTime(newExpiration, {from: owner});

        assert.isFalse(await claimable.isClaimable());

        console.log("b", (await claimable.getNow()).toNumber(), newExpiration);

        await time.increase(time.duration.hours(2));

        console.log("c", (await claimable.getNow()).toNumber(), newExpiration);

        assert.isTrue(await claimable.isClaimable());*/
    });

    // await time.increase(time.duration.days(1));

    /*it ("tests claiming with empty claim list (public)", async () => {

    });

    it ("tests only specified claimers can claim a contract with timer expired", async () => {

    });

    it ("tests OwnershipChange event is triffered after a claim", async () => {

    });*/
});