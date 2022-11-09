import { ethers } from "ethers"
import Head from "next/head"
import Image from "next/image"
import { Form, useNotification } from "web3uikit"
import styles from "../styles/Home.module.css"
import nftAbi from "constants/abi.jsonBasicNFT"
import { useMoralis, useWeb3Contract } from "react-moralis"
import nftMarketplaceAbi from "constants/abi.jsonNftMarketplace"
import networkMapping from "../constants/networkMapping.json"

export default function Home() {
    const { chainId } = useMoralis()
    const chainString = chainId ? parseInt(chainId).toString() : "31337"
    const marketplaceAddress = networkMapping[chainString][0]

    const { runContractFunction } = useWeb3Contract()

    async function approveAndList(data) {
        console.log("Approving...")
        const nftAddress = data.data[0].inputResult
        const tokenId = data.data[1].inputResult
        const price = ethers.utils.parseUnits(data.data[2].inputResult, "ether").toString()

        const approveOptions = {
            abi: nftAbi,
            contractAddress: marketplaceAddress,
            functionName: "updateLsting",
            params: {
                nftAddress: nftAddress,
                tokenId: tokenId,
                newPrice: ethers.utils.parseEther(priceToUpdateListing || "0"),
            },
        }

        await runContractFunction({
            params: approveOptions,
            onError: (error) => {
                console.log(error)
            },
            onSuccess: () => hadleApproveSuccess(nftAddress, tokenId, price),
        })
    }

    async function hadleApproveSuccess(nftAddress, tokenId, price) {
        const listOptions = {
            abi: nftMarketplaceAbi,
            contractAddress: marketplaceAddress,
            functionName: "ListItem",
            params: {
                nftAddress: nftAddress,
                tokenId: tokenId,
                price: price,
            },
        }

        await runContractFunction({
            params: listOptions,
            onError: (error) => {
                console.log(error)
            },
            onSuccess: () => hadleListSuccess(),
        })
    }

    const dispatch = useNotification()

    async function hadleListSuccess() {
        dispatch({
            type: "success",
            message: "NFT Listed",
            title: "NFT Listed",
            position: "topR",
        })
    }

    return (
        <div className={styles.container}>
            <Form
                //We need the MP to take the NFT from our wallets
                onSubmit={approveAndList}
                data={[
                    {
                        name: "NFT Address",
                        type: "text",
                        inputWidth: "50%",
                        value: "",
                        key: "nftAddress",
                    },
                    {
                        name: "TokenId",
                        type: "number",
                        value: "",
                        key: "tokenId",
                    },
                    {
                        name: "Price in ETH",
                        type: "number",
                        value: "",
                        key: "price",
                    },
                ]}
                title="Sell your NFT"
                id="Main Form"
            />
            Sell Page
        </div>
    )
}
