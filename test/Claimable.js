const Claimable = artifacts.require("../contracts/Claimable.sol");
const utils = require("./helpers/utils");
const time = require("./helpers/time");

/**
 * Run tests on Claimable.sol
 */
contract("Claimable", (accounts) => {
    let [owner, guilherme, fernando, marcelo, matheus] = accounts;

    let claimable;
    let snapshotId;

    /**
    * Some tests require to advance ganache in time, this requires 
    * obtaining a snapshotId and then reverting back before the test is over, 
    * otherwise ganache will continue to create blocks in "the future". 
    */    
    beforeEach(async () => {
        claimable = await Claimable.deployed();
        snapshotId = await time.getSnapshotId();
    });

    afterEach(async () => {
        await time.revertToSnapshot(snapshotId);
    });

    it ("should should be same as first account", async () => {
        let _owner = await claimable.owner();
        assert.equal(owner, _owner, "owner did not match.");
    });

    context("with the conrrect owner", async () => {
        it ("should be able to add and remove claimers", async () => {
            await claimable.addClaimer(guilherme, {from: owner});
            assert.isTrue(await claimable.isClaimer(guilherme), "claimer was not added");

            await claimable.removeClaimer(guilherme, {from: owner});
            assert.isFalse(await claimable.isClaimer(guilherme), "claimer was not removed");
        });

        it ("should be able to change expiration time", async () => {
            let nowInSeconds = Math.ceil(Date.now() / 1000 ); // need time in seconds
            let newExpiration = nowInSeconds + (60 * 60 ); // add 1 hour

            await claimable.setExpirationTime(newExpiration, {from: owner});

            assert.equal(await claimable.getExpirationTime(), newExpiration, "time did not match");
        });
    });

    context("with the wrong owner", async () => {
        it ("should not be able to add or remove claimers", async () => {
            await utils.shouldThrow(claimable.addClaimer(guilherme, {from: guilherme}));
            await utils.shouldThrow(claimable.removeClaimer(guilherme, {from: fernando}));
        });

        it ("should not be able to change expiration time", async () => {
            let nowInSeconds = Math.floor(Date.now() / 1000/*milliseconds*/ ); // need time in seconds
            let newExpiration = nowInSeconds + (60/*seconds*/ * 60/*minutes*/ ); // add 1 hour
            await utils.shouldThrow(claimable.setExpirationTime(newExpiration, {from: fernando}));
        });
    });

    it ("should be claimable only after the expiration time", async () => {
        let nowInSeconds = Math.floor(Date.now() / 1000 ); // need time in seconds
        let newExpiration = nowInSeconds + (60 * 60); // add 1 hour
  
        await claimable.setExpirationTime(newExpiration, {from: owner});

        assert.isFalse((await claimable.isClaimable())[1]); // not claimable yet as 1 hour has not yet passed

        await time.increase(time.duration.hours(2)); // advance ganache 2 hours in time

        assert.isTrue((await claimable.isClaimable())[1]); // should be claimable now
    });

    it ("should be claimable only by specified addresses", async () => {
        let nowInSeconds = Math.floor(Date.now() / 1000 ); // need time in seconds
        let newExpiration = nowInSeconds + (60 * 60); // add 1 hour
  
        await claimable.setExpirationTime(newExpiration, {from: owner});
        await claimable.addClaimer(guilherme, {from: owner}); // set claimers

        await time.increase(time.duration.hours(2)); // advance time to make it claimable

        await claimable.claim({from: guilherme});

        let _owner = await claimable.owner();
        assert.equal(_owner, guilherme, "owner was different");

        await time.revertToSnapshot(snapshotId);
    });

    context("with events in mind", async () => {
        it ("should emit event when expiration changes", async () => {
            // assert.equal(response.logs[index].event, eventName, eventName + ' event should fire.');
            let nowInSeconds = Math.floor(Date.now() / 1000/*milliseconds*/ ); // need time in seconds
            let newExpiration = nowInSeconds + (60/*seconds*/ * 60/*minutes*/ ); // add 1 hour
            let response = await claimable.setExpirationTime(newExpiration, {from: owner});

            assert.equal(response.logs[0].event, "ExpirationUpdated", "event not fired");
        });

        it ("should emit event when claimer is added", async () => {
            let response = await claimable.addClaimer(guilherme, {from: owner});
            assert.equal(response.logs[0].event, "ClaimerAdded", "event not fired");
        });

        it ("should emit event when claimer is removed", async () => {
            await claimable.addClaimer(guilherme, {from: owner});
            let response = await claimable.removeClaimer(guilherme, {from: owner});
            assert.equal(response.logs[0].event, "ClaimerRemoved", "event not fired");
        });

        it ("should emit event when owner changes", async () => {
            let nowInSeconds = Math.floor(Date.now() / 1000 ); // need time in seconds
            let newExpiration = nowInSeconds + (60 * 60); // add 1 hour
    
            await claimable.setExpirationTime(newExpiration, {from: owner});
            await claimable.addClaimer(guilherme, {from: owner}); // set claimers

            await time.increase(time.duration.hours(2)); // advance time to make it claimable

            let response = await claimable.claim({from: guilherme});

            assert.equal(response.logs[0].event, "OwnershipTransferred", "event not fired");

            await time.revertToSnapshot(snapshotId);
        });
    });

    it ("reading info from contract should work", async () => {
        await claimable.read();
    });
});