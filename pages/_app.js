import "../styles/globals.css"
/* import { MoralisProvider } from "react-moralis" */
import Header from "../components/Header"
import Head from "next/head"
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client"

const client = new ApolloClient({
    chache: new InMemoryCache(),
    uri: "https://api.studio.thegraph.com/query/960/nftmarketplace/v0.0.2",
})

function MyApp({ Component, pageProps }) {
    return (
        <div>
            <Head>
                <title>NFT MarketPlace</title>
                <meta name="description" content="Home page of the NFT Marketplace" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            {/* <MoralisProvider initializeOnMount={false}> */}
                <ApolloProvider client={client}>
                    {/* <NotificationProvider> */}
                        <Header />
                        <Component {...pageProps} />
                    {/* </NotificationProvider> */}
                </ApolloProvider>
           {/*  </MoralisProvider> */}
        </div>
    )
}

export default MyApp
