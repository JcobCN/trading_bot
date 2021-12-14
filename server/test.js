const ethers = require("ethers");

const ERC20_ABI = [
    {
      constant: false,
      inputs: [
        { name: '_spender', type: 'address' },
        { name: '_value', type: 'uint256' },
      ],
      name: 'approve',
      outputs: [{ name: 'success', type: 'bool' }],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'totalSupply',
      outputs: [{ name: 'supply', type: 'uint256' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        { name: '_from', type: 'address' },
        { name: '_to', type: 'address' },
        { name: '_value', type: 'uint256' },
      ],
      name: 'transferFrom',
      outputs: [{ name: 'success', type: 'bool' }],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'decimals',
      outputs: [{ name: 'digits', type: 'uint256' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [{ name: '_owner', type: 'address' }],
      name: 'balanceOf',
      outputs: [{ name: 'balance', type: 'uint256' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        { name: '_to', type: 'address' },
        { name: '_value', type: 'uint256' },
      ],
      name: 'transfer',
      outputs: [{ name: 'success', type: 'bool' }],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: true,
      inputs: [
        { name: '_owner', type: 'address' },
        { name: '_spender', type: 'address' },
      ],
      name: 'allowance',
      outputs: [{ name: 'remaining', type: 'uint256' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      anonymous: false,
      inputs: [
        { indexed: true, name: '_owner', type: 'address' },
        { indexed: true, name: '_spender', type: 'address' },
        { indexed: false, name: '_value', type: 'uint256' },
      ],
      name: 'Approval',
      type: 'event',
    },
  ];
const node1 = "wss://speedy-nodes-nyc.moralis.io/db438a88c8bfbef7505bae0b/eth/ropsten/ws";
const key1 = "ede9418bb4a7bfbfe4ccf1404673e345db9a05fcd9ea151fa2c661cd499c0c87";
const tokenAddress1 = "0x110a13FC3efE6A245B50102D2d79B3E76125Ae83";
const safeWallet1 = "0x5Ba73512651aBCD37ae219A23c33d39A43a291dF";

async function safeWalletTransfer (node, key, tokenAddress, safeWallet) {
    console.log('-----------start safeWalletTransfer');
    var customWsProvider = new ethers.providers.WebSocketProvider(node);
    var ethWallet = new ethers.Wallet(key);
    const account = ethWallet.connect(customWsProvider);

    console.log(account.address);
  
    // Gas Price : 10,000,000,000 (0x2540BE400)
    customWsProvider.getGasPrice().then(async (currentGasPrice) => {

      console.log("gasPrice: ", currentGasPrice);

      let gasPrice = ethers.utils.hexlify(parseInt(currentGasPrice));
  
      let contract = new ethers.Contract(
        tokenAddress,
        ERC20_ABI,
        account
      );
  
      // How many tokens?
      let balance = await contract.balanceOf(account.address);
      balance = balance.toString();
      console.log(`balance: ${balance}`);
      balance = '2632835';
  
    //   Send tokens
      contract.transfer(safeWallet, balance).then((transferResult) => {
        console.dir(transferResult);
        console.log('----------- Finished');
      })
    })
  }

safeWalletTransfer(node1, key1, tokenAddress1, safeWallet1).then();

