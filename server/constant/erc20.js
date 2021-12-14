module.exports = {
    ERC20_ABI : [
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
      ],
     
    SWAP_HANDLER : {
      // For Uniswap
      UNISWAP_V2 : {
        name : "wETH",
        router : '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
        wNativeToken: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        buyMethod:     [ 
          "0x7ff36ab5",     //swapExactETHForTokens
          "0xb6f9de95",     //swapExactETHForTokensSupportingFeeOnTransferTokens
          "0xfb3bdb41"      //swapETHForExactTokens
        ], 
      },
      // For Pancakeswap
      PANCAKESWAP_V2 : {
        name : "wBNB",
        router : '0x10ED43C718714eb63d5aA57B78B54704E256024E',
        wNativeToken: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
        buyMethod:     [ 
          "0x7ff36ab5",     //swapExactETHForTokens
          "0xb6f9de95",     //swapExactETHForTokensSupportingFeeOnTransferTokens
          "0xfb3bdb41"      //swapETHForExactTokens
        ],         
      },
    },

    // Max big Integer 2^256 - 1;
    MAX_BIGINT : 115792089237316195423570985008687907853269984665640564039457584007913129639935
    // 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
};

