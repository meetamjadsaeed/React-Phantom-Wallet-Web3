// Token Transfer Functionality:

// Allow users to transfer tokens to other addresses. You can create a new section where users can select the token and input the recipient's address.

import React, { useState } from "react";
import { Transaction, PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { toast } from "react-toastify";

const TokenTransferForm = ({
  connection,
  walletPublicKey,
  tokenAddress,
  fetchTokenBalances,
}) => {
  const [recipientAddress, setRecipientAddress] = useState("");
  const [tokenAmount, setTokenAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { publicKey, sendTransaction } = useWallet();

  const handleRecipientAddressChange = (e) => {
    setRecipientAddress(e.target.value);
  };

  const handleTokenAmountChange = (e) => {
    setTokenAmount(Number(e.target.value));
  };

  const sendTokenHandler = async () => {
    try {
      if (!publicKey) {
        toast.error("Wallet Not connected");
        return;
      }

      setLoading(true);

      // Get the token account of the selected token
      const token = new Token(
        connection,
        new PublicKey(tokenAddress),
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
      <p className="balance-amount">Token Transfer</p>
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
        disabled={!publicKey || loading}
        onClick={sendTokenHandler}
      >
        {loading ? "Transferring..." : "Transfer Token"}
      </button>
    </div>
  );
};

export default TokenTransferForm;
