# Modular Mobile application

### This document is intended to provide a high-level overview on the application architecture, third-party service usage and conventions established across the codebase.

### It's important to highlight that the application is actively being developed therefore some functionality might not work as expected and there could be some inconsistencies in naming conventions or object properties.

## About the app

**Modular** is a mobile self-custodial wallet currently only integrated to the Arbitrum One blockchain. Most parts of the application are highly inspired by others self-custodial mobile wallets just as [Metamask Mobile](https://github.com/MetaMask/metamask-mobile) and [Rainbow](https://github.com/rainbow-me/rainbow), trying wherever possible to use the same libraries and patterns and leveraging as much as we can on the open source tech already built.

In the long term, **Modular** intention is to feature a plugin-based system, keeping the core of the application as simpler as possible and letting the user install and customize the modules they want provided by other developers in the app marketplace.

## Tech Stack

The entire application is built on top of React Native framework using Typescript.
**There aren't any units nor integration tests developed yet.**

[NativeWind](https://www.nativewind.dev/) and inline styles are used to style the components.

**There aren't any WebViews running in the application**. All components and screens are React Native ones.

## Third-services

[Covalent](https://www.covalenthq.com/): used to fetch real-time user balances through [balances endpoint](https://www.covalenthq.com/docs/api/balances/get-token-balances-for-address/)
[1inch API](https://docs.1inch.io/docs/aggregation-protocol/api/swagger): used to fetch the path for performing swaps in the application.
[GMX.io API](https://gmxio.gitbook.io/gmx/api): used to fetch prices and tokens in the Margin Trading module.
[Arbitrum Public Node](https://arb1.arbitrum.io/rpc): used to perform requests to the Arbitrum One blockchain.
[Chainstack](https://chainstack.com/): used to create a custom node in Arbitrum One **(not yet in production at the time of writing)**

## Application overview

### Onboarding

Whenever a new user enters the application, we provide two buttons to **create** or **import** a new seed-phrase. The user then is prompted with a pin-creation screen that will be used to **encrypt** and **decrypt** the seed-phrase whenever needed. **It's important to highlight that the wallet does not support multiple seed-phrases yet**, but the user can derivate a new address and private key using an incremental derivation path.

The seed-phrase is saved encrypted by the user pin using [react-native-keychain](https://www.npmjs.com/package/react-native-keychain) version 8.0.0 requiring `USER_PRESENCE`to access it afterwards.

### Existing user

After the user has already created or imported a wallet, they can access the home screen where they can:

1. `RECEIVE:` see public address and QR code
2. `SWAP:` swap tokens through [Modular Router contract](https://arbiscan.io/address/0xb1c1d392e36ed339d1cc67f9fefb390098b08e72) passing the calldata fetched in real-time to [1inch API](https://docs.1inch.io/docs/aggregation-protocol/api/swagger). **PIN is required to perform the action.**
3. `SEND:` perform and ERC20 or native token transfer. **PIN is required to perform the action.**
4. `CHANGE ACTIVE WALLET OR CREATE A NEW ONE:` by clicking on the user address on the top-left. If the user wants to create a new address / private key, the user **will be prompted with the PIN screen** in order to decrypt the seed-phrase and perform a new derivation, saving the whole data again encrypted by the same pin.
5. `RECOVER SEED-PHRASE:` by clicking on the gear on the top-right of the screen. **PIN is required to perform the action.**
6. Move to `MODULES` and use `GMX Margin Trading module` where user can create or close a position. **PIN is required to perform the action**.

## Global storage

The application uses ["zustand": "^4.1.4"](https://www.npmjs.com/package/zustand) to handle global state variables. There is not sensitive data stored in the global state, apart from the user balances which **can be accessed without providing the pin.** Public addresses are saved in the global store as well, and the indexes of the array are used to point to the right private key once the seed-phrase is decrypted.

## Sensitive data handling

There are two main sensitive data pieces handled by the application:

1. `USER PIN`. The application does not store the user pin. We ask for it every time a user wants to perform a sensitive action and we keep it only in memory until the private key is successfully encrypted or decrypted. Whenever the user needs to sign a transaction, an [ethers.js Wallet](https://docs.ethers.org/v5/api/signer/#Wallet) is populated and passed down to the component responsible of building and signing the transaction.
2. `SEED-PHRASE CREATION`. The creation of the seed-phrase is performed in the file `src/controller/keyring.ts` file using [bip39](https://www.npmjs.com/package/bip39) version 3.0.2 `generateMnemonic` method. The derivation of the seed-phrase into the private key is performed by ["ethereumjs-wallet": "1.0.1"](https://www.npmjs.com/package/ethereumjs-wallet) `hdkey` object.
3. `SEED-PHRASE ENCRYPTION AND DECRYPTION`. The encryption and decryption architecture is forked from [Metamask Mobile Encryptor file](https://github.com/MetaMask/metamask-mobile/blob/main/app/core/Encryptor.js). It's important to highlight that **Metamask** uses a forked version of `react-native-aes-crypto`.
