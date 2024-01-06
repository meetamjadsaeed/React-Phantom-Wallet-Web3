import React, { useCallback, useEffect, useState } from "react";
import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
  clusterApiUrl,
} from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { toast } from "react-toastify";

import {
  phatomEnvironment,
  solonaKey,
  solonaNetworkUrl,
  tokenSymbolName,
  walletPublicKeyGlobally,
} from "../helpers";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import TokenTransferForm from "./transfer/TokenTransferForm";

const Content = () => {
  const [lamports, setLamports] = useState(0.001);
  const [tokenBalances, setTokenBalances] = useState([]);
  const [fetchBalLoader, setFetchBalLoader] = useState(false);
  const [solBalance, setSolBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tokenSymbol, setTokenSymbol] = useState(tokenSymbolName);
  const [walletPublicKey, setWalletPublicKey] = useState(
    walletPublicKeyGlobally
  );
  const [tokenAddress, setTokenAddress] = useState(null);
  const connection = new Connection(clusterApiUrl(phatomEnvironment));
  const { publicKey, sendTransaction } = useWallet();

  const [recipientAddress, setRecipientAddress] = useState("");
  const [tokenAmount, setTokenAmount] = useState(0);

  const sendSolHandler = useCallback(async () => {
    try {
      if (!publicKey) {
        toast.error("Wallet not connected");
        return;
      }

      setLoading(true);

      const balance = await connection.getBalance(publicKey);
      let lamportsI = LAMPORTS_PER_SOL * lamports;

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(walletPublicKey),
          lamports: lamportsI,
        })
      );

      const signature = await sendTransaction(transaction, connection);

      await connection.confirmTransaction(signature, "Processed");

      toast.success("Transaction successful");
      setTheLamports("");
      fetchSolBalance();
      setLoading(false);
    } catch (error) {
      toast.error("Error: " + error?.message);
      setLoading(false);
    }
  }, [publicKey, sendTransaction, connection, lamports, walletPublicKey]);

  const setTheLamports = (e) => {
    const { value } = e.target ?? {};
    setLamports(Number(value));
  };

  const fetchSolBalance = async () => {
    if (!publicKey) {
      return;
    }

    const balanceInLamports = await connection.getBalance(publicKey);
    const balanceInSol = balanceInLamports / LAMPORTS_PER_SOL;

    setSolBalance(balanceInSol);
  };

  const fetchTokenBalances = async () => {
    setFetchBalLoader(true);

    if (!publicKey) {
      setFetchBalLoader(false);
      return;
    }

    const tokenAccounts = await connection.getTokenAccountsByOwner(publicKey, {
      programId: TOKEN_PROGRAM_ID,
    });

    const balances = await Promise.all(
      tokenAccounts?.value?.map(async (accountInfo) => {
        const publicKey = new PublicKey(accountInfo.pubkey);
        const token = new Token(connection, publicKey, TOKEN_PROGRAM_ID);
        const balance = await token.getBalance(publicKey);
        const symbol = tokenAddress[publicKey.toBase58()];

        return { publicKey, balance, symbol };
      })
    );

    setTokenBalances(balances);
    setFetchBalLoader(false);
  };

  const getTokenAddress = async () => {
    try {
      const connection = new Connection(solonaNetworkUrl, "singleGossip");
      const tokenList = await connection.getTokenAccountsByOwner(
        new PublicKey(walletPublicKey),
        { programId: new PublicKey(solonaKey) }
      );

      const filteredTokens = tokenList.value.filter(
        (token) => token.account.data.parsed.info.symbol === tokenSymbol
      );

      if (filteredTokens.length === 0) {
        toast.error(`No tokens found with symbol ${tokenSymbol}`);
      } else {
        setTokenAddress(filteredTokens[0].pubkey.toString());
      }
    } catch (error) {
      toast.error("Error: " + error?.message);
    }
  };

  const handleTokenSymbolChange = (e) => {
    setTokenSymbol(e.target.value);
  };

  useEffect(() => {
    getTokenAddress();
  }, [tokenSymbol]);

  useEffect(() => {
    fetchTokenBalances();
    fetchSolBalance();
  }, [publicKey]);

  const RenderTokenBalances = () => {
    return (
      <div className="token-balances">
        <h2>Your Token Balances:</h2>
        <ul>
          {fetchBalLoader ? (
            <p
              style={{
                color: "#007bff",
                fontWeight: "bold",
                fontSize: "20px",
                textAlign: "center",
              }}
            >
              Loading...
            </p>
          ) : tokenBalances.length === 0 ? (
            <p
              style={{
                color: "#007bff",
                fontWeight: "bold",
                fontSize: "20px",
                textAlign: "center",
              }}
            >
              No tokens found
            </p>
          ) : (
            tokenBalances?.map((tokenBalance) => {
              const toStringBalance = tokenBalance?.balance?.toString();
              const key = tokenBalance?.publicKey?.toBase58();
              const symbol = tokenBalance?.symbol;
              return (
                <li key={key}>
                  {symbol}: {toStringBalance} tokens
                </li>
              );
            })
          )}
        </ul>
      </div>
    );
  };

  const RenderContent = () => {
    return (
      <div className="dashboard">
        <div className="balance">
          <h2>Your Balance:</h2>
          <p className="balance-amount">
            {publicKey ? solBalance : !publicKey ? "Wallet not connected" : 0}{" "}
            {publicKey && "SOL"}
          </p>
        </div>
        <div className="content">
          <input
            value={lamports}
            type="number"
            onChange={(e) => setTheLamports(e)}
            placeholder="Enter Lamports"
            className="input-field"
          />
          <br />
          <input
            value={walletPublicKey}
            type="text"
            onChange={(e) => setWalletPublicKey(e.target.value)}
            placeholder="Enter Hash"
            className="input-field"
          />
          <br />
          <button
            className="btn send-button"
            disabled={!publicKey || loading}
            onClick={sendSolHandler}
          >
            {loading ? "Sending..." : "Send SOL"}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="App">
      <header className="navbar">
        <nav className="navbar-inner">
          <ul className="nav"></ul>
          <ul className="nav pull-right">
            <li>
              <a href="#" className="nav-link">
                White Paper
              </a>
            </li>
            <li className="divider-vertical"></li>
            <li>
              <WalletMultiButton />
            </li>
          </ul>
        </nav>
      </header>
      <RenderContent />
      <RenderTokenBalances />
      <details>
        <summary>
          <h5 className="balance-amount">Click to Token Transfer</h5>
        </summary>
        <TokenTransferForm
          connection={connection}
          walletPublicKey={walletPublicKey}
          tokenAddress={tokenAddress}
          fetchTokenBalances={fetchTokenBalances}
        />
      </details>
    </div>
  );
};

export default Content;
