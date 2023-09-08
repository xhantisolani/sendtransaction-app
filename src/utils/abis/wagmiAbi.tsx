export const wagmiAbi = [   
    {
      inputs: [],
      name: 'totalSupply',
      outputs: [{ type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      name: 'Transfer',
      type: 'event',
      inputs: [
        {
          indexed: true,
          name: 'from',
          type: 'address',
        },
        { indexed: true, name: 'to', type: 'address' },
        {
          indexed: true,
          name: 'tokenId',
          type: 'uint256',
        },
      ],
    },
   
  ] as const;