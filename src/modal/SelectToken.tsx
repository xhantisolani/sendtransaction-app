import React, { useState } from 'react';
import Modal from 'react-modal';
import styles from './SelectToken.module.css';

interface TokenOption {
  symbol: string;
  contractAddress: string;
}

interface SelectTokenProps {
  onSelectToken: (token: string) => void;
  isOpen: boolean;
  onClose: () => void;
  tokenOptions: TokenOption[]; // Add tokenOptions as a prop
  
}

function SelectToken({ onSelectToken, isOpen, onClose, tokenOptions }: SelectTokenProps) {
  const [selectedToken, setSelectedToken] = useState('');

  const handleTokenChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedToken(event.target.value);
  };

  const handleSelect = () => {
    if (!selectedToken) {
      alert('Please select a token.');
      return;
    }

    onSelectToken(selectedToken);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Select Token"
      className={styles.modal} // modal styles here
      overlayClassName={styles.overlay} //  overlay styles here
    >
      <h2>Select a Token</h2>
      <select value={selectedToken} onChange={handleTokenChange}>
          <option value="">Select a token</option>
          {tokenOptions.map((token) => (
         <option key={token.contractAddress} value={token.contractAddress}>
         {token.symbol}
         </option>  ))}
      </select>
      <button onClick={handleSelect}>Select</button>
    </Modal>
  );
}

export default SelectToken;