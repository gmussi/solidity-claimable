async function increase(duration) {
    return new Promise((resolve, reject) => {
        web3.currentProvider.send({
            jsonrpc: '2.0',
            method: 'evm_increaseTime',
            params: [duration], // duration in seconds to increase
            id: new Date().getTime()
        }, (e) => {
            if (e) {
                reject(e);
            } else {
                web3.currentProvider.send({
                    jsonrpc: '2.0',
                    method: 'evm_mine',
                    params: [], 
                    id: new Date().getTime()
                }, (err, out) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(out);
                    }
                });
          }
        });
    });
}

async function getSnapshotId() {
    return new Promise((resolve, reject) => {
        web3.currentProvider.send({
            jsonrpc: "2.0", 
            method: "evm_snapshot"
        }, (err, out) => {
            if (err) {
                reject(err);
            } else {
                resolve(out.result);
            }
        });
    });
}

async function revertToSnapshot(snapshotId) {
    return new Promise((resolve, reject) => {
        web3.currentProvider.send({
            jsonrpc: "2.0", 
            method: "evm_revert", 
            params: [snapshotId]
        }, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

async function getTimestamp() {
    return (await web3.eth.getBlock("latest")).timestamp;
}

const duration = {

    seconds: function (val) {
        return val;
    },
    minutes: function (val) {
        return val * this.seconds(60);
    },
    hours: function (val) {
        return val * this.minutes(60);
    },
    days: function (val) {
        return val * this.hours(24);
    },
}

module.exports = {
    increase,
    duration,
    getTimestamp,
    getSnapshotId,
    revertToSnapshot
};
