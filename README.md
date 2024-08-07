# React Phantom Wallet App

This project is a React application integrated with Phantom Wallet for Solana blockchain.

## Overview

The application provides features for interacting with the Solana blockchain using various wallet adapters from the `@solana/wallet-adapter` and `@solana/wallet-adapter-react-ui` libraries.

## Features

- **Wallet Integration:** Supports multiple wallet adapters including Phantom, Ledger, Sollet, and more.
- **Balance Display:** Shows the user's SOL balance.
- **Token Balances:** Displays balances of tokens associated with the connected wallet.
- **Transaction Handling:** Allows users to send SOL to other addresses.
- **Token Address Lookup:** Retrieves the address of a specific token based on symbol and wallet.

## Environment Setup

### Prerequisites

- Node.js installed
- npm or yarn installed

### Installation

1. Clone the repository: `git clone https://github.com/meetamjadsaeed/React-Phantom-Wallet-App.git`
2. Navigate to the project directory: `cd react-phantom-wallet-app`

### Running the Application

#### Backend

The application doesn't have a traditional backend but interacts directly with the Solana blockchain.

#### Frontend

1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install` or `yarn install`
3. Start the development server: `npm start` or `yarn start`

## Configuration

- Configure environment variables in `.env` file if necessary.

## Project Structure

- **`Context.js`:** Manages connection and wallet providers.
- **`Content.js`:** Displays user interface and handles wallet interactions.

## Technologies Used

- **React:** Frontend library for building user interfaces.
- **Phantom Wallet:** Wallet adapter for Solana blockchain.
- **Solana Web3.js:** JavaScript library for interacting with Solana blockchain.

## License

This project is licensed under the [MIT License](link-to-license).
