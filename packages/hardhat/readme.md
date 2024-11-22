# Hardhat

## Compiling Contracts

`npx hardhat compile`

## Testing Contracts

`npx hardhat test`

## Deploy PinSave Contracts

```bash
npx hardhat run scripts/deployPinSave.js --network metis
```

## Verifying

`npx hardhat verify --network ... "0x6F67850013b5775E36E35071a5CdD16ea43e1061" "PinSave" "PIN" "0x6F67850013b5775E36E35071a5CdD16ea43e1061"`
