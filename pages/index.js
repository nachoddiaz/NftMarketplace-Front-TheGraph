/* import Head from "next/head"
import Image from "next/image"
import styles from "../styles/Home.module.css"
import Header from "../components/Header"
import { useMoralis, useMoralisQuery } from "react-moralis" */
import NFTBox from "../components/NFTBox"
import networkMapping from "../constants/networkMapping.json"
import GET_ACTIVE_ITEMS from "../constants/subgraphQueries"
import { useQuery } from "@apollo/client"

export default function Home() {
    const chainString = chainId ? parseInt(chainId).toString() : "31337"
    const marketplaceAddress = networkMapping[chainString]

    const { loading, error, data: listedNfts } = useQuery(GET_ACTIVE_ITEMS)

    return (
        <div className="container mx-auto">
            <hi className="py-4 px-4 font-bold text-2xl">Recently Listed</hi>
            <div className="flex flex-wrap">
                {loading || !listedNfts ? (
                    <div>Loading... </div>
                ) : (
                    listedNfts.activeItems.map((nft) => {
                        console.log(nft)
                        const { price, nftAddress, tokenId, seller } = nft
                        return (
                            <NFTBox>
                                price={price}
                                nftAddress={nftAddress}
                                tokenId={tokenId}
                                marketplaceAddress={marketplaceAddress}
                                seller={seller}
                                key={`${nftAddress}${tokenId}`}
                            </NFTBox>
                        )
                    })
                )}
            </div>
        </div>
    )
}
