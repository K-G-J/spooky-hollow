import '../styles/globals.css'
import { useState } from 'react'
import Link from 'next/link'
import { ethers } from 'ethers';
import Web3Modal from 'web3modal'
import WalletConnectProvider from '@walletconnect/web3-provider'
import { AccountContext } from '../context'
import { ownerAddress } from '../config'

/* update with Moralis hooks */

function MyApp({ Component, pageProps }) {
  /* create local state to save account information after signin */
  const [account, setAccount] = useState(null);
  /* web3Modal configuration for enabling wallet access */
  async function getWeb3Modal() {
    const web3Modal = new Web3Modal({
      network: 'mumbai',
      cacheProvider: false,
      providerOptions: {
        walletconnect: {
          package: WalletConnectProvider,
          options: {
            infuraId: process.env.NEXT_PUBLIC_INFURA_ID
          }
        }
      }
    });
    return web3Modal;
  }

  /* the connect function uses web3 modal to connect to the user's wallet */
  async function connect() {
    try {
      const web3Modal = await getWeb3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const accounts = await provider.listAccounts();
      setAccount(accounts[0]);
    } catch (err) {
      console.log('error:', err);
    }
  }

  return (
    <div className="h-screen leading-normal tracking-normal text-green-200 m-0 bg-cover bg-fixed bg-spooky">
      <nav className="border-b p-6 text-5xl">
        Spook
        <span className="text-5xl bg-clip-text text-transparent bg-gradient-to-r from-green-200 via-yellow-500 to-purple-600">
          yHollow
        </span>
        <div className="flex mt-4">
          <Link href="/">
            <a className="mr-4 text-green-400 text-3xl">Haunted Forest</a>
          </Link>
          {!account && (
            <button
              className="bg-gradient-to-r from-purple-600 to-green-200 hover:from-yellow-500 hover:to-green-200 text-white font-bold py-2 px-4 rounded focus:ring transform transition hover:scale-105 duration-300 ease-in-out mr-4 text-2xl"
              onClick={connect}
            >
              Connect
            </button>
          )}
          {account && (
            <Link href="/my-nfts">
              <a className="mr-6 text-green-400 text-3xl">My Spooks</a>
            </Link>
          )}

          {account === ownerAddress && (
            <>
              <Link href="/create-nft">
                <a className="mr-6 text-green-400 text-3xl">Sell NFT</a>
              </Link>
              <Link href="/dashboard">
                <a className="mr-6 text-green-400 text-3xl">Dashboard</a>
              </Link>
            </>
          )}
        </div>
      </nav>
      <AccountContext.Provider value={account}>
        <Component {...pageProps} />
      </AccountContext.Provider>
    </div>
  );
}

export default MyApp
