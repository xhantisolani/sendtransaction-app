import React, { useState, useEffect } from 'react';
import {  createPublicClient, createWalletClient, custom, getContract, http } from 'viem';
import { erc20ABI, mainnet, useAccount, useEnsName } from 'wagmi';
import { wagmiAbi } from '../utils/abis/wagmiAbi';


export  function TokenBalances() {   
   //publicient
   const publicClient = createPublicClient({
    chain: mainnet,
    transport: http(),
  });
  // walletclient 
  const walletClient = createWalletClient({
    chain: mainnet,
    transport: custom(window.ethereum),
  });
    
  const { address, connector, isConnected } = useAccount()  
  const { data: ensName } = useEnsName({ address })

  // Function to fetch token balances for the user
  async function getTokenBalances() {
    // Get all of the addresses that the user has access to
    const addresses = await walletClient.requestAddresses();
    
    const userContract = getContract({
        address: address as `0x${string}`,
        abi: wagmiAbi,
        publicClient,
        walletClient
      });

    const userAddress = userContract.address;


    const args: [`0x${string}`] = [ userAddress as `0x${string}`];  
    
    // Loop through the addresses and get the token balances for each address
    const tokenBalances = [];
    for (const address of addresses) {
        // Get the contract for the token associated with the address
        const contract = getContract({
            address: address,
            abi: erc20ABI,
            publicClient,
            walletClient
          });
         
      // Get the balance of the token for the address of the user 
      let tokenBalance: BigInt | unknown;
      const balance = contract.read.balanceOf(args);
      const getSymbol = contract.read.name.toString()
      tokenBalance = balance.toString();

      // Add the address and balance to the token balances array
      tokenBalances.push({
        symbol: getSymbol,
        balance: tokenBalance as string,
      });
    }

    // Return the token balances array
    return tokenBalances;
  }



  const [tokenBalances, setTokenBalances] = useState<{ symbol: string; balance: string; }[]>([]);


  useEffect(() => {
    // Fetch the token balances when the component mounts
    async function fetchData() {
      const balances = await getTokenBalances();
      setTokenBalances(balances);
    }

    fetchData();
  }, []);


  return (
    <div>
      <h2>Token Balances</h2>
      <table>
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Balance</th>
          </tr>
        </thead>
        <tbody>
          {tokenBalances.map((balance, index) => (
            <tr key={index}>
              <td>{balance.symbol}</td>
              <td>{balance.balance}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TokenBalances;