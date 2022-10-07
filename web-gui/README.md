# How to run web-gui on local

## Requirements

- [nodejs](https://nodejs.org/en/)
- [ganache](https://github.com/trufflesuite/ganache) or [anvil](https://book.getfoundry.sh/reference/anvil/) for local RPC node
- [truffle](https://trufflesuite.com/docs/truffle/quickstart/) 
- [nft.storage](https://nft.storage)

## Demo
[untitled.webm](https://user-images.githubusercontent.com/62529025/194456205-0a133dd3-24c8-481a-b83e-d3d74562dc4f.webm)

## Development

First you need to make sure you have install all the package run this command in your terminal :

```bash
$ cd .. # go back to the main repo, if you already in the main repo directory go to the next step
$ yarn
$ cd web-gui
$ yarn
```

Now run this command to run local RPC node:

```bash
$ anvil
```

Open new terminal and deploy our contract by running this command:

```bash
$ truffle migrate --network development
```

Now copy paste the contract address in `ethkvstore.address.json` into `env.development` in `web-gui` folder, it will look something like this, don't forget also add your nft.storage api key:

```
REACT_APP_NFT_STORAGE_API=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
REACT_APP_CONTRACT=0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
```

Now go inside web-gui folder and run:

```
$ yarn start
```

Congrats you're now successfully running the web-gui to store key-value on ethereum blockchain

