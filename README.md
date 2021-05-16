# Claimable contracts for Solidity

Claimable contracts extend the concept of Ownable contracts and allow the owner of the contract to specify one or more addresses that can claim ownership of the contract after a certain time.

The owner can keep extending ownership by periodically setting a new expiration date. Should the owner lose keys, one of the specified claimers can then claim ownership and become the new owner.

## Usage

To use this package, copy `Ownable.sol` and `Claimable.sol` into your project, and make it extend Claimable:

```Solidity
import "./Claimable.sol";
contract MyContract is Claimable {}
```

## License

This code is provided under the [MIT License](https://github.com/gmussi/solidity-claimable/blob/master/LICENSE)