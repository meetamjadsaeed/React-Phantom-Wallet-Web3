import React, { useState, useEffect } from "react";
import { Transaction, PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { toast } from "react-toastify";

const TokenTransferForm = ({
  connection,
  walletPublicKey,
  fetchTokenBalances,
}) => {
  const [recipientAddress, setRecipientAddress] = useState("");
  const [tokenAmount, setTokenAmount] = useState(0);
  const [selectedToken, setSelectedToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const { publicKey, sendTransaction } = useWallet();
  const [tokenBalances, setTokenBalances] = useState([]);

  useEffect(() => {
    const fetchTokenBalances = async () => {
      // Fetch token balances here and update the state
      // This logic depends on your specific implementation
    };

    fetchTokenBalances();
  }, []);

  const handleRecipientAddressChange = (e) => {
    setRecipientAddress(e.target.value);
  };

  const handleTokenAmountChange = (e) => {
    setTokenAmount(Number(e.target.value));
  };

  const handleTokenSelect = (e) => {
    const selectedTokenSymbol = e.target.value;
    const selectedToken = tokenBalances.find(
      (token) => token.symbol === selectedTokenSymbol
    );
    setSelectedToken(selectedToken);
  };

  const sendTokenHandler = async () => {
    try {
      if (!publicKey) {
        toast.error("Wallet Not connected");
        return;
      }

      if (!selectedToken) {
        toast.error("Please select a token");
        return;
      }

      setLoading(true);

      // Get the token account of the selected token
      const token = new Token(
        connection,
        new PublicKey(selectedToken.address),
        TOKEN_PROGRAM_ID
      );

      // Create a transaction for token transfer
      const transaction = new Transaction().add(
        Token.createTransferInstruction(
          TOKEN_PROGRAM_ID,
          new PublicKey(walletPublicKey),
          new PublicKey(recipientAddress),
          publicKey,
          [],
          tokenAmount
        )
      );

      // Send the transaction
      const signature = await sendTransaction(transaction, connection);

      // Confirm the transaction
      await connection.confirmTransaction(signature, "processed");

      toast.success("Token Transfer Successful");
      fetchTokenBalances();
      setLoading(false);
    } catch (error) {
      toast.error("Error: " + error?.message);
      setLoading(false);
    }
  };

  return (
    <div className="content">
      <select onChange={handleTokenSelect}>
        <option value="" disabled selected>
          Select a Token
        </option>
        {tokenBalances.map((token) => (
          <option key={token.address} value={token.symbol}>
            {token.symbol}
          </option>
        ))}
      </select>
      <br />
      <input
        value={recipientAddress}
        type="text"
        onChange={handleRecipientAddressChange}
        placeholder="Recipient Address"
        className="input-field"
      />
      <br />
      <input
        value={tokenAmount}
        type="number"
        onChange={handleTokenAmountChange}
        placeholder="Token Amount"
        className="input-field"
      />
      <br />
      <button
        className="btn send-button"
        disabled={!publicKey || !selectedToken || loading}
        onClick={sendTokenHandler}
      >
        {loading ? "Transferring..." : "Transfer Token"}
      </button>
    </div>
  );
};

export default TokenTransferForm;
