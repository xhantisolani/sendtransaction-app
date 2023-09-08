import styles from './sendTransaction.module.css';
import React from 'react';
import {
  custom,
  createWalletClient,
  createPublicClient,
  http,
  getContract,
  parseEther,
} from 'viem';
import Profile from './Profile';
import SelectToken from '../modal/SelectToken'; // Import the SelectToken component
import { erc20ABI, useAccount, usePrepareSendTransaction, useSendTransaction, useWaitForTransaction } from 'wagmi';
import { goerli } from 'viem/chains'
import { useState } from 'react';

export function SendTransaction() {

  const [sendToAddress, setSendToAddress] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [selectedTokenSymbol, setSelectedTokenSymbol] = useState<string>('');
  const [selectedTokenContractAddress, setSelectedTokenContractAddress] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { config } = usePrepareSendTransaction({
    to: sendToAddress,
    value: amount ? parseEther(amount) : undefined,  })

  const { data, sendTransaction } = useSendTransaction(config)

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  })
  // token options
  const tokenOptions = [
    { symbol: 'WETH', contractAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' }, //actual weth address
    { symbol: 'goerli ETH', contractAddress: '0xdD69DB25F6D620A7baD3023c5d32761D353D3De9' }, //actual usdc address
    { symbol: 'ZARP', contractAddress: '0xb755506531786C8aC63B756BaB1ac387bACB0C04' }, //actual zarp address (changed here)
    // Add more tokens as needed
  ];
  

  // Other contract functions
  const publicClient = createPublicClient({
    chain: goerli,
    transport: http(),
  });

  const walletclient = createWalletClient({
    chain: goerli,
    transport: custom(window.ethereum),
  });

  // send Token Function
  // send Token Function
const sendToken = async () => {
    console.log('sendToken function called');
    const userEnteredAddress = sendToAddress.trim();
    const userEnteredAmount = amount.trim();
  
    // Check for empty address input
    if (!userEnteredAddress) {
      console.error('Address input is empty');
      // You can also notify the user with a message or UI feedback
      return;
    }
  
    // Check for empty amount input
    if (!userEnteredAmount) {
      console.error('Amount input is empty');
      // You can also notify the user with a message or UI feedback
      return;
    }
  
    const formattedAddress = userEnteredAddress.startsWith('0x')
      ? userEnteredAddress
      : `0x${userEnteredAddress}`;
  
    try {
      const contract = getContract({
        address: `0x${selectedTokenContractAddress}` as `0x${string}`,
        abi: erc20ABI,
        publicClient,
      });
  
      const argsTransfer: [`0x${string}`, bigint] = [
        formattedAddress as `0x${string}`,
        BigInt(amount),
      ];
  
      // Simulate the token transfer operation
      const simulatedResult = await contract.simulate.transfer(argsTransfer);
             contract.simulate.approve(argsTransfer);
        
     //walletclient.writeContract(simulatedResult.request.functionName)

      // Check if the simulated result indicates a successful transfer
      if (simulatedResult.result) {
        // If the simulation was successful, proceed to send the actual transaction
        try {
          //const { hash } = sendTransaction?.name ;
          const results = simulatedResult.request.functionName;
          // Handle the transaction hash and success message here
          //console.log('Transaction Hash:', hash);
          console.log('Transaction Sent Successfully!', results);
        } catch (error) {
          console.error('Error sending transaction:', error);
        }
      } else {
        console.error('Token transfer simulation failed:');
        // You can also notify the user with a message or UI feedback
      }
    } catch (error) {
      console.error('Error preparing token transfer:', error);
      // You can also notify the user with a message or UI feedback
    }
  };
  

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleTokenSelect = (tokenAddress: string) => {
    // Logic to fetch the selected token's symbol and contract address
    const selectedToken = tokenOptions.find(
      (token) => token.contractAddress === tokenAddress
    );
    if (selectedToken) {
      setSelectedTokenSymbol(selectedToken.symbol);
      setSelectedTokenContractAddress(selectedToken.contractAddress);
    }
  };

  const { isConnected } = useAccount()
  if (isConnected) {

    return (
      <div className={styles.sendCard}>
        <Profile />
        <div className={styles.formGroup}>
          <form
           onSubmit={(e) => {
            e.preventDefault();
           sendTransaction?.()            }}          >

            <p>Recipient:</p>
            <input
              className={styles.input}
              onChange={(e) => setSendToAddress(e.target.value)}
              placeholder="0xA0Cf…251e"
              value={sendToAddress}
            />

            <p>Amount:</p>
            <div className={styles.inputContainer}>
              <input
                className={styles.input}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                value={amount}
              />
              <button
                className={styles.modalBtn}
                onClick={() => openModal()}
              >
                {selectedTokenSymbol || 'Token'}
              </button>
            </div>
            {/* Render the SelectToken modal */}
            {isModalOpen && (
              <SelectToken
                tokenOptions={tokenOptions}
                onSelectToken={handleTokenSelect}
                isOpen={isModalOpen}
                onClose={() => closeModal()}
              />
            )}     
          <button
            className={styles.button}
            disabled={isLoading  || !sendTransaction || !selectedTokenContractAddress ||!amount }
            onClick={() => {
                console.log('Button clicked'); // Add this line
                sendToken();}} // This calls the sendToken function
            
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
          {isSuccess && (
            <div>
              Successfully sent {amount} ether to {sendToAddress}
              <div>
                <a href={`https://etherscan.io/tx/${data?.hash}`}>Etherscan</a>
              </div>
            </div>
          )}

          </form>
        </div>
      </div>
    );
  }
  return (
    <div className={styles.sendCard} >

      <Profile />
    </div>
  )
}

export default SendTransaction;