import { SendTransaction } from './components/sendTransaction'
import { WagmiConfig, createConfig, configureChains } from 'wagmi'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { goerli } from 'wagmi/chains'

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [goerli],
  [alchemyProvider({ apiKey: 'yourAlchemyApiKey' }), publicProvider()],
)

// Setting up wagmi config
export const config = createConfig({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
   
    new WalletConnectConnector({
      chains,
      options: {
        projectId: '...',
      },
    }),
   
  ],
  publicClient,
  webSocketPublicClient,
})

export function App() {
  
    return (
            <WagmiConfig config={config}>          
                                             
              <SendTransaction/>
               
           </WagmiConfig>
    ) 

 
}

export default App;